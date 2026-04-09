import { useState, useEffect } from 'react';
import { Activity, Search, Filter, User, Clock, ChevronRight, CheckCircle2, AlertTriangle, Trash2, LogIn, LogOut, Edit2, Plus, Layers, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

const tipeConfig = {
  info:   { color: 'bg-blue-50 text-blue-600', icon: CheckCircle2 },
  create: { color: 'bg-emerald-50 text-emerald-600', icon: Plus },
  update: { color: 'bg-amber-50 text-amber-700', icon: Edit2 },
  delete: { color: 'bg-red-50 text-red-600', icon: Trash2 },
};

const roleColors = {
  1: 'bg-red-50 text-red-700',      // Admin
  2: 'bg-blue-50 text-blue-700',     // Admin Pemkab
  3: 'bg-orange-50 text-orange-700', // OPD
  4: 'bg-emerald-50 text-emerald-700', // Asesor
  5: 'bg-purple-50 text-purple-700',  // Pimpinan
};

const roleLabels = {
  1: 'Admin',
  2: 'Admin Pemkab',
  3: 'OPD',
  4: 'Asesor',
  5: 'Pimpinan',
};

const LogAktivitas = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTipe, setFilterTipe] = useState('semua');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // We try to fetch from logs table, if not exists we fallback to empty
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.warn('Real logs table might not exist yet, using fallback display.');
      // Fallback for demo if table doesn't exist
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter(log => {
    const userField = log.user_name || log.user_email || 'System';
    const matchSearch = userField.toLowerCase().includes(search.toLowerCase()) ||
      (log.action || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.module || '').toLowerCase().includes(search.toLowerCase());
    const matchTipe = filterTipe === 'semua' || log.type === filterTipe;
    return matchSearch && matchTipe;
  });

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-red-600" size={48} />
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Retrieving System Logs...</p>
    </div>
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 italic uppercase tracking-tighter">
            <Activity className="text-red-600" size={32} /> Audit Trail & Logs
          </h1>
          <p className="text-slate-500 font-bold mt-1 uppercase text-[10px] tracking-widest italic">Monitoring aktivitas sistem dan perubahan data secara real-time</p>
        </div>
        <div className="bg-red-50 border border-red-100 text-red-700 font-black text-xs px-4 py-2 rounded-2xl">
          {filtered.length} Entri
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari user, aktivitas, atau modul..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-none outline-none pl-12 pr-4 py-3 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-red-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select value={filterTipe} onChange={e => setFilterTipe(e.target.value)}
            className="bg-slate-50 border-none outline-none px-4 py-3 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-red-100 text-sm">
            <option value="semua">Semua Tipe</option>
            <option value="info">Info / Login</option>
            <option value="create">Tambah Data</option>
            <option value="update">Ubah Data</option>
            <option value="delete">Hapus Data</option>
          </select>
        </div>
      </div>

      {/* Log List */}
      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filtered.map(log => {
            const cfg = tipeConfig[log.type] || tipeConfig.info;
            const Icon = cfg.icon;
            return (
              <div key={log.id} className="flex items-start gap-5 px-10 py-6 hover:bg-slate-50/50 transition-colors group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-1 shadow-sm ${cfg.color}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-black text-slate-800 text-sm italic uppercase tracking-tight">{log.user_name || 'System User'}</span>
                    <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border border-current opacity-70 ${roleColors[log.user_role] || 'bg-slate-100 text-slate-500'}`}>
                      {roleLabels[log.user_role] || 'Generic'}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{log.module || 'System'}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-600 truncate italic">"{log.action || 'No description available'}"</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 justify-end uppercase tracking-widest">
                    <Clock size={12} className="text-slate-300" />
                    {new Date(log.created_at).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="text-slate-200" size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-300 uppercase italic">Empty Audit Trail</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Belum ada aktivitas yang terekam atau filter terlalu ketat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogAktivitas;
