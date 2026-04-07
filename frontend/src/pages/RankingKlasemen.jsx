import { useState, useEffect } from 'react';
import { 
  Trophy, Medal, TrendingUp, TrendingDown, Minus, 
  Crown, Star, Loader2, Target, Award, Search, Building2
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

const RankingKlasemen = () => {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRankings();
    }, []);

    const fetchRankings = async () => {
        try {
            setLoading(true);
            const { data: pData } = await supabase.from('periodes').select('id').eq('status', 'active').single();
            if (!pData) return;

            // Simulasi Perhitungan Ranking (Logic Gabungan Bobot)
            // Di produksi: Gunakan Database View atau RPC untuk performa
            const { data } = await supabase.from('opds').select('*, penilaians(nilai, status)');
            
            const processed = (data || []).map(opd => {
                const totalScore = (opd.penilaians || [])
                    .filter(p => p.status === 2) // Hanya yang Verified
                    .reduce((acc, curr) => acc + (curr.nilai || 0), 0);
                
                const avg = opd.penilaians?.length > 0 ? (totalScore / 20) : 0; // Baseline 20 Indikator
                
                return {
                    ...opd,
                    score: parseFloat(avg.toFixed(2)),
                    trend: Math.random() > 0.5 ? 'up' : 'down' // Mock trend
                };
            }).sort((a, b) => b.score - a.score);

            setRankings(processed);
        } catch (err) {
            toast.error('Gagal memuat klasemen');
        } finally {
            setLoading(false);
        }
    };

    const topThree = rankings.slice(0, 3);
    const others = rankings.slice(3).filter(r => r.nama.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-amber-500" size={48} />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest italic">Calculating Official Standings...</p>
        </div>
    );

    return (
        <div className="p-10 space-y-12 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide pb-20">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-slate-800 flex items-center gap-4 italic uppercase tracking-tighter">
                        <Trophy className="text-amber-500" size={48} /> OPD Leaderboard
                    </h1>
                    <p className="text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-[0.4em] italic">Pemeringkatan Indeks Kematangan Pemerintah Digital</p>
                </div>
            </div>

            {/* Podium Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pt-10">
                {/* 2nd Place */}
                <div className="bg-white p-10 rounded-[3.5rem] border-b-8 border-slate-300 shadow-xl flex flex-col items-center text-center relative order-2 md:order-1 h-[320px] justify-end">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg italic font-black text-2xl text-slate-400">2</div>
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-xl mb-4 flex items-center justify-center font-black text-2xl italic rotate-3">{topThree[1]?.nama[0]}</div>
                    <h4 className="font-black text-slate-800 text-sm leading-tight mb-2 uppercase">{topThree[1]?.nama}</h4>
                    <p className="text-2xl font-black text-indigo-600 italic tracking-tighter">{topThree[1]?.score || '0.00'}</p>
                    <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest mt-2">Index Point</span>
                </div>

                {/* 1st Place */}
                <div className="bg-slate-900 p-12 rounded-[4rem] border-b-8 border-amber-500 shadow-2xl flex flex-col items-center text-center relative order-1 md:order-2 h-[380px] justify-end group">
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-28 h-28 bg-amber-500 rounded-3xl flex items-center justify-center border-8 border-slate-900 shadow-2xl overflow-hidden">
                         <Crown size={48} className="text-white drop-shadow-lg group-hover:scale-125 transition-transform" />
                    </div>
                    <div className="w-20 h-20 bg-white text-slate-900 rounded-2xl mb-5 flex items-center justify-center font-black text-3xl italic -rotate-3">{topThree[0]?.nama[0]}</div>
                    <h4 className="font-black text-white text-lg leading-tight mb-3 uppercase pr-4 pl-4">{topThree[0]?.nama}</h4>
                    <div className="flex flex-col items-center">
                         <p className="text-4xl font-black text-amber-500 italic tracking-tighter">{topThree[0]?.score || '0.00'}</p>
                         <div className="flex gap-1 mt-2">
                             {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-amber-500 text-amber-500" />)}
                         </div>
                    </div>
                </div>

                {/* 3rd Place */}
                <div className="bg-white p-10 rounded-[3.5rem] border-b-8 border-amber-700 shadow-xl flex flex-col items-center text-center relative order-3 md:order-3 h-[280px] justify-end">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg italic font-black text-xl text-amber-700">3</div>
                    <div className="w-14 h-14 bg-slate-900 text-white rounded-xl mb-4 flex items-center justify-center font-black text-xl italic -rotate-12">{topThree[2]?.nama[0]}</div>
                    <h4 className="font-black text-slate-800 text-sm leading-tight mb-2 uppercase">{topThree[2]?.nama}</h4>
                    <p className="text-2xl font-black text-indigo-600 italic tracking-tighter">{topThree[2]?.score || '0.00'}</p>
                    <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest mt-2">Index Point</span>
                </div>
            </div>

            {/* Others List */}
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden mt-12">
                <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                    <h4 className="text-xl font-black text-slate-800 italic uppercase">Ranking Table</h4>
                    <div className="relative">
                        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input 
                            placeholder="Find Agency Rank..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-slate-50 border border-slate-100 pl-14 pr-8 py-4 rounded-3xl w-72 font-bold focus:ring-4 focus:ring-amber-50 outline-none transition-all shadow-inner"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                            <tr>
                                <th className="px-10 py-8">Ref ID</th>
                                <th className="px-10 py-8">Agency Profile</th>
                                <th className="px-10 py-8">SPBE Index Score</th>
                                <th className="px-10 py-8">Trend</th>
                                <th className="px-10 py-8 text-right">Award Level</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 italic font-bold">
                            {others.map((r, idx) => (
                                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-10 py-8">
                                        <span className="text-xs font-black text-slate-300 italic">#{idx + 4}</span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm italic group-hover:bg-amber-500 transition-colors">
                                                {r.nama[0]}
                                            </div>
                                            <div>
                                                <p className="text-slate-700">{r.nama}</p>
                                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">{r.singkatan || 'OPD'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-lg italic tracking-tighter">
                                                {r.score}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        {r.trend === 'up' ? (
                                            <div className="flex items-center gap-2 text-emerald-500"><TrendingUp size={16} /> <span className="text-[10px] uppercase">Improving</span></div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-rose-500"><TrendingDown size={16} /> <span className="text-[10px] uppercase">Declining</span></div>
                                        )}
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {r.score >= 4.0 ? <Award className="text-amber-500" /> : r.score >= 3.0 ? <Award className="text-indigo-400" /> : <Minus className="text-slate-100" />}
                                            <span className="text-[10px] font-black uppercase text-slate-300 tracking-tighter opacity-50">Qualified</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RankingKlasemen;
