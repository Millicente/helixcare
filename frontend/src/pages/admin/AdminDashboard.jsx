import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ManageUsers from './ManageUsers';
import RegisterDoctor from './RegisterDoctor';
import ManageDepartments from './ManageDepartments';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState('home');

  const renderPage = () => {
    switch (activePage) {
      case 'users': return <ManageUsers />;
      case 'register-doctor': return <RegisterDoctor />;
      case 'departments': return <ManageDepartments />;
      default: return <Home user={user} setActivePage={setActivePage} />;
    }
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>🧬 HelixCare</h1>
        <div style={styles.navLinks}>
          {[
            { key: 'home', label: 'Home' },
            { key: 'users', label: 'Manage Users' },
            { key: 'departments', label: 'Departments' },
            { key: 'register-doctor', label: 'Register Doctor' },
          ].map(({ key, label }) => (
            <button key={key}
              style={activePage === key ? styles.navLinkActive : styles.navLink}
              onClick={() => setActivePage(key)}>{label}</button>
          ))}
        </div>
        <div style={styles.navRight}>
          <span style={styles.navName}>{user.name}</span>
          <span style={styles.badge}>ADMIN</span>
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
        <span style={{ fontSize: 48 }}>🔧</span>
        <div>
          <h2 style={styles.bannerTitle}>Welcome, {user.name.split(' ')[0]}!</h2>
          <p style={styles.bannerSub}>Admin Control — Manage the entire HelixCare system</p>
        </div>
      </div>

      <div style={styles.grid}>
        {[
          { key: 'users', icon: '👥', title: 'Manage Users', sub: 'View and manage all system users' },
          { key: 'departments', icon: '🏥', title: 'Departments', sub: 'Create and manage departments' },
          { key: 'register-doctor', icon: '💊', title: 'Register Doctor', sub: 'Add a new doctor to the system' },
        ].map(({ key, icon, title, sub }) => (
          <div key={key} style={styles.card} onClick={() => setActivePage(key)}>
            <span style={styles.cardIcon}>{icon}</span>
            <h3 style={styles.cardTitle}>{title}</h3>
            <p style={styles.cardSub}>{sub}</p>
          </div>
        ))}
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
  navLink: { background: 'transparent', border: 'none', color: '#94A3B8', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  navLinkActive: { background: '#1E293B', border: 'none', color: '#EF4444', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  navRight: { display: 'flex', alignItems: 'center', gap: 12 },
  navName: { color: '#F1F5F9', fontSize: 14 },
  badge: { background: '#EF4444', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 },
  logoutBtn: { background: 'transparent', border: '1px solid #334155', color: '#94A3B8', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 },
  content: { maxWidth: 1000, margin: '0 auto', padding: '40px 24px' },
  banner: { background: '#FEF2F2', border: '2px solid #EF444430', borderRadius: 16, padding: '28px 32px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 20 },
  bannerTitle: { fontSize: 26, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' },
  bannerSub: { color: '#64748B', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 },
  card: { background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '24px 20px', cursor: 'pointer' },
  cardIcon: { fontSize: 32, display: 'block', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 6px' },
  cardSub: { fontSize: 13, color: '#94A3B8', margin: 0 },
};