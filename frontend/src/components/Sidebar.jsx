import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, CheckCircle, Users, Settings, LogOut, BarChart3, ChevronRight,
  ShieldCheck, Building2, ListChecks, Layers, CalendarDays, Database, Activity, History,
  Edit2, MapPin, FileSignature, PieChart, Printer, Bell, Download, TrendingUp, Trophy, Target, Archive
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const Sidebar = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Matriks Hak Akses Lengkap (SISTEM_BEKERJA.MD)
  const allNavItems = [
    // Dashboard (Menyesuaikan Role)
    { title: 'Dashboard Admin', icon: LayoutDashboard, path: '/dashboard', roles: [1] },
    { title: 'Dashboard OPD', icon: LayoutDashboard, path: '/dashboard', roles: [2] },
    { title: 'Dashboard Asesor', icon: LayoutDashboard, path: '/dashboard', roles: [3] },
    { title: 'Dashboard Operator', icon: LayoutDashboard, path: '/dashboard', roles: [5] },
    { title: 'Dashboard Pimpinan', icon: LayoutDashboard, path: '/dashboard', roles: [6] },

    // Menu Admin (Role 1)
    { title: 'Manajemen User', icon: Users, path: '/dashboard/users', roles: [1] },
    { title: 'Manajemen OPD', icon: Building2, path: '/dashboard/opd', roles: [1] },
    { title: 'Manajemen Indikator', icon: ListChecks, path: '/dashboard/indikator', roles: [1] },
    { title: 'Manajemen Aspek', icon: Layers, path: '/dashboard/aspek', roles: [1] },
    { title: 'Manajemen Periode', icon: CalendarDays, path: '/dashboard/periode', roles: [1] },
    { title: 'Backup Database', icon: Database, path: '/dashboard/backup', roles: [1] },
    { title: 'Log Aktivitas', icon: Activity, path: '/dashboard/logs', roles: [1] },

    // Menu OPD (Role 2)
    { title: 'Penilaian Mandiri', icon: FileText, path: '/dashboard/evaluasi', roles: [2] },
    { title: 'Riwayat Penilaian', icon: History, path: '/dashboard/riwayat', roles: [2] },
    { title: 'Rekomendasi', icon: ShieldCheck, path: '/dashboard/rekomendasi', roles: [2] },
    { title: 'Profil OPD', icon: Settings, path: '/dashboard/profil', roles: [2] },

    // Menu Asesor (Role 3)
    { title: 'Verifikasi Dokumen OPD', icon: CheckCircle, path: '/dashboard/verifikasi', roles: [3] },
    { title: 'Catatan Perbaikan', icon: Edit2, path: '/dashboard/catatan', roles: [3] },
    { title: 'Rekapitulasi Verifikasi', icon: BarChart3, path: '/dashboard/rekap-verifikasi', roles: [3] },
    { title: 'Penilaian Dokumen', icon: FileText, path: '/dashboard/penilaian-dokumen', roles: [3] },
    { title: 'Penilaian Interviu', icon: Users, path: '/dashboard/penilaian-interviu', roles: [3] },
    { title: 'Penilaian Visitasi', icon: MapPin, path: '/dashboard/penilaian-visitasi', roles: [3] },
    { title: 'Berita Acara', icon: FileSignature, path: '/dashboard/berita-acara', roles: [3] },
    { title: 'Rekapitulasi Nilai', icon: PieChart, path: '/dashboard/rekap-nilai', roles: [3, 5] },

    // Menu Operator (Role 5)
    { title: 'Monitoring Progres', icon: Activity, path: '/dashboard/monitoring', roles: [5] },
    // Rekapitulasi Nilai juga bisa diakses Role 5 (sudah didefinisikan di atas)
    { title: 'Generate Laporan', icon: Printer, path: '/dashboard/generate-laporan', roles: [5] },
    { title: 'Notifikasi', icon: Bell, path: '/dashboard/notifikasi', roles: [5] },
    { title: 'Export Data', icon: Download, path: '/dashboard/export', roles: [5] },

    // Menu Pimpinan (Role 6)
    { title: 'Laporan Indeks Pemdi', icon: TrendingUp, path: '/dashboard/indeks-pemdi', roles: [6] },
    { title: 'Ranking OPD', icon: Trophy, path: '/dashboard/ranking', roles: [6] },
    { title: 'Rekomendasi Strategis', icon: Target, path: '/dashboard/rekomendasi-strategis', roles: [6] },
    { title: 'Arsip', icon: Archive, path: '/dashboard/arsip', roles: [6] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="w-72 bg-white border-r border-slate-100 flex flex-col h-full shadow-sm">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <img src="/logo-minsel.png" alt="Logo Minsel" className="w-10 h-auto" />
        <div className="flex flex-col">
          <span className="font-black text-slate-800 leading-tight text-sm">Portal SPBE</span>
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Minahasa Selatan</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group font-medium ${
              location.pathname === item.path
                ? 'bg-red-50 text-red-600'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <item.icon size={20} className={location.pathname === item.path ? 'text-red-600' : 'text-slate-400 group-hover:text-slate-600'} />
            <span className="text-sm">{item.title}</span>
            {location.pathname === item.path && <ChevronRight size={14} className="ml-auto opacity-50" />}
          </Link>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-slate-50 rounded-2xl p-5 mb-4 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Login Sebagai:</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 border-2 border-white flex items-center justify-center text-red-600 font-bold shadow-sm">
              {user?.name?.[0].toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-700 truncate">{user?.name}</span>
              <span className="text-[10px] font-medium text-slate-500 uppercase">{user?.role}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all text-sm font-bold active:scale-95"
        >
          <LogOut size={18} />
          <span>Keluar Aplikasi</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
