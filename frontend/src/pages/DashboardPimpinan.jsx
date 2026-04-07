import { useState, useEffect } from 'react';
// Recharts removed to prevent React 19 DefaultProps Crash
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  ShieldCheck, 
  UserCheck,
  ChevronRight,
  Download,
  Loader2,
  Medal,
  Activity,
  History
} from 'lucide-react';
import api from '../services/api';

const DashboardPimpinan = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.post('/', { action: 'dashboard-summary' }); 
            const data = res.data?.data?.ranking || [];
            
            const totalScore = data.reduce((acc, curr) => acc + (curr.nilai_akhir || 0), 0);
            const globalAvg = data.length > 0 ? (totalScore / data.length) : 0;

            setStats({
                globalIndex: globalAvg.toFixed(2),
                predicate: globalAvg >= 3.5 ? 'BAIK (BERKEMBANG)' : (globalAvg >= 2.6 ? 'CUKUP (MEMBANGUN)' : 'KURANG (MERINTIS)'),
                ranking: [...data].sort((a, b) => b.nilai_akhir - a.nilai_akhir).slice(0, 5),
                aspectScores: [
                    { name: 'Kebijakan', value: 3.5 },
                    { name: 'Tata Kelola', value: 2.8 },
                    { name: 'Manajemen', value: 3.2 },
                    { name: 'Layanan', value: 4.1 },
                    { name: 'Teknologi', value: 3.0 },
                    { name: 'Keterpaduan', value: 2.5 },
                    { name: 'Kepuasan', value: 3.8 }
                ],
                trendData: [
                    { year: '2023', score: 1.82 },
                    { year: '2024', score: 2.45 },
                    { year: '2025', score: 2.90 },
                    { year: '2026', score: globalAvg.toFixed(2) }
                ]
            });
        } catch (error) {
            console.error('Failed to fetch pimpinan stats', error);
            // Fallback mock data to prevent white screen
            setStats({
                globalIndex: "0.00",
                predicate: "BELUM ADA DATA",
                ranking: [],
                aspectScores: [],
                trendData: []
            });
        } finally {
            setLoading(false);
        }
    };

    // Safety timeout to prevent infinite loading
    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) setLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [loading]);

    if (loading) return <div className="h-full flex items-center justify-center bg-red-50/20"><Loader2 className="animate-spin text-red-600" size={32} /></div>;
    if (!stats) return null;

    const getMaturityColor = (score) => {
        if (score >= 4) return 'bg-emerald-500';
        if (score >= 3.5) return 'bg-red-600';
        if (score >= 2.6) return 'bg-amber-500';
        return 'bg-red-400';
    };

    return (
        <div className="p-8 space-y-8 overflow-y-auto h-full max-w-7xl mx-auto scrollbar-hide bg-[#fffafa]">
            {/* Header Eksekutif - Red Theme */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter decoration-red-600/30 underline decoration-8 underline-offset-[-2px]">
                        Laporan Strategis Bupati
                    </h1>
                    <p className="text-slate-500 font-bold flex items-center gap-2 mt-2">
                        <Activity size={16} className="text-red-500" />
                        Monitoring Real-time Indeks Pemdi Kab. Minahasa Selatan
                    </p>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white font-black px-10 py-5 rounded-[2.5rem] shadow-2xl shadow-red-200 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest">
                    <Download size={18} /> Ekspor Dokumen
                </button>
            </div>

            {/* Indeks Utama & Radar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Score Card - Crimson Style */}
                <div className="lg:col-span-1 bg-white rounded-[3.5rem] border border-red-50 shadow-sm p-10 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/5 rounded-full blur-3xl"></div>
                    <div className="space-y-2 relative z-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-4">Indeks SPBE 2026</p>
                        <h2 className="text-8xl font-black text-red-600 tracking-tighter leading-none">{stats.globalIndex}</h2>
                         <p className="text-sm font-bold text-slate-300 mt-2">DARI SKALA 5.00</p>
                    </div>
                    <div className="mt-10 space-y-4 relative z-10">
                        <div className="p-6 bg-red-600 text-white rounded-[2rem] shadow-xl shadow-red-100">
                             <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Predikat Akhir</p>
                             <p className="text-xl font-black tracking-tight">{stats.predicate}</p>
                        </div>
                    </div>
                </div>

                {/* Radar Chart Visual */}
                <div className="lg:col-span-3 bg-white rounded-[4rem] border border-red-50 shadow-sm p-10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Kematangan 7 Aspek</h3>
                        <div className="flex items-center gap-4">
                             <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-600"></span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tahun 2026</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tahun 2025</span>
                             </div>
                        </div>
                    </div>
                    <div className="h-[350px] w-full flex flex-col justify-center space-y-4">
                        {stats.aspectScores.map((aspect, idx) => (
                           <div key={idx} className="w-full">
                               <div className="flex justify-between text-xs font-black text-slate-500 mb-1">
                                  <span>{aspect.name}</span>
                                  <span className="text-red-500">{aspect.value.toFixed(1)} / 5.0</span>
                               </div>
                               <div className="w-full bg-slate-100 rounded-full h-3">
                                  <div className="bg-red-500 h-3 rounded-full" style={{ width: `${(aspect.value / 5) * 100}%` }}></div>
                               </div>
                           </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tren Progres & Perbandingan */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Grafik Tren 3 Tahun */}
                 <div className="bg-white rounded-[3.5rem] border border-red-50 shadow-sm p-10">
                    <div className="flex items-center gap-3 mb-8">
                         <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                             <History size={24} />
                         </div>
                         <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Tren Kenaikan Indeks</h3>
                            <p className="text-xs font-black text-red-600 uppercase tracking-widest">Komparasi 2023 - 2026</p>
                         </div>
                    </div>
                    <div className="h-[300px] w-full flex items-end gap-2 pt-10 border-b-2 border-slate-100 pb-2">
                        {stats.trendData.map((data, idx) => (
                           <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full gap-2 relative group">
                               <span className="opacity-0 group-hover:opacity-100 absolute -top-8 font-black text-red-600 bg-red-100 px-3 py-1 rounded-full text-xs transition-opacity">{Number(data.score).toFixed(2)}</span>
                               <div className="w-full bg-red-600/20 group-hover:bg-red-600 transition-colors rounded-t-2xl" style={{ height: `${(Number(data.score) / 5) * 100}%` }}></div>
                               <span className="text-xs font-black text-slate-400">{data.year}</span>
                           </div>
                        ))}
                    </div>
                 </div>

                 {/* Ranking Top 5 (Red Styled) */}
                 <div className="bg-white rounded-[3.5rem] border border-red-50 shadow-sm p-10 overflow-hidden relative">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                            <Medal size={24} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Kinerja Terbaik OPD</h3>
                    </div>

                    <div className="space-y-4">
                        {stats.ranking.map((opd, idx) => (
                            <div key={opd.id} className="group relative flex items-center justify-between p-6 bg-red-50/10 hover:bg-red-50/30 rounded-[2.5rem] transition-all border border-transparent hover:border-red-100">
                                <div className="flex items-center gap-6">
                                     <div className={`w-14 h-14 rounded-3xl flex items-center justify-center font-black text-2xl text-white shadow-xl ${idx === 0 ? 'bg-red-600 scale-110 shadow-red-200' : (idx === 1 ? 'bg-red-500 shadow-red-100' : (idx === 2 ? 'bg-red-400 shadow-red-50' : 'bg-slate-200 text-slate-400'))}`}>
                                        {idx + 1}
                                     </div>
                                     <div>
                                         <p className="text-base font-black text-slate-800 leading-tight">{opd.nama}</p>
                                         <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{opd.singkatan}</p>
                                     </div>
                                </div>
                                <div className="text-right">
                                     <p className="text-2xl font-black text-slate-800 tracking-tighter">{opd.nilai_akhir.toFixed(2)}</p>
                                     <span className="text-[10px] font-black px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg">UNGGUL</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Strategic Summary Box */}
            <div className="bg-slate-900 rounded-[4rem] p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="flex-1 space-y-6 relative z-10">
                    <div className="flex items-center gap-4">
                        <Target size={32} className="text-red-500" />
                        <h3 className="text-2xl font-black tracking-tight">Rangkuman Kinerja Strategis</h3>
                    </div>
                    <p className="text-slate-400 font-bold leading-relaxed text-lg">
                        "Indeks tahun ini menunjukkan kenaikan sebesar **14.2%** dibanding periode sebelumnya. Perlu penguatan khusus pada **Aspek Keterpaduan Layanan** yang masih menjadi bottleneck utama bagi kemudahan layanan publik digital."
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto relative z-10">
                    <div className="bg-white/10 p-8 rounded-[2.5rem] border border-white/5 text-center min-w-[150px]">
                        <p className="text-3xl font-black text-red-500">2.9</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rata-rata Prov.</p>
                    </div>
                    <div className="bg-red-600 p-8 rounded-[2.5rem] text-center min-w-[150px] shadow-2xl shadow-red-600/30">
                        <p className="text-3xl font-black text-white">4.0</p>
                        <p className="text-[10px] font-black text-red-100 uppercase tracking-widest">Target 2027</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPimpinan;
