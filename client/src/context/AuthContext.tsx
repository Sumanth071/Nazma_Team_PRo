import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, requestedRole?: string) => Promise<void>;
  quickDemoLogin: (role: UserRole) => Promise<void>;
  logout: () => void;
  hasPermission: (perm: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('coloai_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        console.warn('Failed to restore session:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('coloai_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const register = async (name: string, email: string, password: string, requestedRole?: string) => {
    const res = await api.post('/auth/register', { name, email, password, requestedRole });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('coloai_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const quickDemoLogin = async (role: UserRole) => {
    const credentials: Record<UserRole, { email: string; pass: string }> = {
      Admin: { email: 'admin@coloaipoly.org', pass: 'Password123!' },
      Researcher: { email: 'researcher@coloaipoly.org', pass: 'Password123!' },
      Clinician: { email: 'clinician@coloaipoly.org', pass: 'Password123!' },
    };
    const { email, pass } = credentials[role];
    await login(email, pass);
  };

  const logout = () => {
    localStorage.removeItem('coloai_token');
    setToken(null);
    setUser(null);
  };

  const hasPermission = (perm: string): boolean => {
    if (!user || !user.permissions) return false;
    return (
      user.permissions.includes('*') ||
      user.permissions.includes(perm) ||
      user.permissions.some((p) => p.endsWith(':*') && perm.startsWith(p.split(':')[0]))
    );
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, quickDemoLogin, logout, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
