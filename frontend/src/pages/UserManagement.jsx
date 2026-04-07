import { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Trash2, Edit2, Mail, Building2, Loader2, ShieldCheck, 
  Lock, Eye, CheckCircle, AlertCircle, X, ShieldAlert, Key
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [opds, setOpds] = useState([]);
    const [saving, setSaving] = useState(false);
    
    const [form, setForm] = useState({ 
        name: '', email: '', password: '', role: 3, opd_id: '' 
    });

    const rolesMap = {
        1: { name: 'Super Admin', color: 'bg-red-600 text-white', icon: ShieldAlert, perm: 'Full Access' },
        2: { name: 'Admin Pemkab', color: 'bg-indigo-600 text-white', icon: ShieldCheck, perm: 'Manage Master Data' },
        3: { name: 'Operator OPD', color: 'bg-blue-500 text-white', icon: Building2, perm: 'Input Evidence & Self Eval' },
        4: { name: 'Tim Asesor', color: 'bg-emerald-500 text-white', icon: CheckCircle, perm: 'Verify & Audit' },
        5: { name: 'Pimpinan', color: 'bg-rose-500 text-white', icon: Eye, perm: 'View Reports' },
        6: { name: 'Viewer', color: 'bg-slate-400 text-white', icon: Lock, perm: 'Read Only' },
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Ambil User (dari tabel public.users yang tersinkron dengan auth)
            const { data: userData, error: uErr } = await supabase.from('users').select('*, opds(*)').order('created_at', { ascending: false });
            if (uErr) throw uErr;
            setUsers(userData || []);

            // Ambil OPD untuk Dropdown
            const { data: opdData, error: oErr } = await supabase.from('opds').select('id, nama').order('nama', { ascending: true });
            if (oErr) throw oErr;
            setOpds(opdData || []);
        } catch (err) {
            toast.error('Gagal sinkronisasi data user');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setCurrentUser(user);
            setForm({ name: user.name, email: user.email, password: '', role: user.role || 3, opd_id: user.opd_id || '' });
        } else {
            setCurrentUser(null);
            setForm({ name: '', email: '', password: '', role: 3, opd_id: '' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (currentUser) {
                // Update User Profile
                const { error } = await supabase.from('users').update({
                    name: form.name,
                    role: form.role,
                    opd_id: form.opd_id || null
                }).eq('id', currentUser.id);
                if (error) throw error;
                toast.success('Profil user diperbarui');
            } else {
                // Untuk registrasi user baru, idealnya lewat Edge Function 
                // Kita akan coba insert ke public.users (asumsi trigger auth sudah ada)
                toast.error('Silakan daftar melalui menu Registrasi Supabase Auth');
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            toast.error(`Error: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-red-600" size={48} />
            <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Pemuatan Otoritas User...</p>
        </div>
    );

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
             {/* Header */}
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 flex items-center gap-4 italic uppercase tracking-tighter">
                        <Key className="text-red-600" size={40} /> Role & User Matrix
                    </h1>
                    <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-widest">Pengaturan Hak Akses Berjenjang SPBE V2</p>
                </div>
                <button onClick={() => handleOpenModal()}
                    className="bg-red-600 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-red-100 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all">
                    <UserPlus size={20} /> Create New Account
                </button>
            </div>

            {/* Matrix Table */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Role</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Assignment</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Settings</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {users.map(user => {
                            const role = rolesMap[user.role] || rolesMap[6];
                            const RoleIcon = role.icon;
                            return (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg italic">
                                                {user.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-extrabold text-slate-800 text-lg leading-none mb-1">{user.name}</p>
                                                <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-tighter">
                                                    <Mail size={12} className="text-red-500" /> {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1.5">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${role.color}`}>
                                                <RoleIcon size={12} /> {role.name}
                                            </span>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter ml-1">Permissions: {role.perm}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-800 font-black text-sm">
                                            <Building2 size={16} className="text-slate-300" />
                                            {user.opds?.nama || <span className="text-slate-300 italic opacity-50">No Link</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenModal(user)} 
                                                className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-2xl transition-all shadow-sm">
                                                <Edit2 size={18} />
                                            </button>
                                            <button className="p-3 text-slate-300 hover:text-red-500 hover:bg-white rounded-2xl transition-all shadow-sm">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal: User Setup */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                         <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-200 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8">
                                <button onClick={() => setShowModal(false)} className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all"><X size={24} /></button>
                            </div>

                            <div>
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{currentUser ? 'RECONFIG ACCOUNT' : 'ENROLL NEW USER'}</h2>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Identity & Access Management</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Display Name</label>
                                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-red-100 outline-none font-bold" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input type="email" disabled={!!currentUser} value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                                        className={`w-full ${currentUser ? 'bg-slate-100 text-slate-400' : 'bg-slate-50'} border border-slate-100 rounded-2xl px-6 py-4 outline-none font-bold`} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Role</label>
                                        <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-red-100 outline-none font-black text-sm"
                                            value={form.role} onChange={e => setForm({...form, role: parseInt(e.target.value)})}>
                                            <option value="1">Super Admin</option>
                                            <option value="2">Admin Pemkab</option>
                                            <option value="3">Operator OPD</option>
                                            <option value="4">Tim Asesor</option>
                                            <option value="5">Pimpinan</option>
                                            <option value="6">Viewer</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">OPD Link</label>
                                        <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-red-100 outline-none font-black text-sm italic"
                                            value={form.opd_id} onChange={e => setForm({...form, opd_id: e.target.value})}>
                                            <option value="">None / External</option>
                                            {opds.map(opd => <option key={opd.id} value={opd.id}>{opd.singkatan || opd.nama}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button type="submit" disabled={saving}
                                        className="flex-1 bg-slate-900 text-white font-black py-4 rounded-3xl shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                                        {saving ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                                        {currentUser ? 'AUTHENTICATE CHANGES' : 'CREATE ACCOUNT'}
                                    </button>
                                </div>
                            </form>
                         </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserManagement;
