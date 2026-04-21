import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Plus, Edit2, Trash2, Loader2, Target, Percent, ChevronRight } from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const ManajemenAspek = () => {
    const { user: authUser } = useAuthStore();
    const [aspeks, setAspeks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState(null);

    useEffect(() => {
        fetchAspeks();
    }, []);

    const fetchAspeks = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('aspeks')
                .select('*')
                .order('urutan', { ascending: true });

            if (error) throw error;
            setAspeks(data || []);
        } catch (err) {
            toast.error('Gagal mengambil data aspek');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, nama) => {
        if (window.confirm(`PERINGATAN: Yakin ingin menghapus Aspek "${nama}"? Semua indikator di dalamnya mungkin akan terdampak.`)) {
            try {
                const { error } = await supabase.from('aspeks').delete().eq('id', id);
                if (error) throw error;
                toast.success('Aspek berhasil dihapus');
                fetchAspeks();
            } catch (err) {
                toast.error('Gagal menghapus aspek');
            }
        }
    };

    const handleSaveEdit = async () => {
        try {
            const { error } = await supabase.from('aspeks').update({
                nama: editForm.nama,
                botot: editForm.botot,
                keterangan: editForm.keterangan,
                urutan: editForm.urutan
            }).eq('id', editForm.id);
            
            if (error) throw error;
            toast.success('Perubahan berhasil disimpan');
            setIsEditModalOpen(false);
            fetchAspeks();
        } catch (err) {
            toast.error('Gagal menyimpan perubahan');
        }
    };

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-emerald-600" size={48} />
            <p className="text-slate-400 font-bold">Sinkronisasi Struktur Aspek...</p>
        </div>
    );

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 flex items-center gap-4">
                        <Layers className="text-emerald-500" size={40} /> Manajemen Aspek SPBE
                    </h1>
                    <p className="text-slate-400 font-bold mt-1">7 Aspek Utama Penilaian Indeks Pemerintah Digital</p>
                </div>
                <div className="flex items-center gap-4 font-black">
                   <div className="bg-emerald-50 text-emerald-600 px-6 py-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
                        <Percent size={20} />
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-emerald-400 leading-none mb-1">Total Bobot</p>
                            <p className="text-xl leading-none">100%</p>
                        </div>
                   </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {aspeks.map((aspek, idx) => (
                    <div key={aspek.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-50/50 rounded-full group-hover:scale-110 transition-transform"></div>
                        
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg italic">
                                    {aspek.urutan}
                                </div>
                                <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-xl font-black text-xs tracking-widest shadow-md shadow-emerald-100">
                                    {aspek.bobot}%
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-slate-800 leading-tight pr-10">{aspek.nama}</h3>
                            <p className="text-sm text-slate-400 font-bold leading-relaxed">{aspek.keterangan || 'Aspek penilaian utama untuk mengukur kematangan birokrasi digital.'}</p>
                        </div>

                        <div className="relative z-10 flex items-center justify-between mt-10 pt-6 border-t border-slate-50">
                            <Link to="/dashboard/indikator" className="text-xs font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1 uppercase tracking-widest transition-all">
                                Detail Indikator <ChevronRight size={14} />
                            </Link>
                            <div className="flex items-center gap-2">
                                {authUser?.role !== 6 && (
                                    <>
                                        <button onClick={() => {
                                            setEditForm(aspek);
                                            setIsEditModalOpen(true);
                                        }} className="p-3 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(aspek.id, aspek.nama)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {aspeks.length === 0 && (
                <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <Layers size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold text-lg">Belum ada data aspek di database.</p>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && editForm && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl flex flex-col gap-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Edit Aspek</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-red-500 font-black">X</button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Nama Aspek</label>
                                <input type="text" value={editForm.nama} onChange={(e) => setEditForm({...editForm, nama: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Urutan</label>
                                    <input type="number" value={editForm.urutan || 0} onChange={(e) => setEditForm({...editForm, urutan: parseInt(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold" />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Bobot (%)</label>
                                    <input type="number" value={editForm.botot || editForm.bobot || 0} onChange={(e) => setEditForm({...editForm, bobot: parseInt(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Keterangan</label>
                                <textarea rows="3" value={editForm.keterangan || ''} onChange={(e) => setEditForm({...editForm, keterangan: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold"></textarea>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4">
                            <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-xl hover:bg-slate-200">Batal</button>
                            <button onClick={handleSaveEdit} className="flex-1 py-4 bg-emerald-500 text-white font-black rounded-xl shadow-lg hover:bg-emerald-600">Simpan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManajemenAspek;
