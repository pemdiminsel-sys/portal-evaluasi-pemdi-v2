import { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit2, Trash2, Loader2, Building2, MapPin, Phone, User as UserIcon, Tag } from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

const OpdManagement = () => {
    const [opds, setOpds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState(null);

    useEffect(() => {
        fetchOpds();
    }, []);

    const fetchOpds = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('opds')
                .select('*')
                .order('kelompok', { ascending: true })
                .order('nama', { ascending: true });

            if (error) throw error;
            setOpds(data || []);
        } catch (err) {
            toast.error('Gagal mengambil data OPD');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredOpds = opds.filter(opd => 
        opd.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
        opd.singkatan?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id, nama) => {
        if (window.confirm(`PERINGATAN: Yakin ingin menghapus OPD "${nama}"? Data yang dihapus tidak dapat dikembalikan.`)) {
            try {
                const { error } = await supabase.from('opds').delete().eq('id', id);
                if (error) throw error;
                toast.success('OPD berhasil dihapus');
                fetchOpds();
            } catch (err) {
                toast.error('Gagal menghapus OPD');
            }
        }
    };

    const handleSaveEdit = async () => {
        try {
            const { error } = await supabase.from('opds').update({
                nama: editForm.nama,
                singkatan: editForm.singkatan,
                tugas: editForm.tugas,
                kelompok: editForm.kelompok
            }).eq('id', editForm.id);
            
            if (error) throw error;
            toast.success('Perubahan berhasil disimpan');
            setIsEditModalOpen(false);
            fetchOpds();
        } catch (err) {
            toast.error('Gagal menyimpan perubahan');
        }
    };

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
            <p className="text-slate-400 font-bold">Sinkronisasi Data OPD...</p>
        </div>
    );

    // Grouping by Kelompok
    const groups = [...new Set(opds.map(item => item.kelompok))];

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 flex items-center gap-4">
                        <Building2 className="text-indigo-600" size={40} /> Manajemen Perangkat Daerah
                    </h1>
                    <p className="text-slate-400 font-bold mt-1">Daftar {opds.length} OPD Target Evaluasi SPBE 2026</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Cari OPD..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-slate-200 pl-11 pr-4 py-3 rounded-2xl w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold shadow-sm" 
                        />
                    </div>
                    <button className="bg-indigo-600 text-white font-black px-6 py-4 rounded-2xl shadow-xl shadow-indigo-100 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                        <Plus size={20} /> Tambah OPD
                    </button>
                </div>
            </div>

            <div className="space-y-12">
                {groups.map(group => (
                    <div key={group} className="space-y-6">
                         <div className="flex items-center gap-3">
                            <Tag className="text-indigo-400" size={18} />
                            <h2 className="text-lg font-black text-slate-400 uppercase tracking-widest">{group || 'TANPA KELOMPOK'}</h2>
                            <div className="flex-1 h-[2px] bg-slate-100"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredOpds.filter(o => o.kelompok === group).map(opd => (
                                <div key={opd.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col justify-between">
                                    <div className="relative z-10">
                                        <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg font-black text-[10px] tracking-widest uppercase mb-4 inline-block">{opd.singkatan || 'OPD'}</div>
                                        <h3 className="text-lg font-black text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{opd.nama}</h3>
                                        <div className="flex items-start gap-2 mb-6">
                                            <div className="bg-emerald-50 text-emerald-600 p-1 rounded-md shrink-0 mt-0.5"><Tag size={10} /></div>
                                            <p className="text-xs font-bold text-slate-500 italic">{opd.tugas || 'Bidang Umum'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 relative z-10 border-t border-slate-50 pt-6">
                                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                                            <UserIcon size={14} className="text-slate-300" />
                                            <span>PIC: {opd.pic || 'Belum ditunjuk'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                                            <Phone size={14} className="text-slate-300" />
                                            <span>{opd.kontak || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-8 relative z-10">
                                        <button onClick={() => {
                                            setEditForm(opd);
                                            setIsEditModalOpen(true);
                                        }} className="flex-1 py-3 bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white font-black rounded-xl transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                                            <Edit2 size={12} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(opd.id, opd.nama)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {filteredOpds.length === 0 && (
                <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <Building2 size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold text-lg">Data OPD tidak ditemukan.</p>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && editForm && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl flex flex-col gap-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Edit OPD</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-red-500 font-black">X</button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Nama Instansi</label>
                                <input type="text" value={editForm.nama} onChange={(e) => setEditForm({...editForm, nama: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Singkatan</label>
                                    <input type="text" value={editForm.singkatan || ''} onChange={(e) => setEditForm({...editForm, singkatan: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold" />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Kelompok</label>
                                    <input type="text" value={editForm.kelompok || ''} onChange={(e) => setEditForm({...editForm, kelompok: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Tugas Utama</label>
                                <input type="text" value={editForm.tugas || ''} onChange={(e) => setEditForm({...editForm, tugas: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold" />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4">
                            <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-xl hover:bg-slate-200">Batal</button>
                            <button onClick={handleSaveEdit} className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-xl shadow-lg hover:bg-indigo-700">Simpan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OpdManagement;
