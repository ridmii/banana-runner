import { useState, useEffect, useMemo } from 'react';
import { register, googleAuth, githubAuth } from '../../services/authService.js';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { initializeGoogle } from '../../utils/googleAuth.js';

const GITHUB_CLIENT_ID = 'Ov23li43RWAmu8LwuoqE';

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const [searchParams] = useSearchParams();

  // Handle GitHub OAuth callback
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleGithubCallback(code);
      // Clear the code from URL to prevent reuse
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams]);

  // Load Google Sign-In script (global singleton)
  useEffect(() => {
    initializeGoogle(handleGoogleSignIn);
  }, []);

  const handleGoogleSignIn = async (response) => {
    setLoading(true);
    setError('');
    try {
      const data = await googleAuth(response.credential);
      setUser(data.user);
      // Small delay to ensure cookie is set before navigation
      setTimeout(() => navigate('/'), 100);
    } catch (err) {
      console.error('Google sign-up error:', err);
      setError(err.response?.data?.message || 'Google sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubRegister = () => {
    const redirectUri = `${window.location.origin}/register`;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
    window.location.href = githubAuthUrl;
  };

  const handleGithubCallback = async (code) => {
    setLoading(true);
    setError('');
    try {
      const data = await githubAuth(code);
      setUser(data.user);
      // Small delay to ensure cookie is set before navigation
      setTimeout(() => navigate('/'), 100);
    } catch (err) {
      console.error('GitHub callback error:', err);
      setError(err.response?.data?.message || 'GitHub sign-up failed');
    } finally {
      setLoading(false);
    }
  };

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

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h2>Create Account</h2>
        
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>Sign up with</div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              id="google-signup-btn"
              onClick={(e) => {
                e.preventDefault();
                if (window.google?.accounts?.id) {
                  window.google.accounts.id.renderButton(
                    document.getElementById('google-signup-btn'),
                    { theme: 'outline', size: 'large', width: '200' }
                  );
                }
              }}
              style={{
                padding: '10px 16px',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f8f8'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleGithubRegister();
              }}
              style={{
                padding: '10px 16px',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f8f8'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="#333"/>
              </svg>
              GitHub
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '12px', color: '#999' }}>
          ─ OR ─
        </div>

        <form onSubmit={onSubmit} className="form">
          <input 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Username (min. 3 characters)" 
            required
            disabled={loading}
          />
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            type="email"
            required
            disabled={loading}
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required
            disabled={loading}
          />
          <PasswordStrength password={password} />
          <button className="btn primary" type="submit" disabled={!allPassed || username.trim().length < 3 || loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
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
