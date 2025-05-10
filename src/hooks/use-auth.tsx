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

    // Check if userArg is a full User object (e.g., from signup or successful login form lookup)
    if (typeof userArg === 'object' && 'id' in userArg && 'role' in userArg && 'email' in userArg && 'name' in userArg) {
      resolvedUser = userArg as User;
    } else if (typeof userArg === 'object' && 'userId' in userArg && 'role' in userArg) {
      // Login with userId and role (e.g., from localStorage)
      const { userId, role } = userArg;
      if (role === 'student') {
        resolvedUser = mockStudents.find(s => s.id === userId) || null;
      } else {
        resolvedUser = mockTutors.find(t => t.id === userId) || null;
      }
    }

    if (resolvedUser) {
      setUser(resolvedUser);
      localStorage.setItem('loggedInUserId', resolvedUser.id);
      localStorage.setItem('loggedInUserRole', resolvedUser.role);
    } else {
      // If user cannot be resolved, ensure logout state
      setUser(null);
      localStorage.removeItem('loggedInUserId');
      localStorage.removeItem('loggedInUserRole');
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    const storedUserId = localStorage.getItem('loggedInUserId');
    const storedUserRole = localStorage.getItem('loggedInUserRole') as 'student' | 'tutor' | null;
    if (storedUserId && storedUserRole) {
      // This will attempt to find the user in the mock data. If mock data was reset (e.g. dev server), user might not be found.
      login({ userId: storedUserId, role: storedUserRole });
    } else {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependencies: login might cause a loop if included and it changes itself.


  const logout = () => {
    setUser(null);
    localStorage.removeItem('loggedInUserId');
    localStorage.removeItem('loggedInUserRole');
  };
  
  const updateUser = (updatedUserInfo: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...updatedUserInfo };
       // Also update the mockData arrays directly for persistence across the app session
      if (updatedUser.role === 'student') {
        const studentIndex = mockStudents.findIndex(s => s.id === updatedUser.id);
        if (studentIndex !== -1) {
          mockStudents[studentIndex] = { ...mockStudents[studentIndex], ...updatedUserInfo } as Student;
        }
      } else {
        const tutorIndex = mockTutors.findIndex(t => t.id === updatedUser.id);
        if (tutorIndex !== -1) {
          mockTutors[tutorIndex] = { ...mockTutors[tutorIndex], ...updatedUserInfo } as Tutor;
        }
      }
      return updatedUser;
    });
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
