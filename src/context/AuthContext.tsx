
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users for demo purposes
const mockUsers = [
  { id: '1', name: 'Admin User', email: 'nationalquranicseminar@example.com', password: '871459nqs', role: 'admin' as const },
  { id: '2', name: 'Regular User', email: 'user@example.com', password: 'password123', role: 'user' as const },
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('seminar_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('seminar_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        );
        
        if (user) {
          // Clone the user without the password
          const { password, ...userWithoutPassword } = user;
          setCurrentUser(userWithoutPassword);
          localStorage.setItem('seminar_user', JSON.stringify(userWithoutPassword));
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        const existingUser = mockUsers.find((u) => u.email === email);
        
        if (existingUser) {
          reject(new Error('Email already in use'));
        } else {
          // Create a new user with a role of 'user'
          const newUser = {
            id: `${mockUsers.length + 1}`,
            name,
            email,
            password,
            role: 'user' as const
          };
          
          // In a real app, we would add the user to the database
          // Here we're just adding to our mock array
          mockUsers.push(newUser);
          
          // Log in the new user (without the password)
          const { password: _, ...userWithoutPassword } = newUser;
          setCurrentUser(userWithoutPassword);
          localStorage.setItem('seminar_user', JSON.stringify(userWithoutPassword));
          
          resolve();
        }
      }, 1000);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('seminar_user');
  };

  const isAuthenticated = currentUser !== null;
  const isAdmin = currentUser?.role === 'admin';

  const value = {
    currentUser,
    isAuthenticated,
    isAdmin,
    login,
    signup,
    logout,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
