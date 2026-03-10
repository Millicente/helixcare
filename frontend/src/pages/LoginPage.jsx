import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onSwitch }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) return setError('Please fill in all fields');
    setLoading(true);
    try {
      await login(email, password);
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
        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && <p style={styles.error}>{error}</p>}

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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p style={styles.switchText}>
          Don't have an account?{' '}
          <span style={styles.link} onClick={onSwitch}>
            Register
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
    boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
  },
  logo: {
    textAlign: 'center',
    fontSize: 28,
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 700,
    color: '#0F172A',
    margin: '0 0 6px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 24,
  },
  error: {
    background: '#FEF2F2',
    color: '#EF4444',
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 8,
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
    borderRadius: 8,
    fontSize: 15,
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