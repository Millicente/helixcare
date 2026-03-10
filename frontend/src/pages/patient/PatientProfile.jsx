import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('hx_token')}` });

export default function PatientProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ dateOfBirth: '', bloodType: '', allergies: '', emergencyContact: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${API}/patients/profile`, { headers: getHeaders() })
      .then((res) => {
        setProfile(res.data.patient);
        setForm({
          dateOfBirth: res.data.patient.dateOfBirth?.split('T')[0] || '',
          bloodType: res.data.patient.bloodType || '',
          allergies: res.data.patient.allergies || '',
          emergencyContact: res.data.patient.emergencyContact || '',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await axios.put(`${API}/patients/profile`, form, { headers: getHeaders() });
      setMessage('Profile updated successfully!');
    } catch {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={styles.loading}>Loading profile...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👤 My Profile</h2>
      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.card}>
        <div style={styles.field}>
          <label style={styles.label}>Date of Birth</label>
          <input style={styles.input} type="date" value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Blood Type</label>
          <select style={styles.input} value={form.bloodType}
            onChange={(e) => setForm({ ...form, bloodType: e.target.value })}>
            <option value="">Select blood type</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Allergies</label>
          <input style={styles.input} type="text" placeholder="e.g. Penicillin, Peanuts"
            value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Emergency Contact</label>
          <input style={styles.input} type="text" placeholder="e.g. +1-555-0100"
            value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} />
        </div>
        <button style={styles.button} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 600 },
  title: { fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 24 },
  message: { background: '#F0FDF4', color: '#22C55E', padding: '10px 14px', borderRadius: 8, marginBottom: 16 },
  card: { background: '#fff', borderRadius: 12, padding: 28, border: '1.5px solid #E2E8F0' },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 },
  input: { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 15, boxSizing: 'border-box', outline: 'none' },
  button: { width: '100%', padding: '12px', background: '#06B6D4', color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  loading: { color: '#94A3B8' },
};