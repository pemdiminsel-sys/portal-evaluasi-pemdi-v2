import { useState, useEffect } from 'react';
import { Edit2, Search, CheckCircle2, AlertTriangle, FileText, Loader2, Send } from 'lucide-react';
import api from '../services/api';

const CatatanPerbaikan = () => {
    const [opds, setOpds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulasi fetch OPD
        setTimeout(() => {
            setOpds([
                { id: 1, nama: 'Dinas Komunikasi dan Informatika', singkatan: 'KOMINFO', catatan: 3, status: 'pending' },
                { id: 2, nama: 'Dinas Kesehatan', singkatan: 'DINKES', catatan: 0, status: 'resolved' },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) return <div className="h-full flex flex-col items-center justify-center"><Loader2 className="animate-spin text-red-600 mb-4" size={40} /><p className="text-slate-500 font-bold animate-pulse">Memuat Data Catatan...</p></div>;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <Edit2 className="text-red-600" size={32} /> Catatan Perbaikan
                    </h1>
                    <p className="text-slate-500 font-bold mt-1">Berikan feedback dan rekomendasi perbaikan bukti kepada OPD</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Instansi Terperiksa</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status Perbaikan</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Total Catatan</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {opds.map((opd) => (
                            <tr key={opd.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-black">
                                            {opd.singkatan}
                                        </div>
                                        <h3 className="font-bold text-slate-800">{opd.nama}</h3>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    {opd.status === 'pending' ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-wider">
                                            <AlertTriangle size={12} /> Menunggu OPD
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-wider">
                                            <CheckCircle2 size={12} /> Tuntas
                                        </span>
                                    )}
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <span className="font-black text-2xl text-slate-300 group-hover:text-red-500 transition-colors">{opd.catatan}</span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="bg-slate-100 hover:bg-red-600 text-slate-500 hover:text-white px-5 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ml-auto">
                                        <Send size={16} /> Beri Catatan
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default CatatanPerbaikan;
