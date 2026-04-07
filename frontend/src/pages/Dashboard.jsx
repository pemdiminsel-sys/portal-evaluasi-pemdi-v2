import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { 
  Bell, 
  Search, 
  TrendingUp, 
  Users, 
  FileText, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  CalendarDays,
  Target
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const DashboardOverview = () => {
  const { user } = useAuthStore();
  
  const stats = [
    { title: 'Total OPD terdaftar', value: '34', icon: Users, change: '+12%', isUp: true, color: 'indigo' },
    { title: 'Indikator Evaluasi', value: '47', icon: Target, change: 'Standard', isUp: true, color: 'blue' },
    { title: 'Dokumen Bukti', value: '182', icon: FileText, change: '+24%', isUp: true, color: 'violet' },
    { title: 'Menunggu Review', value: '5', icon: Clock, change: '-2', isUp: false, color: 'amber' },
  ];

  const recentEvaluations = [
    { opd: 'Dinas Komunikasi & Informatika', date: '7 Apr 2026', status: 'Selesai', score: '3.82', color: 'bg-green-500' },
    { opd: 'Dinas Kesehatan', date: '6 Apr 2026', status: 'Verifikasi', score: '3.42', color: 'bg-indigo-500' },
    { opd: 'Dinas Pendidikan', date: '6 Apr 2026', status: 'Drafting', score: '2.95', color: 'bg-amber-500' },
    { opd: 'Badan Kepegawaian Daerah', date: '5 Apr 2026', status: 'Selesai', score: '3.12', color: 'bg-green-500' },
  ];

  return (
    <div className="p-10 space-y-10 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Selamat Datang, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-slate-500 font-medium mt-1">Berikut adalah ringkasan evaluasi SPBE hari ini.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Cari data evaluasi..." 
              className="bg-white border border-slate-200 pl-11 pr-4 py-3 rounded-2xl w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium" 
            />
          </div>
          <button className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm">
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-md transition-shadow relative overflow-hidden">
            <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 inline-flex mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={22} />
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.title}</span>
              <div className={`flex items-center text-xs font-bold ${stat.isUp ? 'text-green-500' : 'text-amber-500'}`}>
                {stat.isUp ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart/Table Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Evaluasi Terbaru</h2>
            <button className="text-indigo-600 font-bold text-sm hover:underline">Lihat Semua</button>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">OPD Peserta</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Tanggal</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Nilai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentEvaluations.map((item, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{item.opd}</span>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-500">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CalendarDays size={14} className="text-slate-300" />
                        {item.date}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider ${item.color}`}>
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-sm font-bold text-slate-800 tracking-tight">{item.score}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Mini Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 relative overflow-hidden shadow-xl shadow-indigo-100">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="relative z-10 flex flex-col h-full items-center text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30">
              <TrendingUp className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Target Nilai 2026</h2>
            <p className="text-indigo-100 mt-2 font-medium">Bantu kami mencapai Indeks SPBE Sangat Baik!</p>
            
            <div className="mt-10 w-full bg-white/10 rounded-3xl p-6 border border-white/20 backdrop-blur-sm">
                <div className="flex items-end justify-between mb-4">
                    <div className="flex flex-col items-start leading-none">
                        <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">Capaian Saat Ini</span>
                        <span className="text-3xl font-bold text-white tracking-widest">3.12</span>
                    </div>
                    <div className="bg-emerald-400 text-white text-[10px] font-bold px-2 py-1 rounded-sm mb-1 uppercase">+15%</div>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-3/4 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]"></div>
                </div>
                <p className="text-indigo-200 text-xs mt-3 text-left font-medium">75% dari target utama (4.00)</p>
            </div>

            <button className="mt-auto w-full bg-white text-indigo-600 font-bold py-4 rounded-2xl shadow-lg hover:bg-slate-50 transition-all hover:scale-[1.03] active:scale-95">
              Kelola Strategi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/evaluasi" element={<div className="p-10 font-bold text-2xl text-slate-800">Halaman Evaluasi SPBE</div>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
