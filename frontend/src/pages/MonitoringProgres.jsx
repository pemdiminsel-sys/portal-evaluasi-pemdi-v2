import { useState, useEffect } from 'react';
import { 
  Activity, BarChart3, PieChart, Users, Building2, CheckCircle, 
  Clock, AlertCircle, Loader2, Search, ArrowUpRight, ShieldCheck,
  TrendingUp, Monitor, Filter
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

const MonitoringProgres = () => {
    const [stats, setStats] = useState({
        totalOpd: 0,
        notStarted: 0,
        draft: 0,
        submitted: 0,
        verified: 0
    });
    const [opds, setOpds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            
            // 1. Ambil Periode Aktif
            const { data: pData } = await supabase.from('periodes').select('id').eq('status', 'active').single();
            if (!pData) return;

            // 2. Ambil Semua OPD dan Status Penilaiannya
            const { data: opdData, error } = await supabase
                .from('opds')
                .select('*, penilaians(status)')
                .order('nama');

            if (error) throw error;

            // 3. Kalkulasi Statistik Sederhana (Sample Base)
            const processedOpds = (opdData || []).map(opd => {
                const sub = (opd.penilaians || []).filter(p => p.status === 1).length;
                const ver = (opd.penilaians || []).filter(p => p.status === 2).length;
                
                let status = 'not_started';
                if (ver > 0) status = 'verified';
                else if (sub > 0) status = 'submitted';
                else if (opd.penilaians?.length > 0) status = 'draft';

                return { ...opd, currentStatus: status, progress: ( (ver + sub) / 20 ) * 100 };
            });

            setOpds(processedOpds);
            setStats({
                totalOpd: processedOpds.length,
                notStarted: processedOpds.filter(o => o.currentStatus === 'not_started').length,
                draft: processedOpds.filter(o => o.currentStatus === 'draft').length,
                submitted: processedOpds.filter(o => o.currentStatus === 'submitted').length,
                verified: processedOpds.filter(o => o.currentStatus === 'verified').length,
            });

        } catch (err) {
            toast.error('Gagal memuat statistik progres');
        } finally {
            setLoading(false);
        }
    };

    const statusMap = {
        not_started: { label: 'Belum Mulai', color: 'bg-slate-100 text-slate-400', icon: Clock },
        draft: { label: 'Drafting', color: 'bg-amber-100 text-amber-600', icon: AlertCircle },
        submitted: { label: 'Submitted', color: 'bg-indigo-100 text-indigo-600', icon: ShieldCheck },
        verified: { label: 'Verified', color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle },
    };

    const filteredOpds = opds.filter(o => o.nama.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-red-600" size={48} />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest italic">Live Progress Engine Syncing...</p>
        </div>
    );

    return (
        <div className="p-10 space-y-12 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide pb-20">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-slate-800 flex items-center gap-4 italic uppercase tracking-tighter">
                        <Monitor className="text-red-500" size={48} /> Real-Time Monitoring
                    </h1>
                    <p className="text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-[0.4em] italic">Pemantauan Kepatuhan Pengiriman Data Dukung SPBE</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 pr-6 group">
                        <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-red-100 group-hover:rotate-12 transition-transform">
                             <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Average Progress</p>
                            <p className="text-xl font-black text-slate-800 italic">42.5% <span className="text-emerald-500 text-xs">↑ 3%</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                    { label: 'Target OPD', val: stats.totalOpd, color: 'bg-slate-900', icon: Building2 },
                    { label: 'Belum Mulai', val: stats.notStarted, color: 'bg-slate-100', icon: Clock, text: 'text-slate-400' },
                    { label: 'Draf', val: stats.draft, color: 'bg-amber-500', icon: AlertCircle },
                    { label: 'Terkirim', val: stats.submitted, color: 'bg-indigo-600', icon: ShieldCheck },
                    { label: 'Selesai Audit', val: stats.verified, color: 'bg-emerald-500', icon: CheckCircle },
                ].map((s, i) => (
                    <div key={i} className={`${s.color} p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform"><s.icon size={80} /></div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${s.text || 'text-white/60'}`}>{s.label}</p>
                        <h4 className={`text-4xl font-black italic tracking-tighter ${s.text || 'text-white'}`}>{s.val}</h4>
                    </div>
                ))}
            </div>

            {/* Main Listing Monitoring */}
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm"><Filter size={20} className="text-slate-300" /></div>
                        <h3 className="text-xl font-black text-slate-800 italic uppercase">Compliance Matrix</h3>
                    </div>
                    <div className="relative">
                        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            placeholder="Find Agency..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-white border border-slate-100 pl-14 pr-8 py-4 rounded-3xl w-80 font-bold focus:ring-4 focus:ring-red-50 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                            <tr>
                                <th className="px-10 py-8">Agency Name</th>
                                <th className="px-10 py-8">Submission Status</th>
                                <th className="px-10 py-8">Indicator Progress</th>
                                <th className="px-10 py-8 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-bold italic">
                            {filteredOpds.map(opd => {
                                const status = statusMap[opd.currentStatus] || statusMap.not_started;
                                const Icon = status.icon;
                                return (
                                    <tr key={opd.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl italic group-hover:rotate-6 transition-transform">
                                                    {opd.nama[0]}
                                                </div>
                                                <div>
                                                    <p className="text-slate-800 group-hover:text-red-600 transition-colors">{opd.nama}</p>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{opd.singkatan || 'OPD'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`${status.color} px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit border border-current/10`}>
                                                <Icon size={12} /> {status.label}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="w-full max-w-[200px] space-y-2">
                                                <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase italic">
                                                    <span>Verified</span>
                                                    <span>{Math.round(opd.progress)}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full transition-all duration-1000 ${opd.progress > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`} style={{ width: `${opd.progress}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <button className="text-slate-300 hover:text-red-500 transition-colors p-3 bg-white shadow-sm border border-slate-100 rounded-2xl">
                                                <ArrowUpRight size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MonitoringProgres;
