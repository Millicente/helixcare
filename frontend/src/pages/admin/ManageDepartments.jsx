import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('hx_token')}` });

const CATEGORIES = {
  'Clinical & Medical': ['Emergency Department (ED)', 'Intensive Care Unit (ICU)', 'Operating Theatre (OT)', 'Cardiology', 'Pediatrics', 'Obstetrics and Gynecology (OB-GYN)', 'Neurology', 'Orthopedics', 'Oncology', 'Gastroenterology', 'ENT (Ear, Nose, and Throat)'],
  'Diagnostic & Support': ['Radiology/Imaging', 'Pathology/Laboratory', 'Pharmacy', 'Rehabilitation Services'],
  'Administrative & Operational': ['Outpatient Department (OPD)', 'Medical Records (HIM)', 'Human Resources (HR)', 'Billing & Finance'],
};

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API}/admin/departments`, { headers: getHeaders() })
      .then((res) => setDepartments(res.data.departments))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    setError(''); setMessage('');
    if (!name) return setError('Department name is required');
    setSaving(true);
    try {
      const res = await axios.post(`${API}/admin/departments`, { name, description }, { headers: getHeaders() });
      setDepartments((prev) => [...prev, res.data.department]);
      setMessage('Department created!');
      setName(''); setDescription('');
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, deptName) => {
    if (!window.confirm(`Delete "${deptName}"?`)) return;
    try {
      await axios.delete(`${API}/admin/departments/${id}`, { headers: getHeaders() });
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch {
      alert('Failed to delete department');
    }
  };

  const getCategory = (deptName) => {
    for (const [cat, names] of Object.entries(CATEGORIES)) {
      if (names.some((n) => deptName.includes(n.split(' ')[0]))) return cat;
    }
    return 'Other';
  };

  if (loading) return <p style={{ color: '#94A3B8' }}>Loading departments...</p>;

  const grouped = departments.reduce((acc, d) => {
    const cat = getCategory(d.name);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(d);
    return acc;
  }, {});

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏥 Manage Departments</h2>
      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Add New Department</h3>
        <div style={styles.row}>
          <input style={styles.input} type="text" placeholder="Department name"
            value={name} onChange={(e) => setName(e.target.value)} />
          <input style={styles.input} type="text" placeholder="Description (optional)"
            value={description} onChange={(e) => setDescription(e.target.value)} />
          <button style={styles.addBtn} onClick={handleCreate} disabled={saving}>
            {saving ? 'Adding...' : '+ Add'}
          </button>
        </div>
      </div>

      {Object.entries(grouped).map(([category, depts]) => (
        <div key={category} style={styles.section}>
          <h3 style={styles.categoryTitle}>{category}</h3>
          <div style={styles.list}>
            {depts.map((d) => (
              <div key={d.id} style={styles.deptCard}>
                <div>
                  <p style={styles.deptName}>🏥 {d.name}</p>
                  {d.description && <p style={styles.deptDesc}>{d.description}</p>}
                </div>
                <button style={styles.deleteBtn} onClick={() => handleDelete(d.id, d.name)}>
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { maxWidth: 800 },
  title: { fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 24 },
  success: { background: '#F0FDF4', color: '#22C55E', padding: '10px 14px', borderRadius: 8, marginBottom: 16 },
  error: { background: '#FEF2F2', color: '#EF4444', padding: '10px 14px', borderRadius: 8, marginBottom: 16 },
  card: { background: '#fff', borderRadius: 12, padding: 24, border: '1.5px solid #E2E8F0', marginBottom: 32 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 16 },
  row: { display: 'flex', gap: 12, alignItems: 'center' },
  input: { flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, outline: 'none' },
  addBtn: { background: '#EF4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' },
  section: { marginBottom: 28 },
  categoryTitle: { fontSize: 15, fontWeight: 700, color: '#475569', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #E2E8F0' },
  list: { display: 'flex', flexDirection: 'column', gap: 8 },
  deptCard: { background: '#fff', borderRadius: 10, padding: '14px 20px', border: '1.5px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  deptName: { fontSize: 14, fontWeight: 600, color: '#0F172A', margin: '0 0 2px' },
  deptDesc: { fontSize: 12, color: '#94A3B8', margin: 0 },
  deleteBtn: { background: '#FEF2F2', border: '1px solid #EF4444', color: '#EF4444', padding: '5px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
};