import { createContext, useContext, useEffect, useState } from 'react';
import { me as fetchMe, logout as apiLogout } from '../services/authService.js';

const AuthContext = createContext(null);
export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const AUTH_DISABLED = import.meta.env.VITE_DISABLE_AUTH === 'true';

  const devUser = {
    id: 'dev-user',
    username: 'Developer',
    email: 'dev@example.com',
    role: 'user',
  };

  useEffect(() => {
    (async () => {
      if (AUTH_DISABLED) {
        setUser(devUser);
        setLoading(false);
        return;
      }
      try {
        const data = await fetchMe();
        setUser(data.user);
        try { localStorage.setItem('authUser', JSON.stringify(data.user)); } catch {}
      } catch (_) {
        // Fallback to cached user if available to avoid UI reset
        try {
          const cached = JSON.parse(localStorage.getItem('authUser') || 'null');
          setUser(cached);
        } catch {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    if (AUTH_DISABLED) {
      setUser(null);
      try { localStorage.removeItem('authUser'); } catch {}
      return;
    }
    try {
      await apiLogout();
    } finally {
      setUser(null);
      try { localStorage.removeItem('authUser'); } catch {}
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

