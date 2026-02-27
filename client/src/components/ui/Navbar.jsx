import { Link, NavLink, useNavigate } from 'react-router-dom';
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
        <NavLink to="/" end>Menu</NavLink>
        <NavLink to="/game">Play</NavLink>
        <NavLink to="/leaderboard">Leaderboard</NavLink>
        {user && <NavLink to="/profile">Profile</NavLink>}
      </nav>
      <div className="auth">
        {user ? (
          <>
            <span className="muted">Hi, {user.username}</span>
            <button className="btn nav-btn" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <Link className="btn nav-btn" to="/login">Login</Link>
        )}
      </div>
    </header>
  );
}
