import { useState, useEffect } from 'react';
import { Mail, Save, Loader2, Server, Key, User as UserIcon, ShieldAlert, CheckCircle, RefreshCcw } from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

const SmtpSettings = () => {
    const [settings, setSettings] = useState({
        host: '',
        port: '',
        user: '',
        password: '',
        encryption: 'TLS',
        fromEmail: '',
        fromName: ''
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);

    useEffect(() => {
        // Karena ini mock UI, kita bisa menggunakan mock data default atau load dari localStorage sementara
        const savedSettings = localStorage.getItem('smtp_settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        } else {
            setSettings({
                host: 'smtp.gmail.com',
                port: '587',
                user: 'admin@minselkab.go.id',
                password: '••••••••••••',
                encryption: 'TLS',
                fromEmail: 'noreply@minselkab.go.id',
                fromName: 'Portal SPBE Kabupaten Minahasa Selatan'
            });
        }
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Simulasi save ke Supabase atau LocalStorage
            await new Promise(resolve => setTimeout(resolve, 1000));
            localStorage.setItem('smtp_settings', JSON.stringify(settings));
            toast.success('Pengaturan SMTP Berhasil Disimpan!');
        } catch (error) {
            toast.error('Gagal menyimpan pengaturan.');
        } finally {
            setSaving(false);
        }
    };

    const handleTestEmail = async () => {
        setTesting(true);
        try {
            // Simulasi pengiriman email test
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success('Email Testing Berhasil Dikirim!');
        } catch (error) {
            toast.error('Koneksi SMTP Gagal. Periksa konfigurasi.');
        } finally {
            setTesting(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto scrollbar-hide space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 flex items-center gap-4">
                        <Mail className="text-red-500" size={40} /> Konfigurasi SMTP
                    </h1>
                    <p className="text-slate-400 font-bold mt-1">Pengaturan Server Email untuk Notifikasi Sistem</p>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-50/50 rounded-bl-[100%] z-0"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                    
                    {/* Server Settings */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-4">
                             <Server className="text-red-400" size={24} />
                             <h2 className="text-xl font-black text-slate-800 tracking-tighter">Pengaturan Server</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">SMTP Host</label>
                                <input type="text" value={settings.host} onChange={e => setSettings({...settings, host: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold focus:ring-2 focus:ring-red-500/20 outline-none" placeholder="smtp.gmail.com" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">SMTP Port</label>
                                    <input type="number" value={settings.port} onChange={e => setSettings({...settings, port: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold focus:ring-2 focus:ring-red-500/20 outline-none" placeholder="587" />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Enkripsi</label>
                                    <select value={settings.encryption} onChange={e => setSettings({...settings, encryption: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold focus:ring-2 focus:ring-red-500/20 outline-none">
                                        <option value="TLS">TLS</option>
                                        <option value="SSL">SSL</option>
                                        <option value="NONE">Tanpa Enkripsi</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Authentication Settings */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-4">
                             <Key className="text-red-400" size={24} />
                             <h2 className="text-xl font-black text-slate-800 tracking-tighter">Autentikasi & Pengirim</h2>
                        </div>

                        <div className="space-y-4">
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Username</label>
                                    <input type="text" value={settings.user} onChange={e => setSettings({...settings, user: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold focus:ring-2 focus:ring-red-500/20 outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Password / App Key</label>
                                    <input type="password" value={settings.password} onChange={e => setSettings({...settings, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold focus:ring-2 focus:ring-red-500/20 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Email Pengirim (From)</label>
                                <input type="email" value={settings.fromEmail} onChange={e => setSettings({...settings, fromEmail: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold focus:ring-2 focus:ring-red-500/20 outline-none" />
                            </div>
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Nama Pengirim (From Name)</label>
                                <input type="text" value={settings.fromName} onChange={e => setSettings({...settings, fromName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold focus:ring-2 focus:ring-red-500/20 outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="flex items-center gap-4 bg-slate-900 text-slate-300 p-4 rounded-2xl w-full md:w-auto">
                        <ShieldAlert size={20} className="text-red-500" />
                        <p className="text-xs font-bold leading-relaxed">Gunakan **App password** jika menggunakan<br/>Gmail agar tidak diblokir.</p>
                     </div>

                     <div className="flex gap-4 w-full md:w-auto">
                         <button onClick={handleTestEmail} disabled={testing} className="flex-1 md:flex-none px-6 py-4 bg-slate-100 text-slate-600 font-black rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                            {testing ? <Loader2 className="animate-spin" size={18} /> : <RefreshCcw size={18} />} Uji Koneksi
                         </button>
                         <button onClick={handleSave} disabled={saving} className="flex-1 md:flex-none px-10 py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 hover:shadow-xl hover:shadow-red-200 transition-all flex items-center justify-center gap-2">
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Simpan Konfigurasi
                         </button>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default SmtpSettings;
