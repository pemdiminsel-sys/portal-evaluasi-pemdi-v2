import { useState, useEffect } from 'react';
import { 
  Users, FileText, TrendingUp, Target, Loader2, Star, Activity
} from 'lucide-react';
import { supabase } from '../services/supabase';
import useAuthStore from '../store/authStore';
import api from '../services/api';

const DashboardOverview = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState({
      stats: { total_opd: 0, total_evidence: 0, avg_score: 0, totalIndikator: '20' },
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

            if (pErr) console.error("DashboardOverview: Error fetching periodes", pErr);
            
            // Extremely permissive: take the first one found if any exist
            const activeP = pDataAll?.[0];
            if (activeP) {
                console.log("DashboardOverview: Selected period:", activeP.tahun);
                setPeriode(activeP);
                const { data: anData, error: anErr } = await supabase.from('indikators').select('id');
                if (!anErr) setData(prev => ({ ...prev, stats: { ...prev.stats, totalIndikator: anData.length } }));
            }

            const res = await api.post('/', { action: 'dashboard-summary' });
            if (res.data && res.data.success) {
                setData(prev => ({ ...prev, ...res.data.data }));
            }
      } catch (error) {
        console.warn("DashboardOverview: API issue", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
     <div className="h-full flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Synchronizing Data...</span>
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
          <StatCard title="Total OPD" value={data?.stats?.total_opd} icon={Users} color="indigo" />
          <StatCard title="Indikator" value={data?.stats?.totalIndikator} icon={Target} color="blue" />
          <StatCard title="Dokumen" value={data?.stats?.total_evidence} icon={FileText} color="violet" />
          <StatCard title="Indeks" value={(data?.stats?.avg_score || 0).toFixed(2)} icon={TrendingUp} color="emerald" />
      </div>

      <div className="bg-slate-900 rounded-[4rem] p-16 relative overflow-hidden shadow-2xl border border-slate-800">
         <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-tight">
                   Evaluasi Mandiri {periode?.tahun || '2026'} <span className="text-red-500">Berlangsung</span>
                </h2>
                <p className="text-slate-400 mt-6 font-bold text-lg leading-relaxed max-w-xl">
                   Sistem mendeteksi periode aktif. Silakan lengkapi dokumen bukti dukung sesuai indikator yang ditugaskan.
                </p>
            </div>
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-10 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 group transition-all duration-500 relative overflow-hidden">
        <div className={`p-5 rounded-[2rem] bg-slate-50 text-slate-800 inline-flex mb-8 group-hover:bg-red-600 group-hover:text-white transition-all duration-500 shadow-inner`}>
            <Icon size={28} />
        </div>
        <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{title}</span>
        </div>
        <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">{value || 0}</h3>
    </div>
);

export default DashboardOverview;
