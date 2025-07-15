
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  dueDate?: string;
  healthStatus?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (userData: Partial<User>) => void;
  handleRegister: (name: string, email: string, password: string, role: string, phone?: string, specialty?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem('mamacare_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  // Use your local IP for API calls so mobile devices can connect
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      if (!response.ok) return false;
      const data = await response.json();
      if (!data.user || !data.token) return false;
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('mamacare_user', JSON.stringify(data.user));
      localStorage.setItem('mamacare_token', data.token);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('mamacare_user');
    localStorage.removeItem('mamacare_token');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('mamacare_user', JSON.stringify(updatedUser));
    }
  };

  const handleRegister = async (name: string, email: string, password: string, role: string, phone?: string, specialty?: string): Promise<boolean> => {
    try {
      const body: any = { name, email, password, role };
      if (role === 'doctor' && phone) body.phone = phone;
      if (role === 'doctor' && specialty) body.specialty = specialty;
      const response = await fetch(`${API_BASE}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        // Try to get error message from backend
        const errText = await response.text();
        console.error('Registration failed:', errText);
        return false;
      }
      // Do NOT log in the user automatically. Let them log in manually.
      return true;
    } catch (error) {
      console.error('Network error during registration:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      updateProfile,
      handleRegister
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
