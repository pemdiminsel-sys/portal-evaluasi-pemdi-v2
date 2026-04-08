import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, User, Phone, Mail, Lock, Upload, ClipboardCheck, 
  ArrowRight, Loader2, ShieldCheck, Briefcase, ChevronLeft 
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [opds, setOpds] = useState([]);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        nama: '', email: '', password: '', whatsapp: '', jabatan: '', opd_id: ''
    });

    useEffect(() => {
        const fetchOPD = async () => {
            const { data } = await supabase.from('opds').select('id, nama').order('nama');
            setOpds(data || []);
        };
        fetchOPD();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Upload Surat Tugas ke Supabase Storage
            let suratUrl = null;
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${formData.nama.replace(/\s/g, '_')}.${fileExt}`;
                const { data, error: uploadError } = await supabase.storage
                    .from('surat-tugas')
                    .upload(`requests/${fileName}`, file);
                
                if (uploadError) throw uploadError;
                suratUrl = data.path;
            }

            // 2. Request Pendaftaran lewat Edge Function API
            const { data: regRes, error: regError } = await supabase.functions.invoke('api', {
                body: {
                    action: 'register',
                    name: formData.nama,
                    email: formData.email,
                    password: formData.password,
                    whatsapp: formData.whatsapp,
                    jabatan: formData.jabatan,
                    opd_id: formData.opd_id,
                    surat_tugas_url: suratUrl
                }
            });

            if (regError || !regRes.success) throw new Error(regError?.message || regRes.message);

            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-[2rem] pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-6`}>
                    <div className="flex-1 w-0">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <ClipboardCheck className="h-10 w-10 text-emerald-500 bg-emerald-50 p-2 rounded-xl" />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Pendaftaran Terkirim!</p>
                                <p className="mt-1 text-xs font-bold text-slate-400">Akun Anda sedang ditinjau oleh Admin. Instruksi aktivasi akan dikirim ke WhatsApp/Email Anda.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ), { duration: 6000 });

            navigate('/login');
        } catch (err) {
            toast.error(`Registrasi Gagal: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-red-100/50 rounded-full blur-[120px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-indigo-100/50 rounded-full blur-[120px] -ml-32 -mb-32"></div>

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden relative z-10 border border-white">
                {/* Left Side: Info */}
                <div className="bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                         <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
                         <div className="absolute bottom-20 right-20 w-64 h-64 bg-red-500 rounded-full"></div>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-12">
                            <img src="/logo-minsel.png" alt="Minsel" className="w-12 h-auto" />
                            <div>
                                <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Portal Evaluasi</h1>
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none">Minahasa Selatan</span>
                            </div>
                        </div>
                        <h2 className="text-4xl font-black mb-6 leading-tight">Registrasi <br/>PIC Indikator OPD</h2>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="bg-white/10 p-2 rounded-xl text-red-400"><ShieldCheck size={20}/></div>
                                <div><p className="font-bold text-sm">Verifikasi Dokumen</p><p className="text-xs text-slate-400">Pendaftaran wajib melampirkan Surat Tugas resmi dari Kepala OPD.</p></div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-white/10 p-2 rounded-xl text-emerald-400"><ClipboardCheck size={20}/></div>
                                <div><p className="font-bold text-sm">Akses Mandiri</p><p className="text-xs text-slate-400">Isi data capaian dan upload dokumen bukti secara digital.</p></div>
                            </li>
                        </ul>
                    </div>

                    <div className="relative z-10 mt-20 pt-8 border-t border-white/10">
                         <p className="text-xs text-slate-500 font-bold italic">© 2026 Dinas Komunikasi dan Informatika Kab. Minahasa Selatan</p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="p-12 h-[85vh] overflow-y-auto scrollbar-hide">
                    <div className="flex justify-between items-center mb-10">
                         <Link to="/login" className="flex items-center gap-2 text-slate-400 font-bold hover:text-red-600 transition-colors">
                            <ChevronLeft size={20}/> Back to Login
                         </Link>
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Step 1 of 1: Identity Profile</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                    <input required placeholder="Nama Lengkap" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-12 py-4 focus:ring-4 focus:ring-red-100 outline-none font-bold" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Position</label>
                                <div className="relative group">
                                    <Briefcase size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                    <input required placeholder="Contoh: Pranata Komputer Ahli Muda" value={formData.jabatan} onChange={e => setFormData({...formData, jabatan: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-12 py-4 focus:ring-4 focus:ring-red-100 outline-none font-bold" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email (Official)</label>
                                <div className="relative group">
                                    <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                    <input required type="email" placeholder="email@minselkab.go.id" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-12 py-4 focus:ring-4 focus:ring-red-100 outline-none font-bold" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative group">
                                    <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                    <input required type="password" placeholder="Minimal 8 karakter" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-12 py-4 focus:ring-4 focus:ring-red-100 outline-none font-bold" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Phone</label>
                            <div className="relative group">
                                <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                <input required placeholder="0822..." value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-12 py-4 focus:ring-4 focus:ring-red-100 outline-none font-bold" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Perangkat Daerah (OPD)</label>
                            <div className="relative group">
                                <Building2 size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                <select required value={formData.opd_id} onChange={e => setFormData({...formData, opd_id: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-12 py-4 focus:ring-4 focus:ring-red-100 outline-none font-black opacity-80">
                                    <option value="">-- Pilih OPD Anda --</option>
                                    {opds.map(opd => <option key={opd.id} value={opd.id}>{opd.nama}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Surat Tugas PIC (PDF/Image)</label>
                            <div className="relative group">
                                <label className="w-full h-32 bg-dashed-red bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-red-400 transition-all">
                                    <Upload className={file ? "text-emerald-500 mb-2" : "text-slate-300 mb-2"} size={32} />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{file ? file.name : "Click to Upload File (Max 2MB)"}</span>
                                    <input type="file" className="hidden" accept=".pdf,image/*" onChange={e => setFile(e.target.files[0])} required />
                                </label>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button type="submit" disabled={loading}
                                className="w-full bg-slate-900 text-white font-black py-5 rounded-3xl shadow-2xl flex items-center justify-center gap-3 hover:bg-red-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <ClipboardCheck size={20} />}
                                DAFTAR SEBAGAI PIC OPD
                                <ArrowRight size={18} />
                            </button>
                            <p className="text-center text-xs font-bold text-slate-400 mt-6 tracking-wide italic">"Keabsahan data pendaftar akan diverifikasi oleh Admin Kominfo."</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
