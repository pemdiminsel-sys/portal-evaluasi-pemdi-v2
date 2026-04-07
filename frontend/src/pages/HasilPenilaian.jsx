import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer,
  Cell,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis
} from 'recharts';
import { 
  CheckCircle, 
  TrendingUp, 
  Download, 
  Printer, 
  ChevronRight,
  Loader2,
  Trophy,
  Target
} from 'lucide-react';
import api from '../services/api';

const HasilPenilaian = () => {
    const [rekap, setRekap] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOpd, setSelectedOpd] = useState(null);

    useEffect(() => {
        fetchRekap();
    }, []);

    const fetchRekap = async () => {
        try {
            const res = await api.get('/penilaian');
            setRekap(res.data.data);
            if (res.data.data.length > 0) {
                setSelectedOpd(res.data.data[0]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 4) return 'text-emerald-500 bg-emerald-50';
        if (score >= 3) return 'text-indigo-500 bg-indigo-50';
        if (score >= 2) return 'text-amber-500 bg-amber-50';
        return 'text-red-500 bg-red-50';
    };

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;

    return (
        <div className="p-10 space-y-10 overflow-y-auto h-full max-w-7xl mx-auto scrollbar-hide">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Hasil Penilaian</h1>
                        <p className="text-slate-500 font-medium">Rekapitulasi nilai kematangan SPBE seluruh instansi.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white border border-slate-200 text-slate-600 font-bold px-5 py-3 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <Printer size={18} />
                        Cetak Laporan
                    </button>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center gap-2 shadow-sm active:scale-95">
                        <Download size={18} />
                        Ekspor Excel
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* List Table */}
                <div className="lg:col-span-3 bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 overflow-hidden h-fit">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-800">Daftar Peringkat</h3>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Periode 2026</span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                    <th className="pb-4">Instansi</th>
                                    <th className="pb-4 text-center">Indeks</th>
                                    <th className="pb-4 text-center">Predikat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {rekap.map((item, idx) => (
                                    <tr 
                                        key={item.id} 
                                        onClick={() => setSelectedOpd(item)}
                                        className={`group cursor-pointer transition-all ${
                                            selectedOpd?.id === item.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50/50'
                                        }`}
                                    >
                                        <td className="py-5 pr-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-black text-slate-300 w-4">{idx + 1}</span>
                                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 font-black text-[10px]">
                                                    {item.singkatan || item.nama.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className={`text-sm font-bold ${selectedOpd?.id === item.id ? 'text-indigo-600' : 'text-slate-700'}`}>{item.nama}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 text-center">
                                            <span className={`px-3 py-1.5 rounded-xl text-xs font-black ${getScoreColor(item.nilai_akhir || 0)}`}>
                                                {(item.nilai_akhir || 0).toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="py-5 text-center">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {(item.nilai_akhir || 0) >= 3.5 ? 'BAIK' : (item.nilai_akhir || 0) >= 2.6 ? 'CUKUP' : 'KURANG'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Report Details & Visuals */}
                <div className="lg:col-span-2 space-y-8">
                    {selectedOpd && (
                        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 space-y-8">
                             <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">{selectedOpd.nama}</h3>
                                <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest">Analisis Visual Kematangan</p>
                             </div>

                             {/* Chart Radar */}
                             <div className="h-[300px] w-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[
                                        { label: 'Kebijakan', score: 3.5 },
                                        { label: 'Tata Kelola', score: 2.8 },
                                        { label: 'Manajemen', score: 3.2 },
                                        { label: 'Layanan', score: 4.1 }
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                                        <YAxis domain={[0, 5]} hide />
                                        <ChartTooltip 
                                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                                            cursor={{fill: '#f8fafc', radius: 10}}
                                        />
                                        <Bar dataKey="score" radius={[8, 8, 8, 8]} barSize={40}>
                                            {[0, 1, 2, 3].map((entry, index) => (
                                                <Cell key={index} fill={index % 2 === 0 ? '#4f46e5' : '#6366f1'} opacity={0.8} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                             </div>

                             <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                                    <div className="flex items-center gap-2 text-indigo-600 mb-2">
                                        <TrendingUp size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Kekuatan</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-700 leading-relaxed">Layanan Publik Digital sudah di atas rata-rata.</p>
                                </div>
                                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                                    <div className="flex items-center gap-2 text-amber-600 mb-2">
                                        <Target size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Kelemahan</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-700 leading-relaxed">Manajemen keamanan informasi perlu dokumen pendukung.</p>
                                </div>
                             </div>

                             <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex items-center justify-between group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                                <div className="space-y-1 relative z-10">
                                    <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest leading-none">Indeks Akhir</p>
                                    <p className="text-3xl font-black tracking-tighter">{(selectedOpd.nilai_akhir || 0).toFixed(2)}</p>
                                </div>
                                <div className="text-right relative z-10">
                                     <button className="bg-white/20 hover:bg-white/30 text-white rounded-xl p-3 px-4 text-xs font-bold transition-all flex items-center gap-2 hover:translate-x-1">
                                        Rincian <ChevronRight size={14} />
                                     </button>
                                </div>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HasilPenilaian;
