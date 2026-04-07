import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Loader2 } from 'lucide-react';

const RekapVerifikasi = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => { setTimeout(() => setLoading(false), 800) }, []);

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={40} /></div>;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
            <div>
                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <BarChart3 className="text-red-600" size={32} /> Rekapitulasi Verifikasi
                </h1>
                <p className="text-slate-500 font-bold mt-1">Ringkasan kemajuan verifikasi dokumen antar OPD</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Dummy Stats */}
                 <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="text-red-500 bg-red-50 p-3 inline-flex rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                        <TrendingUp size={24} />
                    </div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Total Diverifikasi</p>
                    <h2 className="text-4xl font-black text-slate-800">0</h2>
                 </div>
                 <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="text-amber-500 bg-amber-50 p-3 inline-flex rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                        <TrendingUp size={24} />
                    </div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Pending Review</p>
                    <h2 className="text-4xl font-black text-slate-800">45</h2>
                 </div>
                 <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="text-emerald-500 bg-emerald-50 p-3 inline-flex rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                        <TrendingUp size={24} />
                    </div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Tuntas Verifikasi</p>
                    <h2 className="text-4xl font-black text-slate-800">0</h2>
                 </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-center py-20">
                <p className="text-slate-500 font-bold">Data tabel rekapitulasi akan tampil setelah proses evaluasi tahap pertama berjalan.</p>
            </div>
        </div>
    );
};
export default RekapVerifikasi;
