/* eslint-disable */
import { useState, useEffect } from 'react';
import { 
  Menu, Bell, Search
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();
  const [opdName, setOpdName] = useState('...');

  useEffect(() => {
     if (user?.id) {
        supabase.from('users').select('*, opds(*)').eq('id', user.id).single()
          .then(({data, error}) => {
             if (!error && data) {
                let currentOpd = data.opds;
                if (Array.isArray(currentOpd)) currentOpd = currentOpd[0];
                setOpdName(currentOpd?.nama || 'Pusat Pemerintahan');
             } else {
                setOpdName('Dasbor Admin');
             }
          });
     }
  }, [user?.id]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-50 transition-opacity bg-slate-900/40 lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)} />
      
      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 transition-transform bg-white lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onMobileClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header Section */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(true)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl lg:hidden transition-colors">
              <Menu size={24} className="text-slate-600" />
            </button>
            <div className="hidden md:flex items-center gap-2 text-slate-400 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 focus-within:border-red-200 transition-all">
                <Search size={18} />
                <input type="text" placeholder="Cari data..." className="bg-transparent border-none outline-none text-sm font-bold w-64 text-slate-800 placeholder:text-slate-300" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{user?.role === 1 ? 'Administrator' : 'Operator OPD'}</span>
            </div>
            <button onClick={() => toast.success('Belum ada notifikasi baru')} className="relative p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-500 transition-all active:scale-95 shadow-inner">
              <Bell size={22} />
              <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white" />
            </button>
            <div className="h-10 w-[1px] bg-slate-100 mx-2" />
            <div className="flex items-center gap-4 pl-2 group cursor-pointer">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-black text-slate-800 uppercase leading-none">{user?.name?.split(' ')[0]}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic line-clamp-1 max-w-[200px]" title={opdName}>{opdName}</p>
              </div>
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl italic shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform">
                {user?.name?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area - This is where Outlet renders the sub-routes */}
        <main className="flex-1 overflow-y-auto relative h-full scrollbar-hide">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
