/* eslint-disable */
import { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Briefcase, Building2, ShieldCheck, 
  Loader2, Camera, Save, Lock, ArrowRight, ShieldAlert, ChevronRight
} from 'lucide-react';
import { supabase } from '../services/supabase';
import useAuthStore from '../store/authStore';
import { toast } from 'react-hot-toast';

const ProfileManagement = () => {
    const { user: authUser } = useAuthStore();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [formData, setFormData] = useState({
        name: '', whatsapp: '', jabatan: '', password: ''
    });
    const [showPasswordUI, setShowPasswordUI] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setFetchError(null);
            
            if (!authUser?.id) {
                setFetchError('Sesi login tidak valid. Silakan logout dan login kembali.');
                return;
            }

            const { data, error } = await supabase
                .from('users')
                .select('*, opds(*)')
                .eq('id', authUser.id)
                .single();
            
            if (error) {
                console.error('fetchProfile primary error:', error);
                // Fallback: fetch without relation
                const { data: dataSimple, error: errSimple } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', authUser.id)
                    .single();
                
                if (errSimple) throw errSimple;
                
                const finalUser = { ...dataSimple, opds: null };
                setUser(finalUser);
                setFormData({
                    name: finalUser.name || '',
                    whatsapp: finalUser.whatsapp || '',
                    jabatan: finalUser.jabatan || '',
                    password: ''
                });
                return;
            }

            // Relationship check (Supabase returns object if 1-1/N-1, or array if 1-N)
            let opdData = data.opds;
            if (Array.isArray(opdData)) opdData = opdData[0];

            const finalUser = { ...data, opd: opdData }; // Map to singular for easier use
            setUser(finalUser);
            setFormData({
                name: finalUser.name || '',
                whatsapp: finalUser.whatsapp || '',
                jabatan: finalUser.jabatan || '',
                password: ''
            });
        } catch (err) {
            console.error('fetchProfile full error:', err);
            setFetchError(err.message || 'Gagal mengambil data profil');
            toast.error('Gagal mengambil data profil');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (!authUser?.id) {
                throw new Error('User tidak teridentifikasi');
            }

            const updateData = {
                name: formData.name,
                whatsapp: formData.whatsapp,
                jabatan: formData.jabatan
            };

            if (formData.password && formData.password.trim() !== '') {
                updateData.password = formData.password.trim();
            }

            const { error } = await supabase
                .from('users')
                .update(updateData)
                .eq('id', authUser.id);

            if (error) {
                console.error('Update profile error:', error);
                throw error;
            }
            
            toast.success('✅ Profil berhasil diperbarui!');
            if (formData.password) {
                setFormData(prev => ({...prev, password: ''}));
                setShowPasswordUI(false);
            }
            await fetchProfile();
        } catch (err) {
            console.error('handleUpdate error:', err);
            toast.error('❌ Gagal menyimpan: ' + (err.message || 'Error tidak diketahui'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-red-600" size={48} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Sinkronisasi Profil Aman...</p>
        </div>
    );

    if (fetchError || !user) return (
        <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="bg-white rounded-[3rem] p-12 max-w-lg w-full text-center border border-red-100 shadow-sm">
                <ShieldAlert size={56} className="mx-auto text-red-400 mb-4" />
                <h2 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tighter">Gagal Memuat Profil</h2>
                <p className="text-sm font-bold text-slate-400 mb-6">{fetchError || 'Data profil tidak dapat dimuat. Silakan coba lagi.'}</p>
                <button
                    onClick={fetchProfile}
                    className="bg-red-600 text-white font-black px-8 py-3 rounded-2xl text-sm uppercase tracking-widest hover:bg-red-700 transition-all"
                >
                    Coba Lagi
                </button>
            </div>
        </div>
    );

    return (
        <div className="p-8 space-y-10 max-w-5xl mx-auto h-full overflow-y-auto scrollbar-hide pb-20">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 flex items-center gap-4 italic uppercase tracking-tighter">
                        <User className="text-red-600" size={40} /> Profil Akun
                    </h1>
                    <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-widest">Kelola identitas dan keamanan akun Anda</p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3">
                    <ShieldCheck size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Akun PIC Terverifikasi</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900 rounded-[3rem] p-8 text-center relative overflow-hidden group shadow-2xl">
                         <div className="absolute top-0 left-0 w-full h-full bg-red-600/10 group-hover:bg-red-600/20 transition-all duration-700"></div>
                         
                         <div className="relative z-10">
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-slate-900 font-black text-5xl italic border-4 border-white/20 shadow-inner">
                                    {String(user?.name || 'User').charAt(0).toUpperCase()}
                                </div>
                                <button className="absolute bottom-0 right-0 p-3 bg-red-600 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-slate-900">
                                    <Camera size={18}/>
                                </button>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{user?.name || 'User'}</h3>
                            <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-6">{user?.jabatan || 'No Position'}</p>
                            
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-3">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Mail size={14} className="text-red-500" />
                                    <span className="text-[11px] font-bold truncate">{user?.email || 'Tidak ada Email'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Building2 size={14} className="text-indigo-500" />
                                    <span className="text-[11px] font-bold truncate">{user?.opd?.nama || user?.opds?.nama || 'Pusat Pemerintahan'}</span>
                                </div>
                            </div>
                         </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex gap-4">
                        <div className="bg-amber-500 text-white p-3 rounded-xl shrink-0 h-fit shadow-lg shadow-amber-200">
                            <ShieldAlert size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Peringatan Keamanan</p>
                            <p className="text-xs font-bold text-amber-500/80 leading-relaxed italic">"Gunakan identitas asli sesuai SK Kepala OPD untuk memudahkan proses verifikasi data dukung."</p>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[3.5rem] border border-slate-100 p-12 shadow-sm">
                        <form onSubmit={handleUpdate} className="space-y-8">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <User size={12}/> Nama Pemilik Akun
                                    </label>
                                    <input required value={formData?.name || ''} onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-red-100 outline-none font-extrabold text-slate-800" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Phone size={12}/> Nomor WhatsApp
                                    </label>
                                    <input required value={formData?.whatsapp || ''} onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-emerald-100 outline-none font-extrabold text-slate-800" />
                                </div>
                             </div>

                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Briefcase size={12}/> Jabatan Resmi
                                </label>
                                <input required value={formData?.jabatan || ''} onChange={e => setFormData({...formData, jabatan: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-100 outline-none font-extrabold text-slate-800" />
                             </div>

                             {showPasswordUI && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <label className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <ShieldAlert size={12}/> Kata Sandi Baru
                                    </label>
                                    <input type="text" placeholder="Masukkan kata sandi baru..." value={formData?.password || ''} onChange={e => setFormData({...formData, password: e.target.value})}
                                        className="w-full bg-red-50 border border-red-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-red-200 outline-none font-extrabold text-slate-800 placeholder:font-normal placeholder:text-red-300" />
                                </div>
                             )}

                             <div className="pt-10 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Lock size={18} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Autentikasi Terverifikasi</p>
                                </div>
                                <button type="submit" disabled={saving}
                                    className="bg-slate-900 text-white font-black px-10 py-5 rounded-3xl shadow-xl flex items-center gap-3 hover:bg-red-600 hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50 group">
                                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    SIMPAN PERUBAHAN
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                             </div>
                        </form>
                    </div>

                    <div onClick={() => setShowPasswordUI(!showPasswordUI)} className={`mt-8 ${showPasswordUI ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'} rounded-[2.5rem] border p-8 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-all`}>
                        <div className="flex items-center gap-6">
                            <div className={`p-4 bg-white rounded-2xl ${showPasswordUI ? 'text-red-500 shadow-md shadow-red-100' : 'text-slate-400 shadow-sm'} group-hover:text-red-600 transition-colors`}>
                                <Lock size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 uppercase tracking-tighter italic">Perbarui Keamanan Sandi</h4>
                                <p className="text-xs font-bold text-slate-400">Protokol Keamanan: atur ulang kunci autentikasi sandi</p>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-200 group-hover:text-red-500 transition-all" size={24} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileManagement;
