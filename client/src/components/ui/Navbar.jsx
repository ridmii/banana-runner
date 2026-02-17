import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const onLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="brand">🍌 Banana Runner</div>
      <nav className="links">
        <Link to="/">Menu</Link>
        <Link to="/game">Play</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        {user && <Link to="/profile">Profile</Link>}
      </nav>
      <div className="auth">
        {user ? (
          <>
            <span className="muted">Hi, {user.username}</span>
            <button className="btn" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <Link className="btn" to="/login">Login</Link>
        )}
      </div>
    </header>
  );
}
