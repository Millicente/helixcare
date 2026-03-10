import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage({ onSwitch }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    if (!name || !email || !password) return setError('Please fill in all fields');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>🧬 HelixCare</h1>
        <h2 style={styles.title}>Create account</h2>
        <p style={styles.subtitle}>Register as a patient</p>

        {error && <p style={styles.error}>{error}</p>}

        <input
          style={styles.input}
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          style={styles.input}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password (min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          style={styles.button}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <span style={styles.link} onClick={onSwitch}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0F172A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: 40,
    width: '100%',
    maxWidth: 420,
    boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
  },
  logo: {
    textAlign: 'center',
    fontSize: 28,
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    color: '#94A3B8',
    marginBottom: 24,
  },
  error: {
    background: '#FEF2F2',
    color: '#EF4444',
    padding: '10px 14px',
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1.5px solid #E2E8F0',
    fontSize: 15,
    marginBottom: 14,
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#06B6D4',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    marginBottom: 16,
  },
  switchText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 14,
  },
  link: {
    color: '#06B6D4',
    fontWeight: 600,
    cursor: 'pointer',
  },
};