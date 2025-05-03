import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../utils/types';
import { users } from '../utils/data';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('medstore_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we're just checking against our mock data
      
      // Simple validation
      if (!email || !password) {
        return false;
      }
      
      // Find user by email (mock authentication)
      const foundUser = users.find(u => u.email === email);
      
      // Mock password check (in a real app, NEVER store passwords in plain text)
      // For demo purposes, we'll pretend "password123" works for all users
      if (foundUser && password === 'password123') {
        setUser(foundUser);
        setIsAuthenticated(true);
        
        // Save to localStorage (for demo only, in production use secure cookies or tokens)
        localStorage.setItem('medstore_user', JSON.stringify(foundUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('medstore_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};