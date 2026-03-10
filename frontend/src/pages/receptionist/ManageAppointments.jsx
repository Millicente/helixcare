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

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/receptionist/appointments`, { headers: getHeaders() })
      .then((res) => setAppointments(res.data.appointments))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/receptionist/appointments/${id}`, { status }, { headers: getHeaders() });
      setAppointments((prev) =>
        prev.map((apt) => apt.id === id ? { ...apt, status } : apt)
      );
    } catch {
      alert('Failed to update status');
    }
  };

  if (loading) return <p style={{ color: '#94A3B8' }}>Loading appointments...</p>;

  return (
    <div>
      <h2 style={styles.title}>📋 All Appointments</h2>
      {appointments.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyText}>No appointments found</p>
        </div>
      ) : (
        <div style={styles.list}>
          {appointments.map((apt) => {
            const s = STATUS_COLORS[apt.status] || STATUS_COLORS.PENDING;
            return (
              <div key={apt.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <p style={styles.patientName}>{apt.patient.user.name}</p>
                    <p style={styles.doctorName}>Dr. {apt.doctor.user.name} — {apt.doctor.specialization}</p>
                    <p style={styles.date}>{new Date(apt.scheduledAt).toLocaleString()}</p>
                    {apt.reason && <p style={styles.reason}>{apt.reason}</p>}
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: s.bg, color: s.color }}>
                    {apt.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {apt.status === 'PENDING' && (
                    <>
                      <button style={styles.confirmBtn} onClick={() => updateStatus(apt.id, 'CONFIRMED')}>
                        Confirm
                      </button>
                      <button style={styles.cancelBtn} onClick={() => updateStatus(apt.id, 'CANCELLED')}>
                        Cancel
                      </button>
                    </>
                  )}
                  {apt.status === 'CONFIRMED' && (
                    <button style={styles.cancelBtn} onClick={() => updateStatus(apt.id, 'CANCELLED')}>
                      Cancel
                    </button>
                  )}
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
  emptyText: { fontSize: 18, fontWeight: 600, color: '#0F172A', margin: 0 },
  list: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: { background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1.5px solid #E2E8F0' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  patientName: { fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' },
  doctorName: { fontSize: 13, color: '#6366F1', margin: '0 0 4px', fontWeight: 600 },
  date: { fontSize: 13, color: '#475569', margin: '0 0 4px' },
  reason: { fontSize: 13, color: '#475569', margin: 0 },
  confirmBtn: { background: '#F0FDF4', color: '#22C55E', border: '1px solid #22C55E', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  cancelBtn: { background: '#FEF2F2', color: '#EF4444', border: '1px solid #EF4444', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
};