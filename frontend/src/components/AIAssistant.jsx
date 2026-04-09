import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { KNOWLEDGE_BASE } from '../constants/knowledgeBase';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Halo! Saya Asisten AI Portal Pemdi. Ada yang bisa saya bantu terkait sistem evaluasi SPBE?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    const [engine, setEngine] = useState('Gemini'); // Status engine aktif

    // API Keys dari Environment Variables
    const API_KEYS = {
        gemini: import.meta.env.VITE_GEMINI_KEY || '',
        groq: import.meta.env.VITE_GROQ_KEY || '',
        deepseek: import.meta.env.VITE_DEEPSEEK_KEY || ''
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        const tryGemini = async () => {
            if (!API_KEYS.gemini) throw new Error('Gemini Key tidak tersedia');
            setEngine('Gemini (Utama)');
            const resp = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEYS.gemini}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `KNOWLEDGE: ${KNOWLEDGE_BASE}\n\nUSER: ${userMessage}` }] }]
                })
            });
            const data = await resp.json();
            if (data.error) throw new Error(data.error.message);
            return data.candidates?.[0]?.content?.parts?.[0]?.text;
        };

        const tryGroq = async () => {
            if (!API_KEYS.groq) throw new Error('Groq Key tidak tersedia');
            setEngine('Groq (Cadangan 1)');
            const resp = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEYS.groq}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: `Kamu adalah asisten AI Portal Pemdi. Gunakan data ini: ${KNOWLEDGE_BASE}` },
                        { role: "user", content: userMessage }
                    ]
                })
            });
            const data = await resp.json();
            if (data.error) throw new Error(data.error.message);
            return data.choices?.[0]?.message?.content;
        };

        try {
            let aiResponse = '';
            
            // Strategi: Coba Gemini dulu, jika gagal coba Groq
            try {
                aiResponse = await tryGemini();
            } catch (err) {
                console.warn('Gemini Gagal, mencoba Groq...', err.message);
                setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Gemini (Utama) terkendala: ${err.message}. Mencoba mesin cadangan...` }]);
                aiResponse = await tryGroq();
            }

            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: `❌ Semua mesin (Gemini & Groq) gagal merespon. Mohon cek API Key di Vercel/Env.` }]);
        } finally {
            setLoading(false);
            setEngine('Idle');
        }
    };

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
                        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black text-sm uppercase tracking-widest">AI Assistant</h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">
                                        {loading ? `Engines: ${engine}...` : 'Status: Online'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setMessages([{ role: 'assistant', content: 'Halo! Saya Asisten AI Portal Pemdi. Ada yang bisa saya bantu terkait sistem evaluasi SPBE?' }])}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    title="Bersihkan Chat"
                                >
                                    <Trash2 size={16} className="text-slate-400" />
                                </button>
                                <Sparkles size={18} className="text-amber-400 animate-pulse" />
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-3xl text-xs font-medium leading-relaxed shadow-sm ${
                                        msg.role === 'user' 
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
