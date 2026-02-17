import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './context/AuthContext.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import MainMenu from './components/menu/MainMenu.jsx';
import GameWorld from './components/game/GameWorld.jsx';
import Leaderboard from './components/leaderboard/Leaderboard.jsx';
import Profile from './components/profile/Profile.jsx';
import Navbar from './components/ui/Navbar.jsx';

function Protected({ children, role }) {
  const { user, loading } = useAuthContext();
  
  // Still loading authentication state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: 'var(--text)' 
      }}>
        Loading...
      </div>
    );
  }
  
  // User not authenticated
  if (!user) return <Navigate to="/login" replace />;
  
  // User doesn't have required role
  if (role && user.role !== role) return <Navigate to="/" replace />;
  
  return children;
}

function LoginOrMainMenu() {
  const { user, loading } = useAuthContext();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: 'var(--text)' 
      }}>
        Loading...
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <MainMenu />;
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<LoginOrMainMenu />} />
        <Route
          path="/game"
          element={
            <Protected>
              <GameWorld />
            </Protected>
          }
        />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        {/* AdminPanel removed; route /admin to Profile to avoid runtime error */}
        <Route path="/admin" element={<Profile />} />
      </Routes>
    </AuthProvider>
  );
}
