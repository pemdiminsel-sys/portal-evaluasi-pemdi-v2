import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, CheckCircle, Users, Settings, LogOut, BarChart3, ChevronRight,
  ShieldCheck, Building2, ListChecks, Layers, CalendarDays, Database, Activity, History,
  Edit2, MapPin, FileSignature, PieChart, Printer, Bell, Download, TrendingUp, Trophy, Target, Archive,
  Key, ShieldAlert, Mail
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const Sidebar = ({ onMobileClose }) => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // PEMETAAN ROLE BARU
  const navigationGroups = [
    {
      group: 'Utama',
      items: [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: [1, 2, 3, 4, 5, 6] },
        { title: 'Profil Akun', icon: ShieldCheck, path: '/dashboard/profil', roles: [1, 2, 3, 4, 5, 6] }
      ]
    },
    {
      group: 'Master Data',
      items: [
        { title: 'Manajemen User', icon: Key, path: '/dashboard/users', roles: [1, 4] },
        { title: 'Manajemen OPD', icon: Building2, path: '/dashboard/opd', roles: [1, 2] },
        { title: 'Manajemen Indikator', icon: ListChecks, path: '/dashboard/indikator', roles: [1, 2] },
        { title: 'Manajemen Aspek', icon: Layers, path: '/dashboard/aspek', roles: [1, 2] },
        { title: 'Manajemen Periode', icon: CalendarDays, path: '/dashboard/periode', roles: [1, 2] }
      ]
    },
    {
      group: 'Evaluasi SPBE',
      items: [
        { title: 'Penilaian Mandiri', icon: FileText, path: '/dashboard/evaluasi', roles: [1, 3] },
        { title: 'Riwayat Penilaian', icon: History, path: '/dashboard/riwayat', roles: [3] },
        { title: 'Profil Instansi OPD', icon: Building2, path: '/dashboard/profil-opd', roles: [3] },
        { title: 'Verifikasi OPD', icon: CheckCircle, path: '/dashboard/verifikasi', roles: [1, 4] },
        { title: 'Catatan Perbaikan', icon: Edit2, path: '/dashboard/catatan', roles: [4] },
        { title: 'Penilaian Interviu', icon: Users, path: '/dashboard/penilaian-interviu', roles: [4] },
        { title: 'Berita Acara', icon: FileSignature, path: '/dashboard/berita-acara', roles: [4] }
      ]
    },
    {
      group: 'Laporan',
      items: [
        { title: 'Monitoring Progres', icon: Activity, path: '/dashboard/monitoring', roles: [1, 2, 5] },
        { title: 'Ranking Klasemen', icon: Trophy, path: '/dashboard/ranking', roles: [1, 2, 5] },
        { title: 'Laporan Indeks', icon: PieChart, path: '/dashboard/rekap-nilai', roles: [1, 2, 5] },
        { title: 'Ekspor Data', icon: Download, path: '/dashboard/export', roles: [1, 2, 5] }
      ]
    },
    {
      group: 'Pemeliharaan',
      items: [
        { title: 'Pengaturan SMTP', icon: Mail, path: '/dashboard/smtp', roles: [1, 2] },
        { title: 'Backup & Logs', icon: Database, path: '/dashboard/logs', roles: [1, 2] }
      ]
    }
  ];

  const roleNames = {
    1: 'Super Admin',
    2: 'Admin Pemkab',
    3: 'Operator OPD',
    4: 'Tim Asesor',
    5: 'Pimpinan',
    6: 'Viewer'
  };

  return (
    <div className="w-72 bg-white border-r border-slate-100 flex flex-col h-full shadow-sm">
      <div className="p-8 flex items-center gap-4 border-b border-slate-100 bg-slate-50/50">
        <div className="p-2 bg-red-600 rounded-2xl shadow-lg shadow-red-100">
           <ShieldCheck className="text-white" size={24} />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-red-600 leading-tight text-sm tracking-tighter uppercase">PORTAL EVALUASI</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic tracking-tighter">PEMKAB MINSEL</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-6 mt-6 overflow-y-auto scrollbar-hide pb-8">
        {navigationGroups.map((navGroup, gIdx) => {
          // Filter out items the user cannot see
          const allowedItems = navGroup.items.filter(item => item.roles.includes(Number(user?.role)));
          
          if (allowedItems.length === 0) return null;

          return (
            <div key={gIdx} className="space-y-2">
              <p className="px-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{navGroup.group}</p>
              {allowedItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onMobileClose}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all group font-black text-xs uppercase tracking-widest ${
                    location.pathname === item.path
                      ? 'bg-red-600 text-white shadow-xl shadow-red-100 scale-[1.02]'
                      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <item.icon size={18} className={location.pathname === item.path ? 'text-white' : 'text-slate-300 group-hover:text-red-500'} />
                  <span>{item.title}</span>
                  {location.pathname === item.path && <ChevronRight size={14} className="ml-auto opacity-50" />}
                </Link>
              ))}
            </div>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-slate-900 rounded-[2rem] p-6 mb-6 border border-slate-800 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldAlert className="text-white" size={64} />
          </div>
          <p className="text-[9px] font-black text-red-400 uppercase tracking-[0.3em] mb-4">Credentials</p>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white font-black text-xl italic shadow-inner">
               {(user?.name?.[0] || 'U').toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-black text-white truncate drop-shadow-md">{user?.name}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{roleNames[user?.role] || 'User'}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-4 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all text-xs font-black uppercase tracking-widest active:scale-95 shadow-sm"
        >
          <LogOut size={18} />
          <span>Exit Portal</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
