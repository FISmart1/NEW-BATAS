// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLayout, setShowLayout] = useState(true);
  const [loading, setLoading] = useState(true); // ⬅️ tambahan

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // selesai baca localStorage
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, showLayout, setShowLayout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

