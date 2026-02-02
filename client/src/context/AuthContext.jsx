import { createContext, useContext, useEffect, useState } from 'react';
import { me as fetchMe, logout as apiLogout } from '../services/authService.js';

const AuthContext = createContext(null);
export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const AUTH_DISABLED = import.meta.env.VITE_DISABLE_AUTH === 'true';

  useEffect(() => {
    if (AUTH_DISABLED) {
      setUser({ id: 'dev-user', username: 'DevUser', role: 'admin' });
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await fetchMe();
        setUser(data.user);
      } catch (_) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
