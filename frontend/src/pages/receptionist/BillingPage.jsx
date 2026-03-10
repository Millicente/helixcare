import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('hx_token')}` });

const STATUS_COLORS = {
  UNPAID: { bg: '#FFFBEB', color: '#F59E0B' },
  PAID: { bg: '#F0FDF4', color: '#22C55E' },
  CANCELLED: { bg: '#FEF2F2', color: '#EF4444' },
};

export default function BillingPage() {
  const [bills, setBills] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ appointmentId: '', amount: '', description: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/billing`, { headers: getHeaders() }),
      axios.get(`${API}/receptionist/appointments`, { headers: getHeaders() }),
    ]).then(([billsRes, aptsRes]) => {
      setBills(billsRes.data.bills);
      setAppointments(aptsRes.data.appointments.filter((a) => a.status === 'COMPLETED'));
    }).finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    setError(''); setMessage('');
    if (!form.appointmentId || !form.amount) return setError('Appointment and amount are required');
    try {
      const res = await axios.post(`${API}/billing`, form, { headers: getHeaders() });
      setBills((prev) => [res.data.bill, ...prev]);
      setMessage('Bill created successfully!');
      setForm({ appointmentId: '', amount: '', description: '' });
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/billing/${id}`, { status }, { headers: getHeaders() });
      setBills((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    } catch {
      alert('Failed to update bill');
    }
  };

  if (loading) return <p style={{ color: '#94A3B8' }}>Loading billing...</p>;

  return (
    <div>
      <h2 style={styles.title}>🧾 Billing</h2>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Create New Bill</h3>
        <div style={styles.row}>
          <select style={styles.input} value={form.appointmentId}
            onChange={(e) => setForm({ ...form, appointmentId: e.target.value })}>
            <option value="">Select completed appointment...</option>
            {appointments.map((apt) => (
              <option key={apt.id} value={apt.id}>
                {apt.patient.user.name} — {apt.doctor.user.name} ({new Date(apt.scheduledAt).toLocaleDateString()})
              </option>
            ))}
          </select>
          <input style={{ ...styles.input, maxWidth: 150 }} type="number" placeholder="Amount ($)"
            value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <input style={styles.input} type="text" placeholder="Description (optional)"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button style={styles.addBtn} onClick={handleCreate}>Create Bill</button>
        </div>
      </div>

      <h3 style={styles.listTitle}>All Bills ({bills.length})</h3>
      {bills.length === 0 ? (
        <div style={styles.empty}><p>No bills yet</p></div>
      ) : (
        <div style={styles.list}>
          {bills.map((bill) => {
            const s = STATUS_COLORS[bill.status] || STATUS_COLORS.UNPAID;
            return (
              <div key={bill.id} style={styles.billCard}>
                <div style={styles.billTop}>
                  <div>
                    <p style={styles.patientName}>{bill.patient.user.name}</p>
                    <p style={styles.billDesc}>{bill.description || 'No description'}</p>
                    <p style={styles.billDate}>{new Date(bill.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={styles.amount}>${bill.amount.toFixed(2)}</p>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: s.bg, color: s.color }}>
                      {bill.status}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  {bill.status === 'UNPAID' && (
                    <>
                      <button style={styles.paidBtn} onClick={() => updateStatus(bill.id, 'PAID')}>✅ Mark Paid</button>
                      <button style={styles.cancelBtn} onClick={() => updateStatus(bill.id, 'CANCELLED')}>❌ Cancel</button>
                    </>
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
  success: { background: '#F0FDF4', color: '#22C55E', padding: '10px 14px', borderRadius: 8, marginBottom: 16 },
  error: { background: '#FEF2F2', color: '#EF4444', padding: '10px 14px', borderRadius: 8, marginBottom: 16 },
  card: { background: '#fff', borderRadius: 12, padding: 24, border: '1.5px solid #E2E8F0', marginBottom: 32 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 16 },
  row: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' },
  input: { flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, outline: 'none', minWidth: 150 },
  addBtn: { background: '#F59E0B', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' },
  listTitle: { fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 16 },
  empty: { background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center', border: '1.5px solid #E2E8F0', color: '#94A3B8' },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  billCard: { background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1.5px solid #E2E8F0' },
  billTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  patientName: { fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' },
  billDesc: { fontSize: 13, color: '#64748B', margin: '0 0 4px' },
  billDate: { fontSize: 12, color: '#94A3B8', margin: 0 },
  amount: { fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 6px' },
  paidBtn: { background: '#F0FDF4', color: '#22C55E', border: '1px solid #22C55E', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  cancelBtn: { background: '#FEF2F2', color: '#EF4444', border: '1px solid #EF4444', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
};