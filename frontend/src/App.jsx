import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function AppContent() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('login');

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0F172A',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <p style={{ color: '#94A3B8', fontSize: 18 }}>🧬 Loading HelixCare...</p>
      </div>
    );
  }

  if (user) {
    if (user.role === 'PATIENT') return <PatientDashboard />;
    if (user.role === 'DOCTOR') return <DoctorDashboard />;
    if (user.role === 'RECEPTIONIST') return <ReceptionistDashboard />;
    if (user.role === 'ADMIN') return <AdminDashboard />;
  }

  if (page === 'login') return <LoginPage onSwitch={() => setPage('register')} />;
  return <RegisterPage onSwitch={() => setPage('login')} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}