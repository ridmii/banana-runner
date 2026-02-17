import { createContext, useContext, useEffect, useState } from 'react';
import { me as fetchMe, logout as apiLogout } from '../services/authService.js';

const AuthContext = createContext(null);
export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMe();
        if (data?.user) {
          setUser(data.user);
          try { localStorage.setItem('authUser', JSON.stringify(data.user)); } catch {}
        } else {
          setUser(null);
        }
      } catch (error) {
        // API call failed (401, network error, etc.) - user not authenticated
        console.log('Auth check failed:', error.message || 'Unknown error');
        setUser(null);
        try { localStorage.removeItem('authUser'); } catch {}
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
      try { localStorage.removeItem('authUser'); } catch {}
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
