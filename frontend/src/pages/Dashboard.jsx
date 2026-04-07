import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardPimpinan from './DashboardPimpinan';

// Import Modul Baru Premium
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
  ArrowUpRight, ArrowDownRight, Target, Loader2, Building2
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../services/api';

const DashboardOverview = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard-summary');
        setData(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="h-full flex items-center justify-center italic font-black text-slate-300 animate-pulse uppercase tracking-widest">
        Syncing Global Progress...
    </div>
  );

  const stats = [
    { title: 'Total OPD terdaftar', value: data?.stats?.total_opd || 0, icon: Users, color: 'indigo' },
    { title: 'Indikator SPBE', value: '20', icon: Target, color: 'blue' },
    { title: 'Dokumen Bukti', value: data?.stats?.total_evidence || 0, icon: FileText, color: 'violet' },
    { title: 'Indeks Rata-rata', value: (data?.stats?.avg_score || 0).toFixed(2), icon: TrendingUp, color: 'emerald' },
  ];

  return (
    <div className="p-10 space-y-10 overflow-y-auto h-full scrollbar-hide">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Selamat Datang, {user?.name?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-slate-400 font-bold mt-1 text-xs uppercase tracking-widest italic leading-tight">
             Portal SPBE V2 Cloud - Digital Excellence Portal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 group hover:shadow-xl transition-all relative overflow-hidden">
            <div className={`p-4 rounded-3xl bg-slate-50 text-slate-800 inline-flex mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{stat.title}</span>
            </div>
            <h3 className="text-4xl font-black text-slate-800 tracking-tighter italic italic tracking-tighter uppercase">{stat.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={user?.role === 6 ? <DashboardPimpinan /> : <DashboardOverview />} />
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
