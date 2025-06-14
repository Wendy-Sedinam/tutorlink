
"use client";

import type { User, Student, Tutor } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { auth, db } from '@/lib/firebase'; // Import Firebase auth and db
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  type User as FirebaseUser 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { mockStudents, mockTutors } from '@/lib/mock-data'; // Still needed for initial data if any, but user management will shift

// Define specific types for signup and login to be clearer
interface SignupCredentials {
  email: string;
  name: string;
  role: 'student' | 'tutor';
  password?: string; // Password for email/pass signup
  avatarUrl?: string; // Optional, can be set later or defaulted
}

interface LoginCredentials {
  email: string;
  password?: string; // Password for email/pass login
}


type AuthContextType = {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  signup: (credentials: SignupCredentials) => Promise<User | null>;
  login: (credentials: LoginCredentials) => Promise<User | null>;
  logout: () => Promise<void>;
  updateUser: (updatedProfileData: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setIsLoading(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        // Fetch user profile from Firestore
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUser(userDocSnap.data() as User);
        } else {
          // This case might happen if Firestore doc creation failed during signup
          // Or if user exists in Auth but not Firestore (e.g. manual deletion)
          console.warn("User exists in Firebase Auth but not in Firestore. Logging out.");
          await firebaseSignOut(auth); // Log them out to be safe
          setUser(null);
          setFirebaseUser(null);
        }
      } else {
        setUser(null);
        setFirebaseUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const signup = async (credentials: SignupCredentials): Promise<User | null> => {
    setIsLoading(true);
    if (!credentials.password) {
      throw new Error("Password is required for signup.");
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
      const fbUser = userCredential.user;
      
      let newUserProfile: User;
      if (credentials.role === 'student') {
        newUserProfile = {
          id: fbUser.uid,
          name: credentials.name,
          email: credentials.email,
          role: 'student',
          avatarUrl: credentials.avatarUrl || `https://picsum.photos/seed/${fbUser.uid}/200/200`,
          bio: "New student, eager to learn!",
          learningPreferences: "Not specified yet.",
          subjectInterests: [],
        } as Student;
      } else {
        newUserProfile = {
          id: fbUser.uid,
          name: credentials.name,
          email: credentials.email,
          role: 'tutor',
          avatarUrl: credentials.avatarUrl || `https://picsum.photos/seed/${fbUser.uid}/200/200`,
          bio: "New tutor, ready to teach!",
          headline: "Enthusiastic new tutor",
          subjectMatterExpertise: [],
          descriptionOfExpertise: "Looking forward to helping students!",
          teachingStyle: "Flexible and adaptive",
          yearsOfExperience: 0,
          assignedStudentIds: [],
        } as Tutor;
      }

      // Store user profile in Firestore
      await setDoc(doc(db, 'users', fbUser.uid), newUserProfile);
      setUser(newUserProfile);
      setFirebaseUser(fbUser);

      // Potentially assign student to first tutor (mock logic, to be replaced with real logic)
       if (newUserProfile.role === 'student' && mockTutors.length > 0) {
        const tutorToAssign = mockTutors[0]; // This uses mock data, ideally fetch from Firestore
        if (!tutorToAssign.assignedStudentIds) {
          tutorToAssign.assignedStudentIds = [];
        }
        if (!tutorToAssign.assignedStudentIds.includes(newUserProfile.id)) {
            tutorToAssign.assignedStudentIds.push(newUserProfile.id);
            // TODO: Update tutor document in Firestore with this new studentId
        }
      }

      setIsLoading(false);
      return newUserProfile;
    } catch (error) {
      console.error("Error during signup:", error);
      setIsLoading(false);
      throw error; // Re-throw for the form to handle
    }
  };

  const login = async (credentials: LoginCredentials): Promise<User | null> => {
    setIsLoading(true);
     if (!credentials.password) {
      throw new Error("Password is required for login.");
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const fbUser = userCredential.user;
      
      // Fetch user profile from Firestore
      const userDocRef = doc(db, 'users', fbUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userProfile = userDocSnap.data() as User;
        setUser(userProfile);
        setFirebaseUser(fbUser);
        setIsLoading(false);
        return userProfile;
      } else {
        // Should not happen if signup is correct
        throw new Error("User profile not found in Firestore.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setIsLoading(false);
      throw error; // Re-throw for the form to handle
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateUser = async (updatedProfileData: Partial<User>) => {
    if (!firebaseUser) {
      console.error("No Firebase user to update profile for.");
      return;
    }
    setIsLoading(true);
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userDocRef, updatedProfileData);
      // Fetch the updated document to ensure local state is in sync
      const updatedDocSnap = await getDoc(userDocRef);
      if (updatedDocSnap.exists()) {
        setUser(updatedDocSnap.data() as User);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, isLoading, signup, login, logout, updateUser }}>
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
