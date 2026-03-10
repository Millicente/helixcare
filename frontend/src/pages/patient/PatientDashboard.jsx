import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import MyAppointments from './MyAppointments';
import BookAppointment from './BookAppointment';
import PatientProfile from './PatientProfile';
import MyBills from './MyBills';

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState('home');

  const renderPage = () => {
    switch (activePage) {
      case 'appointments': return <MyAppointments />;
      case 'book': return <BookAppointment />;
      case 'profile': return <PatientProfile />;
      case 'bills': return <MyBills />;
      default: return <Home user={user} setActivePage={setActivePage} />;
    }
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>🧬 HelixCare</h1>
        <div style={styles.navLinks}>
          <button style={activePage === 'home' ? styles.navLinkActive : styles.navLink} onClick={() => setActivePage('home')}>Home</button>
          <button style={activePage === 'book' ? styles.navLinkActive : styles.navLink} onClick={() => setActivePage('book')}>Book Appointment</button>
          <button style={activePage === 'appointments' ? styles.navLinkActive : styles.navLink} onClick={() => setActivePage('appointments')}>My Appointments</button>
          <button style={activePage === 'bills' ? styles.navLinkActive : styles.navLink} onClick={() => setActivePage('bills')}>My Bills</button>
          <button style={activePage === 'profile' ? styles.navLinkActive : styles.navLink} onClick={() => setActivePage('profile')}>Profile</button>
        </div>
        <div style={styles.navRight}>
          <span style={styles.navName}>{user.name}</span>
          <span style={styles.badge}>PATIENT</span>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        {renderPage()}
      </div>
    </div>
  );
}

function Home({ user, setActivePage }) {
  return (
    <div>
      <div style={styles.banner}>
        <span style={{ fontSize: 48 }}>🤒</span>
        <div>
          <h2 style={styles.bannerTitle}>Welcome, {user.name.split(' ')[0]}!</h2>
          <p style={styles.bannerSub}>Patient Portal — What would you like to do today?</p>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.card} onClick={() => setActivePage('book')}>
          <span style={styles.cardIcon}>📅</span>
          <h3 style={styles.cardTitle}>Book Appointment</h3>
          <p style={styles.cardSub}>Schedule a visit with a doctor</p>
        </div>
        <div style={styles.card} onClick={() => setActivePage('appointments')}>
          <span style={styles.cardIcon}>📋</span>
          <h3 style={styles.cardTitle}>My Appointments</h3>
          <p style={styles.cardSub}>View upcoming and past visits</p>
        </div>
        <div style={styles.card} onClick={() => setActivePage('bills')}>
          <span style={styles.cardIcon}>🧾</span>
          <h3 style={styles.cardTitle}>My Bills</h3>
          <p style={styles.cardSub}>View your billing history</p>
        </div>
        <div style={styles.card} onClick={() => setActivePage('profile')}>
          <span style={styles.cardIcon}>👤</span>
          <h3 style={styles.cardTitle}>My Profile</h3>
          <p style={styles.cardSub}>Update your medical information</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#F8FAFC', fontFamily: 'system-ui' },
  navbar: {
    background: '#0F172A', padding: '0 32px', height: 64,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: { color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 },
  navLinks: { display: 'flex', gap: 8 },
  navLink: {
    background: 'transparent', border: 'none', color: '#94A3B8',
    padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 14,
  },
  navLinkActive: {
    background: '#1E293B', border: 'none', color: '#06B6D4',
    padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600,
  },
  navRight: { display: 'flex', alignItems: 'center', gap: 12 },
  navName: { color: '#F1F5F9', fontSize: 14 },
  badge: {
    background: '#06B6D4', color: '#fff', padding: '4px 12px',
    borderRadius: 20, fontSize: 12, fontWeight: 700,
  },
  logoutBtn: {
    background: 'transparent', border: '1px solid #334155',
    color: '#94A3B8', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
  },
  content: { maxWidth: 1000, margin: '0 auto', padding: '40px 24px' },
  banner: {
    background: '#ECFEFF', border: '2px solid #06B6D430', borderRadius: 16,
    padding: '28px 32px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 20,
  },
  bannerTitle: { fontSize: 26, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' },
  bannerSub: { color: '#64748B', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 },
  card: {
    background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 12,
    padding: '24px 20px', cursor: 'pointer', transition: 'all 0.2s',
  },
  cardIcon: { fontSize: 32, display: 'block', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 6px' },
  cardSub: { fontSize: 13, color: '#94A3B8', margin: 0 },
};