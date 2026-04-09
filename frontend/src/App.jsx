/* eslint-disable */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';

// Import Dashboard Pages
import DashboardOverview from './pages/DashboardOverview';
import DashboardPimpinan from './pages/DashboardPimpinan';
import EvaluasiMandiri from './pages/EvaluasiMandiri';
import RiwayatPenilaian from './pages/RiwayatPenilaian';
import ProfileManagement from './pages/ProfileManagement';
import UserManagement from './pages/UserManagement';
import OpdManagement from './pages/OpdManagement';
import ManajemenIndikator from './pages/ManajemenIndikator';
import ManajemenAspek from './pages/ManajemenAspek';
import ManajemenPeriode from './pages/ManajemenPeriode';

// Missing Missing Pages
import VerifikasiOPD from './pages/VerifikasiOPD';
import CatatanPerbaikan from './pages/CatatanPerbaikan';
import PenilaianInterviu from './pages/PenilaianInterviu';
import BeritaAcara from './pages/BeritaAcara';
import MonitoringProgres from './pages/MonitoringProgres';
import RankingKlasemen from './pages/RankingKlasemen';
import RekapNilai from './pages/RekapNilai';
import ExportData from './pages/ExportData';
import SmtpSettings from './pages/SmtpSettings';
import BackupDatabase from './pages/BackupDatabase';
import LogAktivitas from './pages/LogAktivitas';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const VersionTag = () => (
    <div className="fixed bottom-2 right-2 text-[8px] font-black text-slate-300 bg-white/50 px-2 py-1 rounded-full z-[9999] pointer-events-none uppercase tracking-widest">
      Build Portal SPBE Pemkab Minsel ({new Date().toISOString()})
    </div>
);

function App() {
  const { isAuthenticated, user } = useAuthStore();

  const getDashboardHome = () => {
    if (user?.role === 1 || user?.role === 5) return <DashboardPimpinan />;
    return <DashboardOverview />;
  };

  return (
    <Router>
      <Toaster position="top-right" />
      <VersionTag />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
            <Route index element={getDashboardHome()} />
            <Route path="evaluasi" element={<EvaluasiMandiri />} />
            <Route path="riwayat" element={<RiwayatPenilaian />} />
            <Route path="profil" element={<ProfileManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="opd" element={<OpdManagement />} />
            <Route path="indikator" element={<ManajemenIndikator />} />
            <Route path="aspek" element={<ManajemenAspek />} />
            <Route path="periode" element={<ManajemenPeriode />} />
            
            {/* Added Missing Routes */}
            <Route path="verifikasi" element={<VerifikasiOPD />} />
            <Route path="catatan" element={<CatatanPerbaikan />} />
            <Route path="penilaian-interviu" element={<PenilaianInterviu />} />
            <Route path="berita-acara" element={<BeritaAcara />} />
            <Route path="monitoring" element={<MonitoringProgres />} />
            <Route path="ranking" element={<RankingKlasemen />} />
            <Route path="rekap-nilai" element={<RekapNilai />} />
            <Route path="export" element={<ExportData />} />
            <Route path="smtp" element={<SmtpSettings />} />
            <Route path="logs" element={<BackupDatabase />} />
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
