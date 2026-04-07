import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CheckCircle, 
  Users, 
  Settings, 
  LogOut, 
  BarChart3, 
  ChevronRight,
  ShieldCheck
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

  // Matriks Hak Akses Terpadu (Asesor Digabung)
  const allNavItems = [
    { title: 'Beranda', icon: LayoutDashboard, path: '/dashboard', roles: [1, 2, 3, 5, 6] },
    { title: 'Evaluasi Mandiri', icon: FileText, path: '/dashboard/evaluasi', roles: [1, 2] },
    { title: 'Penialaian Asesor', icon: ShieldCheck, path: '/dashboard/verifikasi', roles: [1, 3] },
    { title: 'Manajemen OPD', icon: BarChart3, path: '/dashboard/opd', roles: [1] },
    { title: 'Manajemen User', icon: Users, path: '/dashboard/users', roles: [1] },
    { title: 'Laporan Rekap', icon: BarChart3, path: '/dashboard/statistik', roles: [1, 5, 6] },
    { title: 'Pengaturan', icon: Settings, path: '/dashboard/settings', roles: [1, 2, 3, 5, 6] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="w-72 bg-white border-r border-slate-100 flex flex-col h-full shadow-sm">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 leading-tight">Portal SPBE</span>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Version 2.0</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group font-medium ${
              location.pathname === item.path
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <item.icon size={20} className={location.pathname === item.path ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
            <span className="text-sm">{item.title}</span>
            {location.pathname === item.path && <ChevronRight size={14} className="ml-auto opacity-50" />}
          </Link>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-slate-50 rounded-2xl p-5 mb-4 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Login Sebagai:</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-indigo-600 font-bold shadow-sm">
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
