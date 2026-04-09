import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { logActivity } from '../services/logger';

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
      logActivity({
        action: 'Login ke sistem',
        module: 'Auth',
        type: 'info'
      });
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-700 via-red-600 to-rose-500 flex-col items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full"></div>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <img src="/logo-minsel.png" alt="Logo" className="w-48 h-auto mb-10" />
          <h1 className="text-4xl font-black text-white leading-tight">Portal Evaluasi<br />Pemerintah Digital</h1>
          <div className="mt-10 flex items-center gap-3 bg-white/10 rounded-2xl px-6 py-4">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-white/90 font-bold text-sm tracking-wide">Portal Evaluasi Pemdi v2.0</span>
          </div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic leading-none mb-3">
                PORTAL EVALUASI <span className="text-red-600">PEMDI</span>
            </h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mb-4 text-center">Pemerintah Kabupaten Minahasa Selatan</p>
            <p className="text-slate-500 font-bold mt-2">Masuk untuk mengakses Portal SPBE</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center text-sm gap-3 mb-8">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@instansi.go.id"
                  required
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-red-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-red-500 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <><span>Masuk ke Dashboard</span><ChevronRight /></>}
            </button>

            <div className="pt-6 text-center">
              <p className="text-slate-500 font-bold text-sm">
                Belum memiliki akun PIC? <Link to="/register" className="text-red-600 underline">Daftar Sekarang</Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
