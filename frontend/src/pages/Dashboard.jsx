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
import RiwayatPenilaian from './RiwayatPenilaian';
import VerifikasiOPD from './VerifikasiOPD';
import MonitoringProgres from './MonitoringProgres';
import RankingKlasemen from './RankingKlasemen';
import ExportData from './ExportData';
import LogActivity from './LogActivity';
import SmtpSettings from './SmtpSettings';
import CatatanPerbaikan from './CatatanPerbaikan';
import { 
  Users, FileText, TrendingUp, Target, 
  Menu, Bell, Search, Loader2
} from 'lucide-react';
import { supabase } from '../services/supabase';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';

const DashboardOverview = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState({
      stats: { total_opd: 0, total_evidence: 0, avg_score: 0 },
      recent: []
  });
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
            console.log("DashboardOverview: Starting permissive period detection...");
            const { data: pDataAll, error: pErr } = await supabase
                .from('periodes')
                .select('*')
                .order('tahun', { ascending: false });

            if (pErr) {
                console.error("DashboardOverview: Error fetching periodes", pErr);
            } else {
                console.log("DashboardOverview: Found", pDataAll?.length, "periods");
                // Extremely permissive: take the first one if any exist
                const activeP = pDataAll?.[0];
                if (activeP) {
                    console.log("DashboardOverview: Selected period:", activeP.tahun);
                    setPeriode(activeP);
                }
            }

        const res = await api.post('/', { action: 'dashboard-summary' });
        if (res.data && res.data.success) {
            setData(res.data.data);
        }
      } catch (error) {
        console.warn("DashboardOverview: Backend API issue, using fallback.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
     <div className="h-full flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Initializing Portal...</span>
     </div>
  );

  return (
    <div className="p-10 space-y-10">
      <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">
        Selamat Datang, <span className="text-red-600">{user?.name?.split(' ')[0] || 'User'}</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-xs font-bold uppercase">Total OPD</p>
            <h3 className="text-4xl font-black mt-2">{data?.stats?.total_opd || 0}</h3>
        </div>
      </div>
    </div>
  );
};

const DashboardPimpinan = () => (
    <div className="p-10">
        <h1 className="text-2xl font-black">Dashboard Pimpinan</h1>
    </div>
);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <div className={`fixed inset-0 z-50 transition-opacity bg-slate-900/40 lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)} />
      
      <div className={`fixed inset-y-0 left-0 z-50 w-80 transition-transform bg-white lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onMobileClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(true)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl lg:hidden transition-colors">
              <Menu size={24} className="text-slate-600" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden lg:block">
                <p className="text-sm font-black text-slate-800 uppercase">{user?.name?.split(' ')[0]}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto relative h-full scrollbar-hide">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
export { DashboardOverview, DashboardPimpinan };
