import { useState } from 'react';
import { Activity, Search, Filter, User, Clock, ChevronRight, CheckCircle2, AlertTriangle, Trash2, LogIn, LogOut, Edit2, Plus, Layers } from 'lucide-react';

const LOG_DUMMY = [
  { id: 1, user: 'Admin Sistem', role: 'Admin', aksi: 'Login ke sistem', modul: 'Auth', waktu: '2026-04-07 11:30:05', tipe: 'info' },
  { id: 2, user: 'Admin Sistem', role: 'Admin', aksi: 'Menambah OPD: Dinas Pertanian', modul: 'Manajemen OPD', waktu: '2026-04-07 11:28:44', tipe: 'create' },
  { id: 3, user: 'Operator I', role: 'Operator', aksi: 'Generate laporan rekap Q1', modul: 'Laporan', waktu: '2026-04-07 10:55:21', tipe: 'info' },
  { id: 4, user: 'Asesor Utama', role: 'Asesor', aksi: 'Verifikasi bukti IK-05 OPD KOMINFO', modul: 'Verifikasi', waktu: '2026-04-07 10:40:13', tipe: 'update' },
  { id: 5, user: 'Admin Sistem', role: 'Admin', aksi: 'Menghapus User: test@gmail.com', modul: 'Manajemen User', waktu: '2026-04-07 10:30:00', tipe: 'delete' },
  { id: 6, user: 'OPD DINKES', role: 'OPD', aksi: 'Unggah bukti IK-08: SK Perlindungan Data.pdf', modul: 'Evaluasi Mandiri', waktu: '2026-04-07 09:55:30', tipe: 'create' },
  { id: 7, user: 'Pimpinan', role: 'Pimpinan', aksi: 'Login ke sistem', modul: 'Auth', waktu: '2026-04-07 09:00:00', tipe: 'info' },
  { id: 8, user: 'OPD KOMINFO', role: 'OPD', aksi: 'Simpan penilaian mandiri IK-01 (nilai: 4)', modul: 'Evaluasi Mandiri', waktu: '2026-04-07 08:45:17', tipe: 'update' },
];

const tipeConfig = {
  info:   { color: 'bg-blue-50 text-blue-600', icon: CheckCircle2 },
  create: { color: 'bg-emerald-50 text-emerald-600', icon: Plus },
  update: { color: 'bg-amber-50 text-amber-700', icon: Edit2 },
  delete: { color: 'bg-red-50 text-red-600', icon: Trash2 },
};

const roleColors = {
  Admin:    'bg-red-50 text-red-700',
  Asesor:   'bg-emerald-50 text-emerald-700',
  OPD:      'bg-blue-50 text-blue-700',
  Operator: 'bg-orange-50 text-orange-700',
  Pimpinan: 'bg-purple-50 text-purple-700',
};

const LogAktivitas = () => {
  const [search, setSearch] = useState('');
  const [filterTipe, setFilterTipe] = useState('semua');

  const filtered = LOG_DUMMY.filter(log => {
    const matchSearch = log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.aksi.toLowerCase().includes(search.toLowerCase()) ||
      log.modul.toLowerCase().includes(search.toLowerCase());
    const matchTipe = filterTipe === 'semua' || log.tipe === filterTipe;
    return matchSearch && matchTipe;
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Activity className="text-red-600" size={32} /> Log Aktivitas
          </h1>
          <p className="text-slate-500 font-bold mt-1">Rekam jejak seluruh tindakan pengguna dalam sistem.</p>
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
            className="w-full bg-slate-50 border-none outline-none pl-12 pr-4 py-3 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-red-100"
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
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filtered.map(log => {
            const cfg = tipeConfig[log.tipe];
            const Icon = cfg.icon;
            return (
              <div key={log.id} className="flex items-start gap-5 px-8 py-5 hover:bg-slate-50/50 transition-colors group">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-1 ${cfg.color}`}>
                  <Icon size={18} />
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-black text-slate-800 text-sm">{log.user}</span>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${roleColors[log.role] || 'bg-slate-100 text-slate-500'}`}>
                      {log.role}
                    </span>
                    <span className="text-slate-300 text-xs">·</span>
                    <span className="text-xs font-bold text-slate-400">{log.modul}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-600 truncate">{log.aksi}</p>
                </div>
                {/* Time */}
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 justify-end">
                    <Clock size={10} />
                    {log.waktu}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <Activity className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-bold">Tidak ada log yang cocok pencarian Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogAktivitas;
