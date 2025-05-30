import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'viewer' | 'researcher';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  walletAddress: string;
  isVerified: boolean;
  tokens: number;
  contributionScore: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  connectWallet: (address: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: '1',
        name: role === 'researcher' ? 'John Researcher' : 'John Viewer',
        email: email,
        role: role,
        walletAddress: '',
        isVerified: role === 'researcher',
        tokens: role === 'researcher' ? 250 : 50,
        contributionScore: role === 'researcher' ? 78 : 0
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: '1',
        name: name,
        email: email,
        role: role,
        walletAddress: '',
        isVerified: false,
        tokens: role === 'researcher' ? 100 : 25,
        contributionScore: 0
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = (address: string) => {
    if (user) {
      const updatedUser = { ...user, walletAddress: address };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      setUser({ 
        id: '1', 
        name: '', 
        email: '', 
        role: 'viewer', 
        walletAddress: address, 
        isVerified: false, 
        tokens: 0, 
        contributionScore: 0 
      });
      localStorage.setItem('user', JSON.stringify({ 
        id: '1', 
        name: '', 
        email: '', 
        role: 'viewer', 
        walletAddress: address, 
        isVerified: false, 
        tokens: 0, 
        contributionScore: 0 
      }));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    connectWallet,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
