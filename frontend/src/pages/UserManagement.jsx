import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Shield, 
  Mail, 
  Building2, 
  MoreVertical,
  Search,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import api from '../services/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 2, opd_id: '' });
    const [opds, setOpds] = useState([]);

    const roles = {
        1: { name: 'Administrator', color: 'text-red-600 bg-red-50' },
        2: { name: 'OPD (Dinas)', color: 'text-blue-600 bg-blue-50' },
        3: { name: 'Asesor', color: 'text-emerald-600 bg-emerald-50' },
        5: { name: 'Operator', color: 'text-orange-600 bg-orange-50' },
        6: { name: 'Pimpinan', color: 'text-rose-600 bg-rose-50' },
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [uRes, oRes] = await Promise.all([
                api.get('/users'),
                api.get('/opd')
            ]);
            setUsers(uRes.data.data);
            setOpds(oRes.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users', form);
            setShowModal(false);
            fetchData();
            setForm({ name: '', email: '', password: '', role: 2, opd_id: '' });
        } catch (err) {
            alert('Gagal menambah user');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Hapus user ini?')) return;
        try {
            await api.delete(`/users/${id}`);
            fetchData();
        } catch (err) {
            alert('Gagal menghapus');
        }
    };

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-red-600" /></div>;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <Users className="text-red-600" size={32} /> User Administration
                    </h1>
                    <p className="text-slate-500 font-bold mt-1">Kelola hak akses dan akun pengguna SPBE V2</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-red-600 text-white font-black px-6 py-4 rounded-2xl shadow-xl shadow-red-100 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                >
                    <UserPlus size={20} /> Tambah User Baru
                </button>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identitas User</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role & Akses</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Organisasi (OPD)</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 font-black text-xl">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800">{user.name}</p>
                                            <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                                <Mail size={12} /> {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${roles[user.role]?.color}`}>
                                        {roles[user.role]?.name}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                                        <Building2 size={16} className="text-slate-300" />
                                        {user.opds?.nama || '-'}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <button 
                                        onClick={() => handleDelete(user.id)}
                                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Tambah User */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-200">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Tambah User Baru</h2>
                            <p className="text-slate-500 font-bold text-sm mt-1">Daftarkan akun ke Cloud Supabase</p>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                                <input 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-red-100 outline-none font-bold"
                                    placeholder="Masukkan nama..."
                                    required
                                    value={form.name}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                                <input 
                                    type="email"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-red-100 outline-none font-bold"
                                    placeholder="user@example.com"
                                    required
                                    value={form.email}
                                    onChange={e => setForm({...form, email: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                    <input 
                                        type="password"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-red-100 outline-none font-bold"
                                        required
                                        value={form.password}
                                        onChange={e => setForm({...form, password: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-red-100 outline-none font-bold"
                                        value={form.role}
                                        onChange={e => setForm({...form, role: parseInt(e.target.value)})}
                                    >
                                        {Object.entries(roles).map(([id, r]) => (
                                            <option key={id} value={id}>{r.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Penugasan OPD</label>
                                <select 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-red-100 outline-none font-bold italic"
                                    value={form.opd_id}
                                    onChange={e => setForm({...form, opd_id: e.target.value})}
                                >
                                    <option value="">-- Lewati jika bukan Role OPD/Internal --</option>
                                    {opds.map(opd => (
                                        <option key={opd.id} value={opd.id}>{opd.nama}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 font-black text-slate-400 py-4 hover:bg-slate-50 rounded-2xl transition-all"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 bg-red-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-100"
                                >
                                    Simpan User
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
