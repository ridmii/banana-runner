import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const onLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="brand">🍌 Banana Runner</div>

      {/* Hamburger toggle for mobile */}
      <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <span className={`hamburger ${menuOpen ? 'open' : ''}`} />
      </button>

      <div className={`navbar-collapse ${menuOpen ? 'show' : ''}`}>
        <nav className="links">
          <NavLink to="/" end onClick={closeMenu}>Menu</NavLink>
          <NavLink to="/game" onClick={closeMenu}>Play</NavLink>
          <NavLink to="/leaderboard" onClick={closeMenu}>Leaderboard</NavLink>
          {user && <NavLink to="/profile" onClick={closeMenu}>Profile</NavLink>}
        </nav>
        <div className="auth">
          {user ? (
            <>
              <span className="muted">Hi, {user.username}</span>
              <button className="btn nav-btn" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <Link className="btn nav-btn" to="/login" onClick={closeMenu}>Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}

