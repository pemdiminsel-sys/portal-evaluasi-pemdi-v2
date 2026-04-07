import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardPimpinan from './DashboardPimpinan';

// Import Modul Baru
import UserManagement from './UserManagement';
import OpdManagement from './OpdManagement';
import ManajemenIndikator from './ManajemenIndikator';
import ManajemenAspek from './ManajemenAspek';
import ManajemenPeriode from './ManajemenPeriode';
import ProfileManagement from './ProfileManagement';
import EvaluasiMandiri from './EvaluasiMandiri';
import VerifikasiOPD from './VerifikasiOPD';
import MonitoringProgres from './MonitoringProgres';
import RankingKlasemen from './RankingKlasemen';
import ExportData from './ExportData';
import LogActivity from './LogActivity';

import { 
  Bell, Search, TrendingUp, Users, FileText, 
  ArrowUpRight, ArrowDownRight, Target, Loader2
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../services/api';

const DashboardOverview = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState({
      stats: { total_opd: 0, total_evidence: 0, avg_score: 0 },
      recent: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard-summary');
        if (res.data && res.data.success) {
            setData(res.data.data);
        }
      } catch (error) {
        console.warn("Backend API not ready, using fallback UI.");
      } finally {
        // Matikan loading secepatnya agar tidak putih
        setLoading(false);
      }
    };
    fetchStats();
    // Safety timeout: jika 3 detik tidak respon, matikan loading
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { title: 'Total OPD terdaftar', value: data?.stats?.total_opd || 0, icon: Users, color: 'indigo' },
    { title: 'Indikator SPBE', value: '20', icon: Target, color: 'blue' },
    { title: 'Dokumen Bukti', value: data?.stats?.total_evidence || 0, icon: FileText, color: 'violet' },
    { title: 'Indeks Rata-rata', value: (data?.stats?.avg_score || 0).toFixed(2), icon: TrendingUp, color: 'emerald' },
  ];

  if (loading) return (
     <div className="h-full flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Initializing Portal...</span>
     </div>
  );

  return (
    <div className="p-10 space-y-10 overflow-y-auto h-full scrollbar-hide bg-slate-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">
            Selamat Datang, <span className="text-red-600 underline decoration-8 decoration-slate-200 underline-offset-8">{user?.name?.split(' ')[0] || 'User'}</span> 👋
          </h1>
          <p className="text-slate-400 font-bold mt-3 text-xs uppercase tracking-[0.3em] italic">
             Portal SPBE V2 - Pemerintah Kabupaten Minahasa Selatan
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-10 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
            <div className="p-5 rounded-[2rem] bg-slate-50 text-slate-800 inline-flex mb-8 group-hover:bg-red-600 group-hover:text-white transition-all duration-500 shadow-inner">
              <stat.icon size={28} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none drop-shadow-sm">{stat.title}</span>
            </div>
            <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Info Card Premium */}
      <div className="bg-slate-900 rounded-[4rem] p-16 relative overflow-hidden shadow-2xl border border-slate-800">
         <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic italic leading-tight">
                   Evaluasi Mandiri <span className="text-red-500 font-black">2026</span> Sedang Berlangsung
                </h2>
                <p className="text-slate-400 mt-6 font-bold text-lg leading-relaxed max-w-xl">
                   Pastikan seluruh OPD melengkapi dokumen bukti dukung sebelum batas waktu yang ditentukan. Pemantauan dilakukan secara real-time oleh Pimpinan.
                </p>
            </div>
            <div className="w-full lg:w-auto">
               <button className="px-12 py-6 bg-red-600 text-white font-black rounded-3xl text-sm uppercase tracking-[0.2em] shadow-xl shadow-red-900/20 hover:bg-white hover:text-red-600 transition-all hover:scale-105 active:scale-95 leading-none">
                  Lihat Progres Seluruh OPD
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden relative">
        <Routes>
          <Route path="/" element={user?.role === 5 || user?.role === 1 ? <DashboardPimpinan /> : <DashboardOverview />} />
          <Route path="/evaluasi" element={<EvaluasiMandiri />} />
          <Route path="/verifikasi" element={<VerifikasiOPD />} />
          <Route path="/monitoring" element={<MonitoringProgres />} />
          <Route path="/ranking" element={<RankingKlasemen />} />
          <Route path="/export" element={<ExportData />} />
          <Route path="/logs" element={<LogActivity />} />
          <Route path="/profil" element={<ProfileManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/opd" element={<OpdManagement />} />
          <Route path="/indikator" element={<ManajemenIndikator />} />
          <Route path="/aspek" element={<ManajemenAspek />} />
          <Route path="/periode" element={<ManajemenPeriode />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
