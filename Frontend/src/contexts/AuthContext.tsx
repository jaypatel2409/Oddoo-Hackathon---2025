import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  location?: string;
  profilePhoto?: {
    url?: string;
    publicId?: string;
  };
  role: string;
  isEmailVerified: boolean;
  introduction?: string;
  skillsOffered: Array<{
    name: string;
    description?: string;
    level: string;
  }>;
  skillsWanted: Array<{
    name: string;
    description?: string;
    level: string;
  }>;
  rating: {
    average: number;
    count: number;
  };
  isProfileComplete?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  googleAuth: (accessToken: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  showProfileCompletionModal: boolean;
  setShowProfileCompletionModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileCompletionModal, setShowProfileCompletionModal] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const userData = await apiService.getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [token]);

  // Google OAuth authentication
  const googleAuth = async (accessToken: string) => {
    try {
      setIsLoading(true);
      const userData = await apiService.googleAuth(accessToken);
      handleAuthSuccess(userData);
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Traditional login
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userData = await apiService.login({ email, password });
      handleAuthSuccess(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // User registration
  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await apiService.register(userData);
      handleAuthSuccess(response);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Update user profile
  const updateUser = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      const updatedUser = await apiService.updateProfile(userData);
      setUser(updatedUser);
      if (updatedUser.token) {
        setToken(updatedUser.token);
        localStorage.setItem('token', updatedUser.token);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful authentication
  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setToken(userData.token);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    googleAuth,
    logout,
    updateUser,
    showProfileCompletionModal,
    setShowProfileCompletionModal,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 