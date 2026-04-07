import { useState, useEffect } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Cell
} from 'recharts';
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  ShieldCheck, 
  UserCheck,
  ChevronRight,
  Download,
  Loader2,
  Medal
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
            const res = await api.get('/penilaian'); // Fetching rekap
            const data = res.data.data;
            
            // Calculate Global Average
            const totalScore = data.reduce((acc, curr) => acc + (curr.nilai_akhir || 0), 0);
            const globalAvg = totalScore / (data.length || 1);

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
                ]
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;

    const getMaturityColor = (score) => {
        if (score >= 4) return 'bg-emerald-500';
        if (score >= 3) return 'bg-indigo-500';
        if (score >= 2) return 'bg-amber-500';
        return 'bg-red-500';
    };

    return (
        <div className="p-8 space-y-8 overflow-y-auto h-full max-w-7xl mx-auto scrollbar-hide bg-[#f8fafc]">
            {/* Header Eksekutif */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter">Executive Dashboard</h1>
                    <p className="text-slate-500 font-bold flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full animate-pulse bg-emerald-500"></span>
                        Status Evaluasi Pemdi Kab. Minahasa Selatan Periode 2026
                    </p>
                </div>
                <button className="bg-slate-900 text-white font-bold px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all">
                    <Download size={18} /> Download Laporan Strategis
                </button>
            </div>

            {/* Indeks Utama & Radar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Score Card */}
                <div className="lg:col-span-1 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-10 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
                    <div className="space-y-2 relative z-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-4">Indeks SPBE Kabupaten</p>
                        <h2 className="text-8xl font-black text-indigo-600 tracking-tighter leading-none">{stats.globalIndex} <span className="text-2xl text-slate-300 font-bold">/ 5.00</span></h2>
                    </div>
                    <div className="mt-10 space-y-4 relative z-10">
                        <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                             <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Predikat</p>
                             <p className="text-xl font-black text-slate-700">{stats.predicate}</p>
                        </div>
                        <div className="flex items-center gap-3 px-2">
                             <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                 <div 
                                    className={`h-full transition-all duration-1000 ${getMaturityColor(stats.globalIndex)}`} 
                                    style={{ width: `${(stats.globalIndex / 5) * 100}%` }}
                                 ></div>
                             </div>
                             <span className="text-xs font-black text-slate-400">{(stats.globalIndex / 5 * 100).toFixed(0)}% Target</span>
                        </div>
                    </div>
                </div>

                {/* Radar Chart Visual */}
                <div className="lg:col-span-2 bg-white rounded-[4rem] border border-slate-100 shadow-sm p-10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Kematangan Per Aspek</h3>
                        <div className="flex items-center gap-2">
                             <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Realiasi 2026</span>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.aspectScores}>
                                <PolarGrid stroke="#f1f5f9" />
                                <PolarAngleAxis dataKey="name" tick={{fontSize: 10, fontWeight: 900, fill: '#64748b'}} />
                                <PolarRadiusAxis angle={30} domain={[0, 5]} hide />
                                <Radar
                                    name="Capaian"
                                    dataKey="value"
                                    stroke="#4f46e5"
                                    strokeWidth={3}
                                    fill="#4f46e5"
                                    fillOpacity={0.15}
                                />
                                <ChartTooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px'}} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top 5 Ranking */}
                <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-10 overflow-hidden relative">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                                <Trophy size={20} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Top 5 Perangkat Daerah</h3>
                        </div>
                        <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Lihat Semua</button>
                    </div>

                    <div className="space-y-4">
                        {stats.ranking.map((opd, idx) => (
                            <div key={opd.id} className="group relative flex items-center justify-between p-5 bg-slate-50/50 hover:bg-slate-50 rounded-[2rem] transition-all border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-5">
                                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg ${idx === 0 ? 'bg-amber-400 rotate-3' : (idx === 1 ? 'bg-slate-400 -rotate-2' : (idx === 2 ? 'bg-orange-400 rotate-6' : 'bg-slate-200 text-slate-400'))}`}>
                                        {idx + 1}
                                     </div>
                                     <div>
                                         <p className="text-sm font-black text-slate-800 leading-tight">{opd.nama}</p>
                                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{opd.singkatan}</p>
                                     </div>
                                </div>
                                <div className="text-right">
                                     <p className="text-xl font-black text-slate-800 tracking-tighter">{(opd.nilai_akhir || 0).toFixed(2)}</p>
                                     <div className="flex items-center justify-end gap-1 text-[10px] font-black text-emerald-500 uppercase">
                                        <TrendingUp size={10} /> Naik
                                     </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Info & Recommendations */}
                <div className="space-y-8">
                    <div className="bg-indigo-600 rounded-[3.5rem] p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 blur-xl"></div>
                        
                        <div className="space-y-6 relative z-10">
                             <div className="flex items-center gap-3">
                                 <ShieldCheck size={24} />
                                 <h3 className="text-lg font-black tracking-tight">Rekomendasi Strategis</h3>
                             </div>
                             <p className="text-indigo-100 font-bold leading-relaxed text-sm">
                                "Terdapat 3 Aspek yang masih di bawah target nasional. Fokus pada **Kebijakan Manajemen Data** dan **Keamanan Informasi** untuk mencapai Indeks 3.8 pada triwulan depan."
                             </p>
                             <button className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-all">
                                Lihat Detail Analisis <ChevronRight size={12} />
                             </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-3">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                                <UserCheck size={20} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-800">100%</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Partisipasi OPD</p>
                            </div>
                         </div>
                         <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-3 font-bold">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
                                <Medal size={20} />
                            </div>
                             <div>
                                <p className="text-2xl font-black text-slate-800">#42</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ranking Nasional</p>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPimpinan;
