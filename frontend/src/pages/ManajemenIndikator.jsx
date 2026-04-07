import { useState, useEffect } from 'react';
import { Target, Search, Plus, Edit2, Trash2, Loader2, ListChecks, ChevronRight } from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

const ManajemenIndikator = () => {
    const [indikators, setIndikators] = useState([]);
    const [aspeks, setAspeks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Ambil Aspek
            const { data: asp, error: err1 } = await supabase.from('aspeks').select('*').order('urutan', { ascending: true });
            if (err1) throw err1;
            setAspeks(asp || []);

            // Ambil Indikator
            const { data: ind, error: err2 } = await supabase.from('indikators').select('*, aspeks(*)').order('urutan', { ascending: true });
            if (err2) throw err2;
            setIndikators(ind || []);
        } catch (err) {
            console.error(err);
            toast.error('Gagal mengambil data indikator dari Cloud');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-red-600" size={48} />
            <p className="text-slate-400 font-bold">Sinkronisasi Data Cloud...</p>
        </div>
    );

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <ListChecks className="text-red-600" size={32} /> Manajemen Indikator
                    </h1>
                    <p className="text-slate-500 font-bold mt-1">Total {indikators.length} Indikator di 7 Aspek Utama</p>
                </div>
                <button className="bg-red-600 text-white font-black px-6 py-4 rounded-2xl shadow-xl shadow-red-100 flex items-center gap-2 hover:scale-105 transition-all">
                    <Plus size={20} /> Tambah Indikator
                </button>
            </div>

            {/* Render per Aspek */}
            <div className="space-y-10">
                {aspeks.map(aspek => (
                    <div key={aspek.id} className="space-y-4">
                        <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-3">
                            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">{aspek.urutan}</div>
                            <div>
                                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">{aspek.nama}</h2>
                                <p className="text-xs font-bold text-slate-400">BOBOT ASPEK: {aspek.bobot}%</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {indikators.filter(i => i.aspek_id === aspek.id).map(ind => (
                                <div key={ind.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="bg-red-50 text-red-600 px-3 py-1 rounded-lg font-black text-[10px] tracking-widest">{ind.kode}</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bobot: {ind.bobot}%</div>
                                        </div>
                                        <h3 className="font-extrabold text-slate-800 leading-tight group-hover:text-red-600 transition-colors">{ind.nama}</h3>
                                        <p className="text-xs text-slate-500 font-medium line-clamp-2">{ind.penjelasan}</p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                                        <button className="text-[10px] font-black text-slate-400 hover:text-indigo-600 flex items-center gap-1 uppercase tracking-tighter transition-all">
                                            Lihat Kriteria <ChevronRight size={14} />
                                        </button>
                                        <div className="flex items-center gap-1">
                                            <button className="p-2 text-slate-300 hover:text-indigo-500 transition-all"><Edit2 size={16} /></button>
                                            <button className="p-2 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            {indikators.length === 0 && (
                <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <Target size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold text-lg">Indikator belum di-import ke Database.</p>
                </div>
            )}
        </div>
    );
};
export default ManajemenIndikator;
