import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('hx_token')}` });

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctorId: '', scheduledAt: '', reason: '' });
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API}/doctors`, { headers: getHeaders() })
      .then((res) => setDoctors(res.data.doctors))
      .finally(() => setLoading(false));
  }, []);

  const handleBook = async () => {
    setError(''); setMessage('');
    if (!form.doctorId || !form.scheduledAt) return setError('Please select a doctor and date');
    setBooking(true);
    try {
      await axios.post(`${API}/patients/appointments`, form, { headers: getHeaders() });
      setMessage('Appointment booked successfully!');
      setForm({ doctorId: '', scheduledAt: '', reason: '' });
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <p style={{ color: '#94A3B8' }}>Loading doctors...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📅 Book Appointment</h2>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.card}>
        <div style={styles.field}>
          <label style={styles.label}>Select Doctor</label>
          <select style={styles.input} value={form.doctorId}
            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>
            <option value="">Choose a doctor...</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.user.name} — {doc.specialization} ({doc.department?.name})
              </option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Date & Time</label>
          <input style={styles.input} type="datetime-local" value={form.scheduledAt}
            onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Reason for visit (optional)</label>
          <textarea style={{ ...styles.input, height: 80, resize: 'vertical' }}
            placeholder="Describe your symptoms or reason..."
            value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
        </div>

        <button style={styles.button} onClick={handleBook} disabled={booking}>
          {booking ? 'Booking...' : 'Book Appointment'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 600 },
  title: { fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 24 },
  success: { background: '#F0FDF4', color: '#22C55E', padding: '10px 14px', borderRadius: 8, marginBottom: 16 },
  error: { background: '#FEF2F2', color: '#EF4444', padding: '10px 14px', borderRadius: 8, marginBottom: 16 },
  card: { background: '#fff', borderRadius: 12, padding: 28, border: '1.5px solid #E2E8F0' },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 },
  input: { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 15, boxSizing: 'border-box', outline: 'none' },
  button: { width: '100%', padding: '12px', background: '#06B6D4', color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
};