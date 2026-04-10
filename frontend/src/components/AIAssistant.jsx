import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { KNOWLEDGE_BASE } from '../constants/knowledgeBase';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 2 && hour < 11) return 'Selamat Pagi';
        if (hour >= 11 && hour < 16) return 'Tabea';
        if (hour >= 16 && hour < 19) return 'Slamat Sore';
        return 'Malam Bae';
    };

    const [selectedAdmin, setSelectedAdmin] = useState(2); // Default ke Admin 2 (Groq) karena paling stabil
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: `${getGreeting()}! Saya Admin AI (${selectedAdmin}) Portal Pemdi Kabupaten Minahasa Selatan. Saya akan membantu terkait Evaluasi Pemdi Kabupaten Minahasa Selatan.`
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    const [engineStatus, setEngineStatus] = useState('Ready');

    // API Keys dari Environment Variables
    const API_KEYS = {
        gemini: import.meta.env.VITE_GEMINI_KEY || '',
        groq: import.meta.env.VITE_GROQ_KEY || '',
        deepseek: import.meta.env.VITE_DEEPSEEK_KEY || 'sk-a7e1876707284a99bf8518dc46877d88',
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        // Optimasi Knowledge Base untuk API (Batasi agar tidak terlalu besar)
        let optimizedKnowledge = KNOWLEDGE_BASE
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n');
            
        // Jika terlalu panjang (lebih dari 15rb karakter), potong agar API tidak Reject 413
        if (optimizedKnowledge.length > 15000) {
            optimizedKnowledge = optimizedKnowledge.substring(0, 15000) + "... (data dipotong)";
        }

        const tryGemini = async () => {
            if (!API_KEYS.gemini || API_KEYS.gemini.includes('kunci')) throw new Error('Key Admin 1 (Gemini) belum diisi di Vercel Dashboard');
            setEngineStatus('Admin 1...');
            
            const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEYS.gemini}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `Kamu adalah Pakar Evaluasi Pemdi Minahasa Selatan. Gunakan data berikut sebagai referensi:\n\n${optimizedKnowledge}\n\nPertanyaan User: ${userMessage}` }]
                    }]
                })
            });

            if (!resp.ok) {
                const errorData = await resp.text();
                throw new Error(`Gemini API Error (${resp.status}): ${errorData.substring(0, 100)}...`);
            }

            const data = await resp.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, Admin 1 tidak memberikan respon.';
        };

        const tryGroq = async () => {
            if (!API_KEYS.groq || API_KEYS.groq.includes('kunci')) throw new Error('Key Groq Kosong');
            setEngineStatus('Admin 2...');
            const resp = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEYS.groq}`
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [
                        { role: "system", content: `Kamu adalah Pakar Evaluasi Pemdi Minahasa Selatan. Jawab HANYA berdasarkan data ini:\n\n${optimizedKnowledge}` },
                        { role: "user", content: userMessage }
                    ]
                })
            });
            const data = await resp.json();
            if (data.error) throw new Error(data.error.message);
            return data.choices?.[0]?.message?.content;
        };

        const tryDeepSeek = async () => {
            setEngineStatus('Admin 3...');
            
            // Gunakan full path untuk menghindari 405 Method Not Allowed pada redirect
            const baseUrl = window.location.origin;
            const resp = await fetch(`${baseUrl}/api/v1/ai-proxy`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    engine: 'deepseek',
                    knowledge: optimizedKnowledge,
                    messages: [{ role: 'user', content: userMessage }]
                })
            });

            if (!resp.ok) {
                const errorText = await resp.text();
                if (resp.status === 504) throw new Error('Vercel Timeout (Admin 3 butuh waktu >10 detik). Silakan gunakan Admin 2 yang lebih cepat.');
                throw new Error(`Admin 3 Proxy Error (${resp.status}): ${errorText.substring(0, 50)}`);
            }

            const data = await resp.json();
            if (data.error) throw new Error(data.error);
            return data.content;
        };

        try {
            let aiResponse = '';

            if (selectedAdmin === 2) {
                try {
                    aiResponse = await tryGroq();
                } catch (err) {
                    console.error("Groq Error:", err);
                    setSelectedAdmin(1);
                    setMessages(prev => [...prev, { role: 'assistant', content: `Admin 2 sedang sibuk, saya coba hubungkan ke Admin 1...` }]);
                    try {
                        aiResponse = await tryGemini();
                    } catch (err2) {
                        console.error("Gemini Error:", err2);
                        setSelectedAdmin(3);
                        setMessages(prev => [...prev, { role: 'assistant', content: `Admin 1 juga sibuk, saya coba hubungkan ke Admin 3...` }]);
                        aiResponse = await tryDeepSeek();
                    }
                }
            } else if (selectedAdmin === 1) {
                try {
                    aiResponse = await tryGemini();
                } catch (err) {
                    console.error("Gemini Error:", err);
                    setSelectedAdmin(2);
                    setMessages(prev => [...prev, { role: 'assistant', content: `Admin 1 sedang sibuk, saya coba hubungkan ke Admin 2...` }]);
                    try {
                        aiResponse = await tryGroq();
                    } catch (err2) {
                        console.error("Groq Error:", err2);
                        setSelectedAdmin(3);
                        setMessages(prev => [...prev, { role: 'assistant', content: `Admin 2 juga sibuk, saya coba hubungkan ke Admin 3...` }]);
                        aiResponse = await tryDeepSeek();
                    }
                }
            } else {
                try {
                    aiResponse = await tryDeepSeek();
                } catch (err) {
                    console.error("DeepSeek Error:", err);
                    setSelectedAdmin(2);
                    setMessages(prev => [...prev, { role: 'assistant', content: `Admin 3 sedang sibuk, saya coba hubungkan ke Admin 2...` }]);
                    try {
                        aiResponse = await tryGroq();
                    } catch (err2) {
                        console.error("Groq Error:", err2);
                        setSelectedAdmin(1);
                        setMessages(prev => [...prev, { role: 'assistant', content: `Admin 2 juga sibuk, saya coba hubungkan ke Admin 1...` }]);
                        aiResponse = await tryGemini();
                    }
                }
            }

            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        } catch (err) {
            console.error("Final AI Error:", err);
            setMessages(prev => [...prev, { role: 'assistant', content: `DEBUG ERROR: ${err.message || 'Error tidak diketahui'}. Mohon pastikan API Key di Vercel sudah benar dan tekan Redeploy.` }]);
        } finally {
            setLoading(false);
            setEngineStatus('Ready');
        }
    };

    useEffect(() => {
        if (messages.length === 1 && messages[0].role === 'assistant') {
            setMessages([{
                role: 'assistant',
                content: `${getGreeting()}! Saya Admin AI (${selectedAdmin}) Portal Pemdi Kabupaten Minahasa Selatan. Saya akan membantu terkait Evaluasi Pemdi Kabupaten Minahasa Selatan.`
            }]);
        }
    }, [selectedAdmin]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, loading]);

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 bg-slate-900 border-4 border-white ${isOpen ? 'rotate-90' : 'rotate-0'}`}
            >
                {isOpen ? <X className="text-white" /> : <MessageSquare className="text-white" />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-100"
                    >
                        {/* Header */}
                        <div className="bg-slate-900 p-6 text-white flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                                        <Bot size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm uppercase tracking-widest">AI Bantuan Kominfo</h4>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase">
                                            {loading ? engineStatus : 'Status: Online'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setMessages([{
                                            role: 'assistant',
                                            content: `${getGreeting()}! Saya Admin AI (${selectedAdmin}) Portal Pemdi Kabupaten Minahasa Selatan. Saya akan membantu terkait Evaluasi Pemdi Kabupaten Minahasa Selatan.`
                                        }])}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        title="Bersihkan Chat"
                                    >
                                        <Trash2 size={16} className="text-slate-400" />
                                    </button>
                                    <Sparkles size={18} className="text-amber-400 animate-pulse" />
                                </div>
                            </div>

                            {/* Admin Selector */}
                            <div className="grid grid-cols-3 bg-white/5 rounded-xl p-1 border border-white/10">
                                <button
                                    onClick={() => setSelectedAdmin(1)}
                                    className={`py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${selectedAdmin === 1 ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Admin 1
                                </button>
                                <button
                                    onClick={() => setSelectedAdmin(2)}
                                    className={`py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${selectedAdmin === 2 ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Admin 2
                                </button>
                                <button
                                    onClick={() => setSelectedAdmin(3)}
                                    className={`py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${selectedAdmin === 3 ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Admin 3
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-3xl text-xs font-medium leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === 'user'
                                        ? 'bg-slate-900 text-white rounded-tr-none'
                                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin text-red-600" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase">AI sedang berpikir...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-slate-50 flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Tanyakan sesuatu..."
                                className="flex-1 bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 outline-none font-medium"
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading}
                                className="w-11 h-11 bg-red-600 text-white rounded-2xl flex items-center justify-center hover:bg-black transition-colors disabled:opacity-50"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AIAssistant;
