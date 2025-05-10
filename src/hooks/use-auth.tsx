"use client";

import type { Student, Tutor, User } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockStudents, mockTutors } from '@/lib/mock-data';

// Argument type for the login function
type LoginArg = { userId: string; role: 'student' | 'tutor' } | User;

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (userArg: LoginArg) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (userArg: LoginArg) => {
    setIsLoading(true);
    let resolvedUser: User | null = null;

    if (typeof userArg === 'object' && 'id' in userArg && 'role' in userArg) {
      // Full user object provided (e.g., from signup)
      resolvedUser = userArg as User;
    } else if (typeof userArg === 'string') {
        // This case should not happen with the new LoginArg, but kept for robustness
        // It implies userArg is a userId, but role is missing.
        // We'd need roleArg if we split LoginArg more.
        // For now, let's assume this means the object way failed or it's an old call.
        // Defaulting to searching based on localStorage if this path is hit.
        const storedRole = localStorage.getItem('loggedInUserRole') as 'student' | 'tutor' | null;
        if (storedRole) {
             if (storedRole === 'student') {
                resolvedUser = mockStudents.find(s => s.id === userArg) || null;
            } else {
                resolvedUser = mockTutors.find(t => t.id === userArg) || null;
            }
        }
    } else if ('userId' in userArg && 'role' in userArg) {
        // Login with userId and role
        const { userId, role } = userArg;
        if (role === 'student') {
            resolvedUser = mockStudents.find(s => s.id === userId) || null;
        } else {
            resolvedUser = mockTutors.find(t => t.id === userId) || null;
        }
    }


    if (!resolvedUser && 'userId' in userArg && 'role' in userArg) {
      // Fallback to default user if not found by ID (e.g., mock data mismatch or demo login)
      // This part is specifically for the ID/role login pathway
      const roleForFallback = (userArg as { role: 'student' | 'tutor' }).role;
      resolvedUser = roleForFallback === 'student' ? mockStudents[0] : mockTutors[0];
    }


    if (resolvedUser) {
      setUser(resolvedUser);
      localStorage.setItem('loggedInUserId', resolvedUser.id);
      localStorage.setItem('loggedInUserRole', resolvedUser.role);
    } else {
      // If user cannot be resolved, logout to clear inconsistent state
      setUser(null);
      localStorage.removeItem('loggedInUserId');
      localStorage.removeItem('loggedInUserRole');
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    // Simulate checking for a logged-in user from localStorage or a session
    const storedUserId = localStorage.getItem('loggedInUserId');
    const storedUserRole = localStorage.getItem('loggedInUserRole') as 'student' | 'tutor' | null;
    if (storedUserId && storedUserRole) {
      login({ userId: storedUserId, role: storedUserRole });
    } else {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const logout = () => {
    setUser(null);
    localStorage.removeItem('loggedInUserId');
    localStorage.removeItem('loggedInUserRole');
  };
  
  const updateUser = (updatedUserInfo: Partial<User>) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...updatedUserInfo } : null);
    // In a real app, this would also update mockData or backend
    if (user) {
      if (user.role === 'student') {
        const studentIndex = mockStudents.findIndex(s => s.id === user.id);
        if (studentIndex !== -1) {
          mockStudents[studentIndex] = { ...mockStudents[studentIndex], ...updatedUserInfo } as Student;
        }
      } else {
        const tutorIndex = mockTutors.findIndex(t => t.id === user.id);
        if (tutorIndex !== -1) {
          mockTutors[tutorIndex] = { ...mockTutors[tutorIndex], ...updatedUserInfo } as Tutor;
        }
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};