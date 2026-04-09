import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { 
  Users, UserPlus, Trash2, Edit2, Mail, Building2, Loader2, ShieldCheck, 
  Lock, Eye, EyeOff, CheckCircle, AlertCircle, X, ShieldAlert, Key, Phone, 
  Briefcase, FileText, ExternalLink, ThumbsUp, ThumbsDown, Layers
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
    const { user: authUser } = useAuthStore();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [opds, setOpds] = useState([]);
    const [aspeks, setAspeks] = useState([]);
    const [saving, setSaving] = useState(false);
    const [resending, setResending] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    
    const [form, setForm] = useState({ 
        name: '', email: '', password: '', role: 3, opd_id: '', aspek_id: '', whatsapp: '', jabatan: ''
    });

    const rolesMap = {
        1: { name: 'Super Admin', color: 'bg-red-600 text-white', icon: ShieldAlert, perm: 'Akses Penuh' },
        2: { name: 'Admin Pemkab', color: 'bg-indigo-600 text-white', icon: ShieldCheck, perm: 'Master Data' },
        3: { name: 'Operator OPD', color: 'bg-blue-500 text-white', icon: Building2, perm: 'Evaluasi Mandiri' },
        4: { name: 'Tim Asesor', color: 'bg-emerald-500 text-white', icon: CheckCircle, perm: 'Verifikasi' },
        5: { name: 'Pimpinan', color: 'bg-rose-500 text-white', icon: Eye, perm: 'Laporan Dashboard' },
        6: { name: 'Viewer', color: 'bg-slate-400 text-white', icon: Lock, perm: 'Hanya Baca' },
    };

    const statusMap = {
        0: { label: 'PENDING', color: 'bg-amber-50 text-amber-600 border-amber-200' },
        1: { label: 'ACTIVE', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
        2: { label: 'REJECTED', color: 'bg-red-50 text-red-600 border-red-200' },
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            let query = supabase.from('users').select('*, opds(*)').order('created_at', { ascending: false });
            if (authUser?.role === 4) {
                query = query.eq('role', 4);
            } else if (authUser?.role === 2) {
                // Admin Pemkab cannot see Super Admin (role 1) accounts
                query = query.neq('role', 1);
            }
            const { data: userData, error: uErr } = await query;
            if (uErr) {
                console.error("User Sync Error:", uErr);
                throw uErr;
            }
            setUsers(userData || []);

            const { data: opdData, error: oErr } = await supabase.from('opds').select('id, nama, singkatan').order('nama', { ascending: true });
            if (oErr) throw oErr;
            setOpds(opdData || []);

            const { data: aspekData } = await supabase.from('aspeks').select('id, nama').order('urutan', { ascending: true });
            setAspeks(aspekData || []);
        } catch (err) {
            toast.error('Gagal sinkronisasi data user');
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (userId, status) => {
        try {
            // Update status approval di database
            const { error } = await supabase.from('users').update({ status_approval: status }).eq('id', userId);
            if (error) throw error;

            // Jika disetujui, biarkan Edge Function yang fetch password via service_role
            if (status === 1) {
                try {
                    await supabase.functions.invoke('api', {
                        body: {
                            action: 'send_notification',
                            user_id: userId,
                            approval_email: true
                        }
                    });
                } catch (emailErr) {
                    console.error('Email approval gagal:', emailErr);
                }
            }

            toast.success(status === 1 ? 'User disetujui & email notifikasi terkirim!' : 'Pendaftaran user ditolak.');
            fetchData();
        } catch (err) {
            toast.error('Gagal memproses persetujuan');
        }
    };


    const checkOpdOwnership = (opdId, currentUserId) => {
        if (!opdId) return false;
        return users.some(u => u.opd_id === opdId && u.id !== currentUserId && u.status_approval === 1);
    };

    const handleOpenModal = (user = null) => {
        setShowPassword(false);
        if (user) {
            setCurrentUser(user);
            setForm({ 
                name: user.name, email: user.email, password: '', role: user.role || 3, 
                opd_id: user.opd_id || '', aspek_id: user.aspek_id || '', whatsapp: user.whatsapp || '', jabatan: user.jabatan || '' 
            });
        } else {
            setCurrentUser(null);
            setForm({ name: '', email: '', password: '', role: authUser?.role === 4 ? 4 : 3, opd_id: '', aspek_id: '', whatsapp: '', jabatan: '' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (currentUser) {
                const updatePayload = {
                    name: form.name, role: form.role, 
                    opd_id: form.role === 3 ? (form.opd_id || null) : null, 
                    aspek_id: form.role === 4 ? (form.aspek_id || null) : null,
                    whatsapp: form.whatsapp, jabatan: form.jabatan
                };
                if (form.password && form.password.trim() !== '') {
                    updatePayload.password = form.password.trim();
                }
                const { error } = await supabase.from('users').update(updatePayload).eq('id', currentUser.id);
                if (error) throw error;
                toast.success('Profil user berhasil diperbarui');
            } else {
                // ENROLL NEW USER (ADMIN)
                const { error } = await supabase.from('users').insert([{
                    name: form.name,
                    email: form.email,
                    password: form.password || 'Minsel123!', // Default password if empty
                    role: form.role,
                    opd_id: form.opd_id || null,
                    aspek_id: form.aspek_id || null,
                    whatsapp: form.whatsapp,
                    jabatan: form.jabatan,
                    status_approval: 1 // Admin enroll is automatically active
                }]);
                if (error) throw error;
                toast.success('User baru berhasil ditambahkan ke Matrix');
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            toast.error(`Error: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleResendActivation = async (user) => {
        setResending(user.id);
        try {
            // Kirim user_id ke Edge Function — password diambil di server dengan service_role
            const { data, error } = await supabase.functions.invoke('api', {
                body: {
                    action: 'send_notification',
                    user_id: user.id,
                    approval_email: false
                }
            });

            if (error) throw error;
            if (data && !data.success) throw new Error(data.message);
            toast.success(`Email aktivasi dikirim ulang ke ${user.email}`);
        } catch (err) {
            toast.error(`Gagal mengirim ulang: ${err.message}`);
        } finally {
            setResending(null);
        }
    };

    const handleDelete = async (userId, name) => {
        if (!window.confirm(`Sistem Keamanan: Apakah Anda yakin ingin mematikan akses dan menghapus user "${name}" secara permanen?`)) return;
        
        try {
            const { error } = await supabase.from('users').delete().eq('id', userId);
            if (error) throw error;
            toast.success(`User ${name} berhasil dihapus.`);
            fetchData();
        } catch (err) {
            toast.error(`Kegagalan Protokol: ${err.message}`);
        }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        const newStatus = currentStatus === 1 ? 2 : 1; // Toggle antara Active (1) dan Rejected/Inactive (2)
        try {
            const { error } = await supabase.from('users').update({ status_approval: newStatus }).eq('id', userId);
            if (error) throw error;
            toast.success(`Status user berhasil diperbarui.`);
            fetchData();
        } catch (err) {
            toast.error(`Gagal mengubah status: ${err.message}`);
        }
    };

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-red-600" size={48} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Security Protocol: User Sync In-Progress...</p>
        </div>
    );

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide pb-20">
             {/* Header */}
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 flex items-center gap-4 italic uppercase tracking-tighter">
                        <Key className="text-red-600" size={40} /> Admin Control Matrix
                    </h1>
                    <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-widest">Manajemen Persetujuan PIC & Hak Akses SPBE</p>
                </div>
                <button onClick={() => handleOpenModal()}
                    className="bg-red-600 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-red-100 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all">
                    <UserPlus size={20} /> Force Enroll User
                </button>
            </div>

            {/* Matrix Table */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 uppercase text-[10px] tracking-[0.2em] font-black text-slate-400">
                        <tr>
                            <th className="px-8 py-6">Identity & Verification</th>
                            <th className="px-8 py-6">Role & Status</th>
                            <th className="px-8 py-6">Organization Unit</th>
                            <th className="px-8 py-6 text-right">Action Bar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 italic font-medium">
                        {users.map(user => {
                            const role = rolesMap[user.role] || rolesMap[6];
                            const status = statusMap[user.status_approval] || statusMap[0];
                            const RoleIcon = role.icon;
                            const isOpdTaken = checkOpdOwnership(user.opd_id, user.id);

                            return (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="relative">
                                                <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.25rem] flex items-center justify-center font-black text-2xl shadow-xl italic rotate-3 group-hover:rotate-0 transition-transform">
                                                    {user.name?.charAt(0) || 'U'}
                                                </div>
                                                {user.status_approval === 0 && <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 border-4 border-white rounded-full animate-pulse"></div>}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 text-lg leading-tight flex items-center gap-2">
                                                    {user.name}
                                                    <div className="flex items-center gap-1.5">
                                                        {user.surat_tugas_url && (
                                                            <a href={`https://rgmxobrceqtnnxvmkhji.supabase.co/storage/v1/object/public/surat-tugas/${user.surat_tugas_url.startsWith('requests/') ? user.surat_tugas_url : 'requests/' + user.surat_tugas_url}`} target="_blank" rel="noreferrer" className="text-indigo-500 hover:text-indigo-700 p-1 hover:bg-indigo-50 rounded-lg transition-colors" title="Lihat Surat Tugas">
                                                                <FileText size={16}/>
                                                            </a>
                                                        )}
                                                        <button 
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleResendActivation(user); }}
                                                            disabled={resending === user.id}
                                                            className="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Kirim Ulang Email Aktivasi"
                                                        >
                                                            {resending === user.id ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                                                        </button>
                                                    </div>
                                                </p>
                                                <div className="space-y-1 mt-1">
                                                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-tighter"><Mail size={10} className="text-red-500" /> {user.email}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-tighter"><Phone size={10} className="text-emerald-500" /> {user.whatsapp || 'N/A'}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-tighter"><Briefcase size={10} className="text-indigo-500" /> {user.jabatan || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-3">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${role.color}`}>
                                                <RoleIcon size={12} /> {role.name}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black border ${status.color}`}>● {status.label}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-2">
                                            {user.role === 3 ? (
                                                <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
                                                    <Building2 size={16} className="text-slate-300" />
                                                    {user.opds?.nama || <span className="text-slate-200 italic font-black">UNASSIGNED</span>}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-slate-300 font-black text-[10px] uppercase tracking-widest italic bg-slate-50 px-3 py-1.5 rounded-lg w-fit">
                                                    Non-OPD Account
                                                </div>
                                            )}
                                            {isOpdTaken && (
                                                <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded-md w-fit border border-amber-100">
                                                    <AlertCircle size={10}/>
                                                    <span className="text-[9px] font-black uppercase italic">OPD has another active PIC</span>
                                                </div>
                                            )}
                                            {user.aspek_id && aspeks.find(a => a.id === user.aspek_id) && (
                                                <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg w-fit border border-indigo-100 mt-2">
                                                    <Layers size={12}/>
                                                    <span className="text-[10px] font-black uppercase tracking-widest italic">{aspeks.find(a => a.id === user.aspek_id).nama}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 scale-90 group-hover:scale-100 transition-transform">
                                            {user.status_approval === 0 ? (
                                                <div className="flex items-center bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shadow-xl">
                                                    <button onClick={() => handleApproval(user.id, 1)} className="p-2.5 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-all" title="Approve Access"><ThumbsUp size={18} /></button>
                                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleResendActivation(user); }} disabled={resending === user.id} className="p-2.5 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all disabled:opacity-50" title="Resend Activation Email">
                                                        {resending === user.id ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                                                    </button>
                                                    <button onClick={() => handleApproval(user.id, 2)} className="p-2.5 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all" title="Reject Request"><ThumbsDown size={18} /></button>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => handleStatusToggle(user.id, user.status_approval)}
                                                    className={`p-2.5 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest border ${
                                                        user.status_approval === 1 
                                                        ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white' 
                                                        : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white'
                                                    }`}
                                                >
                                                    {user.status_approval === 1 ? 'Disable' : 'Enable'}
                                                </button>
                                            )}
                                            <button onClick={() => handleOpenModal(user)} 
                                                className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-100 bg-slate-50">
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user.id, user.name)}
                                                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-2xl">
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal: Edit User (Manual Enroll) */}
            {showModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                        <div className="bg-white w-full max-w-xl rounded-[4rem] shadow-2xl p-12 space-y-8 animate-in zoom-in-95 duration-200 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8">
                                <button onClick={() => setShowModal(false)} className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all"><X size={24} /></button>
                            </div>

                            <div>
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">{currentUser ? 'RECONFIG ACCOUNT' : 'ENROLL NEW USER'}</h2>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mt-2">Daftarkan akun atau ubah setelan akses secara manual</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Display Name</label>
                                        <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-red-100 outline-none font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                                        <input value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-emerald-100 outline-none font-bold" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Email</label>
                                        <input type="email" disabled={!!currentUser} value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                                            className={`w-full ${currentUser ? 'bg-slate-100 text-slate-400' : 'bg-slate-50'} border border-slate-100 rounded-2xl px-6 py-4 outline-none font-bold`} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Position / Jabatan</label>
                                        <input value={form.jabatan} onChange={e => setForm({...form, jabatan: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-100 outline-none font-bold" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Role</label>
                                        <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-red-100 outline-none font-black text-sm disabled:opacity-50"
                                            value={form.role}
                                            onChange={e => {
                                                const newRole = parseInt(e.target.value);
                                                // Auto-clear opd_id when changing away from Operator OPD (role 3)
                                                const shouldClearOpd = newRole !== 3 && form.role === 3;
                                                setForm(prev => ({
                                                    ...prev,
                                                    role: newRole,
                                                    opd_id: shouldClearOpd ? '' : prev.opd_id,
                                                    aspek_id: newRole !== 4 ? '' : prev.aspek_id
                                                }));
                                            }}
                                            disabled={authUser?.role === 4}>
                                            {authUser?.role !== 2 && <option value="1">Kategori: 1 - Administrator Utama</option>}
                                            <option value="2">Kategori: 2 - Admin SPBE Pemkab</option>
                                            <option value="3">Kategori: 3 - Operator/PIC OPD</option>
                                            <option value="4">Kategori: 4 - Tim Asesor Internal</option>
                                            <option value="5">Kategori: 5 - Pimpinan Instansi</option>
                                            <option value="6">Kategori: 6 - Pengamat Sistem</option>
                                        </select>
                                    </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Organization (Unit)</label>
                                        <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-red-100 outline-none font-black text-xs italic"
                                            value={form.opd_id} onChange={e => setForm({...form, opd_id: e.target.value})}>
                                            <option value="">None / External (Kosongkan)</option>
                                            {opds.map(opd => <option key={opd.id} value={opd.id}>{opd.singkatan || opd.nama}</option>)}
                                        </select>
                                        {checkOpdOwnership(form.opd_id, currentUser?.id) && (
                                            <p className="text-[9px] font-black text-amber-500 uppercase mt-2 animate-pulse">⚠️ Warning: OPD already has an active PIC</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        {form.role === 4 && (
                                            <>
                                                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Fokus Aspek Asesor</label>
                                                <select className="w-full bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-200 outline-none font-black text-xs text-indigo-700"
                                                    value={form.aspek_id} onChange={e => setForm({...form, aspek_id: e.target.value})}>
                                                    <option value="">Koordinator (Semua Aspek)</option>
                                                    {aspeks.map(a => <option key={a.id} value={a.id}>{a.urutan} - {a.nama}</option>)}
                                                </select>
                                            </>
                                        )}
                                    </div>
                                </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        {currentUser ? 'Ganti Sandi (kosongkan jika tidak ingin diubah)' : 'Kata Sandi Akun'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={form.password}
                                            onChange={e => setForm({...form, password: e.target.value})}
                                            placeholder={currentUser ? '••••••••' : 'min. 8 karakter'}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-red-100 outline-none font-bold pr-14"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(p => !p)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors p-1"
                                            title={showPassword ? 'Sembunyikan Sandi' : 'Lihat Sandi'}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {!currentUser && (
                                        <p className="text-[9px] font-black text-slate-300 uppercase ml-2">Default: Minsel123! (jika dikosongkan)</p>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button type="submit" disabled={saving}
                                        className="flex-1 bg-slate-900 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 group">
                                        {saving ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                                        <span className="group-hover:tracking-widest transition-all">{currentUser ? 'UPDATE AUTHORITY' : 'EXECUTE ENROLLMENT'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
