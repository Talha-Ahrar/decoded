// components/client/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored user data on mount
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('clientuser');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Verify token with backend
          const res = await fetch('/ClientApi/auth/verify', {
            method: 'GET',
            credentials: 'include'
          });
          
          if (!res.ok) {
            throw new Error('Token invalid');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('clientuser');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    if (!userData) return;
    setUser(userData);
    localStorage.setItem('clientuser', JSON.stringify(userData));
    // Force a router refresh to update UI
    router.refresh();
  };

  const logout = async () => {
    try {
      await fetch('/ClientApi/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      localStorage.removeItem('clientuser');
      setUser(null);
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem('clientuser', JSON.stringify(updatedUser));
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};