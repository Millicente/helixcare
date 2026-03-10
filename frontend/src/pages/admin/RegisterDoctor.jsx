import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('hx_token')}` });

export default function RegisterDoctor() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', specialization: '', licenseNumber: '', departmentId: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API}/admin/departments`, { headers: getHeaders() })
      .then((res) => setDepartments(res.data.departments));
  }, []);

  const handleSubmit = async () => {
    setError(''); setMessage('');
    if (!form.name || !form.email || !form.password || !form.specialization || !form.licenseNumber || !form.departmentId) {
      return setError('All fields are required');
    }
    setLoading(true);
    try {
      await axios.post(`${API}/admin/register-doctor`, form, { headers: getHeaders() });
      setMessage('Doctor registered successfully!');
      setForm({ name: '', email: '', password: '', specialization: '', licenseNumber: '', departmentId: '' });
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💊 Register Doctor</h2>
      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.card}>
        {[
          { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Dr. John Smith' },
          { label: 'Email', key: 'email', type: 'email', placeholder: 'dr.smith@helixcare.com' },
          { label: 'Password', key: 'password', type: 'password', placeholder: 'Min. 6 characters' },
          { label: 'Specialization', key: 'specialization', type: 'text', placeholder: 'e.g. Cardiologist' },
          { label: 'License Number', key: 'licenseNumber', type: 'text', placeholder: 'e.g. MD-2024-001' },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key} style={styles.field}>
            <label style={styles.label}>{label}</label>
            <input style={styles.input} type={type} placeholder={placeholder}
              value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </div>
        ))}
        <div style={styles.field}>
          <label style={styles.label}>Department</label>
          <select style={styles.input} value={form.departmentId}
            onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
            <option value="">Select department...</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Registering...' : 'Register Doctor'}
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
  button: { width: '100%', padding: '12px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
};