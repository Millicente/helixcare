import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('hx_token')}` });

const STATUS_COLORS = {
  PENDING: { bg: '#FFFBEB', color: '#F59E0B' },
  CONFIRMED: { bg: '#F0FDF4', color: '#22C55E' },
  COMPLETED: { bg: '#EFF6FF', color: '#3B82F6' },
  CANCELLED: { bg: '#FEF2F2', color: '#EF4444' },
};

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/patients/appointments`, { headers: getHeaders() })
      .then((res) => setAppointments(res.data.appointments))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: '#94A3B8' }}>Loading appointments...</p>;

  return (
    <div>
      <h2 style={styles.title}>📋 My Appointments</h2>

      {appointments.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyText}>No appointments yet</p>
          <p style={styles.emptySub}>Book your first appointment with a doctor!</p>
        </div>
      ) : (
        <div style={styles.list}>
          {appointments.map((apt) => {
            const statusStyle = STATUS_COLORS[apt.status] || STATUS_COLORS.PENDING;
            return (
              <div key={apt.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <p style={styles.doctorName}>{apt.doctor.user.name}</p>
                    <p style={styles.specialty}>{apt.doctor.specialization} — {apt.doctor.department?.name}</p>
                  </div>
                  <span style={{ ...styles.statusBadge, background: statusStyle.bg, color: statusStyle.color }}>
                    {apt.status}
                  </span>
                </div>
                <div style={styles.cardBottom}>
                  <span style={styles.date}>
                    📅 {new Date(apt.scheduledAt).toLocaleString()}
                  </span>
                  {apt.reason && <span style={styles.reason}>💬 {apt.reason}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  title: { fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 24 },
  empty: { background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center', border: '1.5px solid #E2E8F0' },
  emptyText: { fontSize: 18, fontWeight: 600, color: '#0F172A', margin: '0 0 8px' },
  emptySub: { color: '#94A3B8', margin: 0 },
  list: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: { background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1.5px solid #E2E8F0' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  doctorName: { fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' },
  specialty: { fontSize: 13, color: '#64748B', margin: 0 },
  statusBadge: { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 },
  cardBottom: { display: 'flex', gap: 16 },
  date: { fontSize: 13, color: '#475569' },
  reason: { fontSize: 13, color: '#475569' },
};