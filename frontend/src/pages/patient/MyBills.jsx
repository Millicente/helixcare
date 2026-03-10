import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('hx_token')}` });

const STATUS_COLORS = {
  UNPAID: { bg: '#FFFBEB', color: '#F59E0B' },
  PAID: { bg: '#F0FDF4', color: '#22C55E' },
  CANCELLED: { bg: '#FEF2F2', color: '#EF4444' },
};

export default function MyBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/billing/patient`, { headers: getHeaders() })
      .then((res) => setBills(res.data.bills))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: '#94A3B8' }}>Loading bills...</p>;

  return (
    <div>
      <h2 style={styles.title}>🧾 My Bills</h2>
      {bills.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyText}>No bills yet</p>
          <p style={styles.emptySub}>Your billing history will appear here</p>
        </div>
      ) : (
        <div style={styles.list}>
          {bills.map((bill) => {
            const s = STATUS_COLORS[bill.status] || STATUS_COLORS.UNPAID;
            return (
              <div key={bill.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <p style={styles.doctorName}>{bill.appointment.doctor.user.name}</p>
                    <p style={styles.desc}>{bill.description || 'Medical consultation'}</p>
                    <p style={styles.date}>{new Date(bill.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={styles.amount}>${bill.amount.toFixed(2)}</p>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: s.bg, color: s.color }}>
                      {bill.status}
                    </span>
                  </div>
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
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: { background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1.5px solid #E2E8F0' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  doctorName: { fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' },
  desc: { fontSize: 13, color: '#64748B', margin: '0 0 4px' },
  date: { fontSize: 12, color: '#94A3B8', margin: 0 },
  amount: { fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 6px' },
};