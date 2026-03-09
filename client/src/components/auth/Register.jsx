import { useState, useMemo } from 'react';
import { register } from '../../services/authService.js';
import { useNavigate } from 'react-router-dom';

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
  { label: 'One number (0-9)', test: (p) => /[0-9]/.test(p) },
  { label: 'One special character (!@#$%...)', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

function PasswordStrength({ password }) {
  const results = useMemo(() => PASSWORD_RULES.map((r) => ({ ...r, passed: r.test(password) })), [password]);
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const pct = Math.round((passed / total) * 100);
  const strength = passed <= 1 ? 'Weak' : passed <= 3 ? 'Fair' : passed === 4 ? 'Good' : 'Strong';
  const color = passed <= 1 ? '#ff4444' : passed <= 3 ? '#ffaa00' : passed === 4 ? '#44bb44' : '#00dd66';

  if (!password) return null;

  return (
    <div className="password-strength">
      <div className="strength-bar-track">
        <div className="strength-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="strength-label" style={{ color }}>{strength}</span>
      <ul className="strength-rules">
        {results.map((r, i) => (
          <li key={i} className={r.passed ? 'rule-pass' : 'rule-fail'}>
            <span className="rule-icon">{r.passed ? '✓' : '✗'}</span> {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [serverErrors, setServerErrors] = useState([]);
  const navigate = useNavigate();

  const allPassed = useMemo(() => PASSWORD_RULES.every((r) => r.test(password)), [password]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setServerErrors([]);

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (!allPassed) {
      setError('Please meet all password requirements below');
      return;
    }

    try {
      await register({ username: username.trim(), email, password });
      navigate('/login');
    } catch (err) {
      const data = err?.response?.data;
      if (data?.passwordErrors) {
        setServerErrors(data.passwordErrors);
        setError(data.message || 'Password is too weak');
      } else {
        setError(data?.message || 'Registration failed');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h2>Create Account</h2>
        <form onSubmit={onSubmit} className="form">
          <input 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Username (min. 3 characters)" 
            required
          />
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            type="email"
            required
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required
          />
          <PasswordStrength password={password} />
          <button className="btn primary" type="submit" disabled={!allPassed || username.trim().length < 3}>Create Account</button>
        </form>
        <div className="muted" style={{ textAlign: 'center', marginTop: '16px' }}>
          Already have an account? <a href="/login" style={{ color: 'var(--primary)' }}>Sign in here</a>
        </div>
        {error && <p className="error" style={{ textAlign: 'center', marginTop: '12px' }}>{error}</p>}
        {serverErrors.length > 0 && (
          <ul className="strength-rules" style={{ marginTop: '8px' }}>
            {serverErrors.map((e, i) => <li key={i} className="rule-fail"><span className="rule-icon">✗</span> {e}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
