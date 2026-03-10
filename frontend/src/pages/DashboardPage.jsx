import { useAuth } from '../context/AuthContext';

const ROLE_CONFIG = {
  PATIENT: {
    color: '#06B6D4',
    bg: '#ECFEFF',
    icon: '🤒',
    label: 'Patient Portal',
    features: ['Book an appointment', 'View medical records', 'Upcoming visits', 'Billing history'],
  },
  DOCTOR: {
    color: '#8B5CF6',
    bg: '#F5F3FF',
    icon: '🧑‍⚕️',
    label: 'Doctor Dashboard',
    features: ["Today's appointments", 'Patient records', 'Write medical notes', 'Manage availability'],
  },
  RECEPTIONIST: {
    color: '#F59E0B',
    bg: '#FFFBEB',
    icon: '🧑‍💼',
    label: 'Reception Desk',
    features: ['Book appointments', 'Patient check-in/out', 'Generate invoices', 'Appointment queue'],
  },
  ADMIN: {
    color: '#EF4444',
    bg: '#FEF2F2',
    icon: '🔧',
    label: 'Admin Control',
    features: ['Manage all users', 'Department settings', 'Register doctors', 'System analytics'],
  },
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const config = ROLE_CONFIG[user.role];

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.navLogo}>🧬 HelixCare</h1>
        <div style={styles.navRight}>
          <span style={styles.navName}>{user.name}</span>
          <span style={{ ...styles.roleBadge, background: config.color }}>
            {user.role}
          </span>
          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div style={styles.content}>
        {/* Welcome banner */}
        <div style={{ ...styles.banner, background: config.bg, border: `2px solid ${config.color}30` }}>
          <span style={styles.bannerIcon}>{config.icon}</span>
          <div>
            <h2 style={styles.bannerTitle}>
              Welcome, {user.name.split(' ')[0]}!
            </h2>
            <p style={styles.bannerSubtitle}>{config.label}</p>
          </div>
        </div>

        {/* Feature cards */}
        <h3 style={styles.sectionTitle}>Available Features</h3>
        <div style={styles.grid}>
          {config.features.map((feature) => (
            <div key={feature} style={styles.card}>
              <div style={{ ...styles.cardIcon, background: config.bg }}>
                🔒
              </div>
              <p style={styles.cardTitle}>{feature}</p>
              <p style={styles.cardSub}>Coming soon</p>
            </div>
          ))}
        </div>

        {/* Phase info */}
        <div style={styles.phaseBox}>
          <p style={styles.phaseTitle}>🚧 Phase 1 Complete!</p>
          <p style={styles.phaseText}>
            You're logged in as <strong>{user.role}</strong> and reached the correct dashboard. Phase 2 features coming next!
          </p>
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
  navLogo: { color: '#fff', fontSize: 20, fontWeight: 700 },
  navRight: { display: 'flex', alignItems: 'center', gap: 12 },
  navName: { color: '#F1F5F9', fontSize: 14 },
  roleBadge: {
    color: '#fff', padding: '4px 12px', borderRadius: 20,
    fontSize: 12, fontWeight: 700,
  },
  logoutBtn: {
    background: 'transparent', border: '1px solid #334155',
    color: '#94A3B8', padding: '6px 14px', borderRadius: 8,
    cursor: 'pointer', fontSize: 13,
  },
  content: { maxWidth: 960, margin: '0 auto', padding: '40px 24px' },
  banner: {
    borderRadius: 16, padding: '28px 32px', marginBottom: 32,
    display: 'flex', alignItems: 'center', gap: 20,
  },
  bannerIcon: { fontSize: 48 },
  bannerTitle: { fontSize: 26, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' },
  bannerSubtitle: { color: '#64748B', margin: 0 },
  sectionTitle: { fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 16 },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 16, marginBottom: 32,
  },
  card: {
    background: '#fff', border: '1.5px solid #E2E8F0',
    borderRadius: 12, padding: '20px 18px',
  },
  cardIcon: {
    width: 36, height: 36, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 10, fontSize: 18,
  },
  cardTitle: { fontSize: 14, fontWeight: 600, color: '#0F172A', margin: '0 0 4px' },
  cardSub: { fontSize: 12, color: '#94A3B8', margin: 0 },
  phaseBox: {
    background: '#0F172A', borderRadius: 14, padding: '24px 28px',
  },
  phaseTitle: { color: '#5EEAD4', fontWeight: 700, fontSize: 15, margin: '0 0 8px' },
  phaseText: { color: '#94A3B8', fontSize: 14, margin: 0, lineHeight: 1.6 },
};