import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import OpdManagement from './pages/OpdManagement';
import ManajemenIndikator from './pages/ManajemenIndikator';
import ManajemenAspek from './pages/ManajemenAspek';
import ManajemenPeriode from './pages/ManajemenPeriode';
import ProfileManagement from './pages/ProfileManagement';
import EvaluasiMandiri from './pages/EvaluasiMandiri';
import VerifikasiOPD from './pages/VerifikasiOPD';
import MonitoringProgres from './pages/MonitoringProgres';
import RankingKlasemen from './pages/RankingKlasemen';
import ExportData from './pages/ExportData';
import LogActivity from './pages/LogActivity';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} 
        />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="opd" element={<OpdManagement />} />
                <Route path="indikator" element={<ManajemenIndikator />} />
                <Route path="aspek" element={<ManajemenAspek />} />
                <Route path="periode" element={<ManajemenPeriode />} />
                <Route path="profil" element={<ProfileManagement />} />
                <Route path="evaluasi" element={<EvaluasiMandiri />} />
                <Route path="verifikasi" element={<VerifikasiOPD />} />
                <Route path="monitoring" element={<MonitoringProgres />} />
                <Route path="ranking" element={<RankingKlasemen />} />
                <Route path="export" element={<ExportData />} />
                <Route path="logs" element={<LogActivity />} />
              </Routes>
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
