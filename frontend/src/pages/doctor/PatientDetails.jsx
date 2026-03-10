export default function PatientDetails({ patient }) {
  if (!patient) return null;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>👤 Patient Details</h3>
      <div style={styles.card}>
        <div style={styles.row}>
          <span style={styles.label}>Name</span>
          <span style={styles.value}>{patient.user?.name}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Email</span>
          <span style={styles.value}>{patient.user?.email}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Blood Type</span>
          <span style={styles.value}>{patient.bloodType || 'Not set'}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Allergies</span>
          <span style={styles.value}>{patient.allergies || 'None recorded'}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Emergency Contact</span>
          <span style={styles.value}>{patient.emergencyContact || 'Not set'}</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { marginTop: 24 },
  title: { fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 16 },
  card: { background: '#fff', borderRadius: 12, padding: 24, border: '1.5px solid #E2E8F0' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F1F5F9' },
  label: { fontSize: 14, fontWeight: 600, color: '#64748B' },
  value: { fontSize: 14, color: '#0F172A' },
};