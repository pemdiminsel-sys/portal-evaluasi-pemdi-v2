import { useState } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Shield, 
  KeyRound, 
  Save, 
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../services/api';

const Settings = () => {
    const { user, logout } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [toast, setToast] = useState(null);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            showToast('Konfirmasi password tidak cocok!', 'error');
            return;
        }

        setLoading(true);
        try {
            await api.post('/change-password', {
                current_password: passwords.current,
                new_password: passwords.new
            });
            showToast('Password berhasil diperbarui!');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            showToast(error.response?.data?.message || 'Gagal mengubah password.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="p-10 space-y-10 overflow-y-auto h-full max-w-5xl mx-auto scrollbar-hide">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-100">
                    <Shield size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Pengaturan Akun</h1>
                    <p className="text-slate-500 font-medium">Kelola profil dan keamanan akses Anda.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto mb-6 flex items-center justify-center text-indigo-600 font-extrabold text-3xl border-4 border-white shadow-xl relative z-10">
                            {user?.name?.[0].toUpperCase()}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 relative z-10">{user?.name}</h3>
                        <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest relative z-10">{user?.role === 1 ? 'ADMIN SISTEM' : 'OPERATOR OPD'}</p>
                        
                        <div className="mt-8 pt-8 border-t border-slate-50 space-y-4 text-left">
                            <div className="flex items-center gap-3 text-slate-500">
                                <Mail size={16} />
                                <span className="text-sm font-medium">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500">
                                <User size={16} />
                                <span className="text-sm font-medium">ID: #{user?.id}</span>
                            </div>
                        </div>

                        <button 
                            onClick={logout}
                            className="mt-8 w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            <LogOut size={18} /> Keluar Aplikasi
                        </button>
                    </div>
                </div>

                {/* Password Form */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10">
                    <div className="flex items-center gap-3 mb-10">
                         <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <KeyRound size={20} />
                         </div>
                         <h3 className="text-xl font-bold text-slate-800 underline decoration-indigo-200 decoration-4 underline-offset-8">Keamanan & Password</h3>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-8">
                        <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Password Saat Ini</label>
                             <div className="relative">
                                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input 
                                    required
                                    type="password" 
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 pl-14 pr-5 py-5 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 font-medium transition-all"
                                    placeholder="••••••••"
                                />
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Password Baru</label>
                                <input 
                                    required
                                    type="password" 
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 px-7 py-5 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 font-medium transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Konfirmasi Password Baru</label>
                                <input 
                                    required
                                    type="password" 
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 px-7 py-5 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 font-medium transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button 
                                disabled={loading}
                                type="submit" 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:bg-slate-300"
                            >
                                {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                Simpan Perubahan Keamanan
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-10 right-10 p-5 rounded-3xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 transition-all duration-300 border ${
                    toast.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                }`}>
                    {toast.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <span className="font-bold text-sm">{toast.message}</span>
                </div>
            )}
        </div>
    );
};

export default Settings;
