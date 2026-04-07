import { useState, useEffect } from 'react';
import { Target, Search, Plus, Edit2, Trash2, Loader2, ListChecks } from 'lucide-react';
import api from '../services/api';

const ManajemenIndikator = () => {
    const [indikator, setIndikator] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/indikator');
                setIndikator(res.data.data);
            } catch (err) { console.error(err); } 
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-red-600 mb-4" size={40} /></div>;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <ListChecks className="text-red-600" size={32} /> Manajemen Indikator
                    </h1>
                    <p className="text-slate-500 font-bold mt-1">Kelola 20 Indikator Kinerja SPBE</p>
                </div>
                <button className="bg-red-600 text-white font-black px-6 py-4 rounded-2xl shadow-xl shadow-red-100 flex items-center gap-2 hover:scale-105 transition-all">
                    <Plus size={20} /> Tambah Indikator
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kode & Nama Indikator</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bobot</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {indikator.map(ind => (
                            <tr key={ind.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-red-50 text-red-600 px-3 py-1 rounded-lg font-black text-xs">{ind.kode}</div>
                                        <h3 className="font-bold text-slate-800">{ind.nama}</h3>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="font-bold text-slate-500">{ind.bobot}%</span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"><Edit2 size={18} /></button>
                                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default ManajemenIndikator;
