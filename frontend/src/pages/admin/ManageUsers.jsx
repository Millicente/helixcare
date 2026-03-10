import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('hx_token')}` });

const ROLE_COLORS = {
  PATIENT: { bg: '#ECFEFF', color: '#06B6D4' },
  DOCTOR: { bg: '#F5F3FF', color: '#8B5CF6' },
  RECEPTIONIST: { bg: '#FFFBEB', color: '#F59E0B' },
  ADMIN: { bg: '#FEF2F2', color: '#EF4444' },
};

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/admin/users`, { headers: getHeaders() })
      .then((res) => setUsers(res.data.users))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await axios.delete(`${API}/admin/users/${id}`, { headers: getHeaders() });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert('Failed to delete user');
    }
  };

  if (loading) return <p style={{ color: '#94A3B8' }}>Loading users...</p>;

  return (
    <div>
      <h2 style={styles.title}>👥 All Users ({users.length})</h2>
      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Joined</span>
          <span>Action</span>
        </div>
        {users.map((u) => {
          const r = ROLE_COLORS[u.role] || ROLE_COLORS.PATIENT;
          return (
            <div key={u.id} style={styles.tableRow}>
              <span style={styles.name}>{u.name}</span>
              <span style={styles.email}>{u.email}</span>
              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: r.bg, color: r.color }}>
                {u.role}
              </span>
              <span style={styles.date}>{new Date(u.createdAt).toLocaleDateString()}</span>
              {u.role !== 'ADMIN' ? (
                <button style={styles.deleteBtn} onClick={() => handleDelete(u.id, u.name)}>
                  🗑️ Delete
                </button>
              ) : (
                <span style={styles.protected}>Protected</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  title: { fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 24 },
  table: { background: '#fff', borderRadius: 12, border: '1.5px solid #E2E8F0', overflow: 'hidden' },
  tableHeader: {
    display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr',
    padding: '12px 24px', background: '#F8FAFC',
    fontSize: 13, fontWeight: 700, color: '#64748B',
    borderBottom: '1.5px solid #E2E8F0',
  },
  tableRow: {
    display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr',
    padding: '14px 24px', borderBottom: '1px solid #F1F5F9',
    alignItems: 'center',
  },
  name: { fontSize: 14, fontWeight: 600, color: '#0F172A' },
  email: { fontSize: 13, color: '#64748B' },
  date: { fontSize: 13, color: '#94A3B8' },
  deleteBtn: { background: '#FEF2F2', color: '#EF4444', border: '1px solid #EF4444', padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  protected: { fontSize: 12, color: '#94A3B8', fontStyle: 'italic' },
};