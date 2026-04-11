import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('play11_session');
    if (session) {
      try {
        const { user: savedUser } = JSON.parse(session);
        setUser(savedUser);
      } catch (e) {
        console.error('Session corruption', e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (mobile, otp) => {
    const response = await authService.verifyOtp(mobile, otp);
    if (response.success) {
      setUser(response.user);
    }
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
