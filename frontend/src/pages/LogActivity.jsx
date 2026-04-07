import { useState, useEffect } from 'react';
import { 
  Activity, Shield, Clock, User, Building2, Search, 
  Filter, AlertTriangle, CheckCircle, Database, ChevronRight,
  HardDrive, History, RefreshCcw, Loader2
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

const LogActivity = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalActions: 4280,
        securityAlerts: 0,
        dbHealth: 'Excellent'
    });

    useEffect(() => {
        // Simulasi Log (Idealnya ambil dari tabel audit_logs)
        const mockLogs = [
            { id: 1, user: 'Admin Kominfo', action: 'Approved User: Hence Ruindungan', target: 'Users Table', time: '2 mins ago', type: 'security' },
            { id: 2, user: 'OPD Kesehatan', action: 'Uploaded Evidence: Indikator 4', target: 'Storage', time: '15 mins ago', type: 'info' },
            { id: 3, user: 'Asesor 1', action: 'Rejected Assessment: Dinas PU', target: 'Penilaians', time: '1 hour ago', type: 'warning' },
            { id: 4, user: 'Admin Pemkab', action: 'Created New Period: 2026', target: 'Periodes', time: '3 hours ago', type: 'info' },
            { id: 5, user: 'System', action: 'Daily Database Backup', target: 'System', time: '5 hours ago', type: 'success' },
        ];
        setLogs(mockLogs);
        setLoading(false);
    }, []);

    const typeColor = {
        security: 'text-red-600 bg-red-50 border-red-100',
        info: 'text-indigo-600 bg-indigo-50 border-indigo-100',
        warning: 'text-amber-600 bg-amber-50 border-amber-100',
        success: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    };

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-slate-900" size={48} />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest italic">Accessing Audit Trail...</p>
        </div>
    );

    return (
        <div className="p-10 space-y-12 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide pb-20">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-slate-800 flex items-center gap-4 italic uppercase tracking-tighter leading-none">
                        <Activity className="text-red-500" size={48} /> Audit & Security Log
                    </h1>
                    <p className="text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-[0.4em] italic leading-tight">Jejak Digital Dan Pengawasan Aktivitas Sistem SPBE V2</p>
                </div>
                <button className="bg-slate-900 text-white font-black px-8 py-4 rounded-2xl shadow-xl flex items-center gap-3 hover:bg-red-600 transition-all active:scale-95">
                    <RefreshCcw size={18} /> Refresh Log
                </button>
            </div>

            {/* System Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                        <Database size={28} />
                    </div>
                    <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Storage Health</p>
                         <h4 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">{stats.dbHealth}</h4>
                    </div>
                </div>
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
                    <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-100 group-hover:-rotate-12 transition-transform">
                        <Shield size={28} />
                    </div>
                    <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Security Alerts</p>
                         <h4 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">{stats.securityAlerts} Detected</h4>
                    </div>
                </div>
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
                    <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                        <History size={28} />
                    </div>
                    <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Logged Actions</p>
                         <h4 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">{stats.totalActions} Events</h4>
                    </div>
                </div>
            </div>

            {/* Activity Stream */}
            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
                 <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-300"><Filter size={20} /></div>
                        <h3 className="font-black text-slate-800 italic uppercase tracking-tight">System Events Stream</h3>
                     </div>
                     <div className="relative">
                        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input className="bg-white border border-slate-100 pl-14 pr-6 py-4 rounded-3xl w-72 outline-none focus:ring-4 focus:ring-slate-50 font-bold transition-all shadow-sm" placeholder="Search events..." />
                     </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-10 space-y-6 scrollbar-hide">
                    {logs.map(log => (
                        <div key={log.id} className="flex gap-6 group hover:translate-x-2 transition-transform cursor-pointer">
                            <div className="flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black border ${typeColor[log.type]}`}>
                                    {log.user[0]}
                                </div>
                                <div className="w-0.5 flex-1 bg-slate-100 my-2"></div>
                            </div>
                            <div className="flex-1 pb-8">
                                <div className="flex items-center justify-between">
                                    <h5 className="font-black text-slate-800 italic uppercase text-sm tracking-tight">{log.user}</h5>
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                        <Clock size={12} /> {log.time}
                                    </span>
                                </div>
                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                                    {log.action} <span className="text-slate-200 mx-2">→</span> Target: <span className="text-indigo-400">{log.target}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default LogActivity;
