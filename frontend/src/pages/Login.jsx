import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ShieldCheck, Github, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-slate-50">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg p-8 relative z-10"
      >
        <div className="glass rounded-3xl p-10 backdrop-blur-xl shadow-2xl border border-white/40">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-6 group cursor-pointer hover:rotate-6 transition-transform">
              <ShieldCheck className="w-9 h-9 text-white group-hover:scale-110 transition-transform" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Portal Evaluasi Pemdi</h1>
            <p className="text-slate-500 font-medium mt-2">Versi 2.0 (Modern System)</p>
          </div>

          {error && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-50/70 border border-red-100 text-red-600 p-4 rounded-xl flex items-center text-sm gap-3 mb-8"
            >
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email Kemenkominfo</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={19} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@kominfo.go.id"
                  required
                  className="w-full bg-slate-50/50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={19} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50/50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-slate-500 group-hover:text-slate-600 font-medium">Ingat saya</span>
              </label>
              <a href="#" className="text-sm font-semibold text-indigo-500 hover:text-indigo-600 transition-colors">Lupa sandi?</a>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 overflow-hidden relative group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-100">
            <p className="text-center text-sm text-slate-400 font-medium">Atau masuk menggunakan sistem lainnya</p>
            <div className="mt-6 flex gap-4">
              <button className="flex-1 bg-white border border-slate-200 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                <Github size={18} />
                <span className="text-sm font-bold text-slate-700">GitHub</span>
              </button>
              <button className="flex-1 bg-white border border-slate-200 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                <span className="text-sm font-bold text-slate-700">Google</span>
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-center text-xs text-slate-400 mt-10 tracking-widest uppercase font-bold">
          © 2026 Dinas Komunikasi & Informatika
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
