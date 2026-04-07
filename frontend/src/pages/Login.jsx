import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-700 via-red-600 to-rose-500 flex-col items-center justify-center p-16 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/2 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <img
            src="/logo-minsel.png"
            alt="Logo Minahasa Selatan"
            className="w-48 h-auto drop-shadow-2xl mb-10"
          />
          <h1 className="text-4xl font-black text-white leading-tight tracking-tight">
            Portal Evaluasi<br />Pemerintah Digital
          </h1>
          <p className="mt-4 text-red-100 font-bold text-lg">Kabupaten Minahasa Selatan</p>
          <div className="mt-10 flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-white/90 font-bold text-sm tracking-wide">SPBE Assessment System v2.0</span>
          </div>
        </motion.div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Mobile logo */}
        <div className="lg:hidden flex flex-col items-center mb-8">
          <img src="/logo-minsel.png" alt="Logo Minahasa Selatan" className="w-24 h-auto mb-3" />
          <h1 className="text-xl font-black text-slate-800">Portal Evaluasi Pemdi</h1>
          <p className="text-slate-500 text-sm font-bold">Kabupaten Minahasa Selatan</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Selamat Datang</h2>
            <p className="text-slate-500 font-bold mt-2">Masuk untuk mengakses Portal SPBE</p>
          </div>

          {error && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center text-sm gap-3 mb-8"
            >
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={19} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@instansi.go.id"
                  required
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={19} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 accent-red-600" />
                <span className="text-sm text-slate-500 group-hover:text-slate-600 font-medium">Ingat saya</span>
              </label>
              <a href="#" className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors">Lupa sandi?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-100 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-12 font-bold tracking-widest uppercase">
            © 2026 Dinas Kominfo — Minahasa Selatan
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
