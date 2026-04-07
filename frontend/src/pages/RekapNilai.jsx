import { useState, useEffect } from 'react';
import { PieChart, Loader2, ArrowUpRight } from 'lucide-react';
import api from '../services/api';

const RekapNilai = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => { setTimeout(() => setLoading(false), 800) }, []);

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={40} /></div>;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div>
                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <PieChart className="text-red-600" size={32} /> Rekapitulasi Nilai Akhir
                </h1>
                <p className="text-slate-500 font-bold mt-1">Akumulasi penilaian (Mandiri, Dokumen, Interviu, Visitasi) untuk seluruh instansi</p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-center">
                 <div className="w-24 h-24 bg-gradient-to-br from-red-50 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PieChart size={48} className="text-red-500" />
                 </div>
                 <h2 className="text-3xl font-black text-slate-800 mb-2">3.42</h2>
                 <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-8 flex items-center justify-center gap-2">
                    <ArrowUpRight size={16} className="text-emerald-500" /> Indeks SPBE Rata-rata
                 </p>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-4 overflow-x-auto text-center py-20 text-slate-400 font-bold">
                 Tabel Rekapitulasi Nilai 7 Aspek & 20 Indikator Per-OPD akan tampil di sini.
            </div>
        </div>
    );
};
export default RekapNilai;
