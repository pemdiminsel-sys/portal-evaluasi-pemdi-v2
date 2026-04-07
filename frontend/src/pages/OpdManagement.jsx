import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  X, 
  MapPin, 
  Building2,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const OpdManagement = () => {
    const [opds, setOpds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentOpd, setCurrentOpd] = useState(null);
    const [formData, setFormData] = useState({ nama: '', singkatan: '', alamat: '' });
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchOpds();
    }, []);

    const fetchOpds = async () => {
        try {
            const res = await api.get('/opd');
            setOpds(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (opd = null) => {
        if (opd) {
            setCurrentOpd(opd);
            setFormData({ nama: opd.nama, singkatan: opd.singkatan, alamat: opd.alamat });
        } else {
            setCurrentOpd(null);
            setFormData({ nama: '', singkatan: '', alamat: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (currentOpd) {
                await api.put(`/opd/${currentOpd.id}`, formData);
                showToast('OPD berhasil diperbarui!');
            } else {
                await api.post('/opd', formData);
                showToast('OPD baru berhasil ditambahkan!');
            }
            setIsModalOpen(false);
            fetchOpds();
        } catch (error) {
            showToast('Gagal menyimpan data.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Hapus OPD ini? Semua data terkait mungkin ikut terhapus.')) return;
        try {
            await api.delete(`/opd/${id}`);
            showToast('OPD berhasil dihapus.');
            fetchOpds();
        } catch (error) {
            showToast('Gagal menghapus OPD.', 'error');
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const filteredOpds = opds.filter(opd => 
        opd.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
        opd.singkatan?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;

    return (
        <div className="p-10 space-y-10 overflow-y-auto h-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                        <Users size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Manajemen OPD</h1>
                        <p className="text-slate-500 font-medium">Kelola daftar Organisasi Perangkat Daerah peserta evaluasi.</p>
                    </div>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center gap-2 group active:scale-95"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    Tambah OPD Baru
                </button>
            </div>

            {/* Actions Bar */}
            <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Cari berdasarkan nama atau singkatan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border-none outline-none pl-12 pr-4 py-3 rounded-xl font-medium text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Informasi Instansi</th>
                                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredOpds.map((opd) => (
                                <tr key={opd.id} className="group hover:bg-slate-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xs">
                                                {opd.singkatan || opd.nama.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-slate-800 leading-tight">{opd.nama}</h4>
                                                <div className="flex items-center gap-3 text-slate-400">
                                                    <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest">
                                                        <MapPin size={10} />
                                                        {opd.alamat || 'Alamat belum disetel'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            opd.status_penilaian === 'completed' 
                                            ? 'bg-emerald-50 text-emerald-600' 
                                            : 'bg-amber-50 text-amber-600'
                                        }`}>
                                            {opd.status_penilaian?.replace('_', ' ') || 'NOT STARTED'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleOpenModal(opd)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(opd.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden p-8"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-slate-800">{currentOpd ? 'Edit OPD' : 'Tambah OPD Baru'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Nama Instansi</label>
                                    <div className="relative">
                                        <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="Contoh: Dinas Kesehatan"
                                            value={formData.nama}
                                            onChange={(e) => setFormData({...formData, nama: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Singkatan / Kode (Pilihan)</label>
                                    <input 
                                        type="text" 
                                        placeholder="Contoh: DINKES"
                                        value={formData.singkatan}
                                        onChange={(e) => setFormData({...formData, singkatan: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Alamat Kantor</label>
                                    <textarea 
                                        placeholder="Alamat lengkap..."
                                        value={formData.alamat}
                                        onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 font-medium h-24 resize-none"
                                    />
                                </div>

                                <button 
                                    disabled={saving}
                                    type="submit" 
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                                >
                                    {saving ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                                    {currentOpd ? 'Simpan Perubahan' : 'Tambah Instansi'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-10 right-10 p-5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 transition-all duration-300 border ${
                    toast.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                }`}>
                    {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-bold text-sm">{toast.message}</span>
                </div>
            )}
        </div>
    );
};

export default OpdManagement;
