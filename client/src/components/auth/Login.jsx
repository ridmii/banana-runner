import { useEffect, useState } from 'react';
import { login } from '../../services/authService.js';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle OAuth redirect
  useEffect(() => {
    const oauthSuccess = searchParams.get('oauth_success');
    const userParam = searchParams.get('user');
    
    if (oauthSuccess && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        setUser(userData);
        localStorage.setItem('authUser', JSON.stringify(userData));
        navigate('/');
      } catch (e) {
        setError('OAuth success but failed to parse user data. Try logging in again.');
      }
    }
    
    const oauthError = searchParams.get('error');
    if (oauthError) {
      setError(`OAuth login failed: ${oauthError}`);
    }
  }, [searchParams, setUser, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      try { localStorage.setItem('authUser', JSON.stringify(data.user)); } catch {}
      navigate('/');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthGoogle = () => {
    const backendUrl = window.location.origin.includes('localhost:517') 
      ? 'http://localhost:5000'
      : window.location.origin;
    window.location.href = `${backendUrl}/api/auth/oauth/google`;
  };

  const handleOAuthGitHub = () => {
    const backendUrl = window.location.origin.includes('localhost:517') 
      ? 'http://localhost:5000'
      : window.location.origin;
    window.location.href = `${backendUrl}/api/auth/oauth/github`;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">🍌 Banana Runner</h1>
          <p className="auth-subtitle">Login to start running and collecting bananas</p>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input 
              id="email"
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="your@email.com" 
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input 
              id="password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button 
            className="btn btn-primary auth-submit" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="oauth-buttons">
          <button 
            type="button"
            className="oauth-btn oauth-google" 
            onClick={handleOAuthGoogle}
            disabled={loading}
            title="Continue with Google"
          >
            <svg className="oauth-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#1f2937"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34a853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fbbc05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#ea4335"/>
            </svg>
            Google
          </button>

          <button 
            type="button"
            className="oauth-btn oauth-github" 
            onClick={handleOAuthGitHub}
            disabled={loading}
            title="Continue with GitHub"
          >
            <svg className="oauth-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.544 2.914 1.186.092-.923.35-1.544.638-1.897-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="#1f2937"/>
            </svg>
            GitHub
          </button>
        </div>

        <div className="auth-footer">
          <p className="auth-text">
            Don't have an account? <a href="/register" className="auth-link">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
