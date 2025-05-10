"use client";

import type { Student, Tutor, User } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockStudents, mockTutors } from '@/lib/mock-data';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (userId: string, role: 'student' | 'tutor') => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in user from localStorage or a session
    const storedUserId = localStorage.getItem('loggedInUserId');
    const storedUserRole = localStorage.getItem('loggedInUserRole') as 'student' | 'tutor' | null;
    if (storedUserId && storedUserRole) {
      login(storedUserId, storedUserRole);
    }
    setIsLoading(false);
  }, []);

  const login = (userId: string, role: 'student' | 'tutor') => {
    setIsLoading(true);
    let foundUser: Student | Tutor | undefined;
    if (role === 'student') {
      foundUser = mockStudents.find(s => s.id === userId);
    } else {
      foundUser = mockTutors.find(t => t.id === userId);
    }
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('loggedInUserId', foundUser.id);
      localStorage.setItem('loggedInUserRole', foundUser.role);
    } else {
      // For demo purposes, if ID not in mock, create a placeholder or default.
      // Or handle as login error. For now, let's pick the first one if not found.
      const defaultUser = role === 'student' ? mockStudents[0] : mockTutors[0];
      setUser(defaultUser);
      localStorage.setItem('loggedInUserId', defaultUser.id);
      localStorage.setItem('loggedInUserRole', defaultUser.role);
    }
    setIsLoading(false);
  };

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
