import { useEffect, useState } from 'react';
import { login } from '../../services/authService.js';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login({ email, password });
      setUser(data.user);
      try { localStorage.setItem('authUser', JSON.stringify(data.user)); } catch {}
      navigate('/'); // Redirect to main menu (now protected)
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={onSubmit} className="form">
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
          <button className="btn primary" type="submit">Login</button>
        </form>
        <div className="muted" style={{ textAlign: 'center', marginTop: '16px' }}>
          Don't have an account? <a href="/register" style={{ color: 'var(--primary)' }}>Register here</a>
        </div>
        {error && <p className="error" style={{ textAlign: 'center', marginTop: '12px' }}>{error}</p>}
      </div>
    </div>
  );
}
