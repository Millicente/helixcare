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

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesMap, setNotesMap] = useState({});
  const [savingNotes, setSavingNotes] = useState({});

  useEffect(() => {
    axios.get(`${API}/doctors/appointments`, { headers: getHeaders() })
      .then((res) => {
        setAppointments(res.data.appointments);
        const initial = {};
        res.data.appointments.forEach((a) => { initial[a.id] = a.notes || ''; });
        setNotesMap(initial);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/doctors/appointments/${id}`, { status }, { headers: getHeaders() });
      setAppointments((prev) => prev.map((apt) => apt.id === id ? { ...apt, status } : apt));
    } catch {
      alert('Failed to update status');
    }
  };

  const saveNotes = async (id) => {
    setSavingNotes((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.put(`${API}/doctors/appointments/${id}/notes`, { notes: notesMap[id] }, { headers: getHeaders() });
      setAppointments((prev) => prev.map((apt) => apt.id === id ? { ...apt, notes: notesMap[id] } : apt));
    } catch {
      alert('Failed to save notes');
    } finally {
      setSavingNotes((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading) return <p style={{ color: '#94A3B8' }}>Loading appointments...</p>;

  return (
    <div>
      <h2 style={styles.title}>📋 My Appointments</h2>
      {appointments.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyText}>No appointments yet</p>
          <p style={styles.emptySub}>Patient appointments will appear here</p>
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
                    <p style={styles.date}>{new Date(apt.scheduledAt).toLocaleString()}</p>
                    {apt.reason && <p style={styles.reason}>💬 {apt.reason}</p>}
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: s.bg, color: s.color }}>
                    {apt.status}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  {apt.status === 'PENDING' && (
                    <>
                      <button style={styles.confirmBtn} onClick={() => updateStatus(apt.id, 'CONFIRMED')}>✅ Confirm</button>
                      <button style={styles.cancelBtn} onClick={() => updateStatus(apt.id, 'CANCELLED')}>❌ Cancel</button>
                    </>
                  )}
                  {apt.status === 'CONFIRMED' && (
                    <button style={styles.confirmBtn} onClick={() => updateStatus(apt.id, 'COMPLETED')}>✔️ Mark Complete</button>
                  )}
                </div>

                <div style={styles.notesSection}>
                  <label style={styles.notesLabel}>📝 Medical Notes</label>
                  <textarea
                    style={styles.notesInput}
                    placeholder="Write medical notes, diagnosis, prescriptions..."
                    value={notesMap[apt.id] || ''}
                    onChange={(e) => setNotesMap((prev) => ({ ...prev, [apt.id]: e.target.value }))}
                  />
                  <button style={styles.saveNotesBtn} onClick={() => saveNotes(apt.id)} disabled={savingNotes[apt.id]}>
                    {savingNotes[apt.id] ? 'Saving...' : '💾 Save Notes'}
                  </button>
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
  patientName: { fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' },
  date: { fontSize: 13, color: '#475569', margin: '0 0 4px' },
  reason: { fontSize: 13, color: '#475569', margin: 0 },
  confirmBtn: { background: '#F0FDF4', color: '#22C55E', border: '1px solid #22C55E', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  cancelBtn: { background: '#FEF2F2', color: '#EF4444', border: '1px solid #EF4444', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  notesSection: { borderTop: '1px solid #F1F5F9', paddingTop: 16 },
  notesLabel: { display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 },
  notesInput: { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, minHeight: 80, resize: 'vertical', boxSizing: 'border-box', outline: 'none', fontFamily: 'system-ui' },
  saveNotesBtn: { marginTop: 8, background: '#8B5CF6', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
};