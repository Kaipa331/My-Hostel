import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';

// Constants
const AUTH_TIMEOUT = 15000; // 15 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'landlord' | 'admin';
}

export interface Admin {
  name: string;
  email: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  studentId: string;
  savedHostels: string[];
}

export interface MockLandlord {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Utilities
const withTimeout = async <T,>(
  promise: any, 
  timeoutMs: number = AUTH_TIMEOUT,
  operation: string = 'operation'
): Promise<T> => {
  const timeoutPromise = new Promise<T>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`${operation} timed out after ${timeoutMs}ms.`));
    }, timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]);
};

const withRetry = async <T,>(
  fn: () => Promise<any>,
  maxRetries: number = MAX_RETRIES,
  operation: string = 'operation'
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      if (error?.status && error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      console.error(`${operation} attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

interface AllAuthContextType {
  user: UserProfile | null;
  login: (email: string, pass: string) => Promise<boolean | { error: string }>;
  signup: (name: string, email: string, pass: string, phone: string, role: 'student' | 'landlord') => Promise<boolean | { error: string }>;
  logout: () => void;
  admin: Admin | null;
  adminLogin: (email: string, pass: string) => Promise<boolean | { error: string }>;
  adminLogout: () => void;
  student: Student | null;
  studentLogin: (email: string, pass: string) => Promise<boolean | { error: string }>;
  studentSignup: (
    name: string,
    email: string,
    pass: string,
    phone: string,
    university: string,
    studentId: string
  ) => Promise<boolean | { error: string }>;
  studentLogout: () => void;
  landlords: MockLandlord[];
  approveLandlord: (id: string) => Promise<void>;
  rejectLandlord: (id: string) => Promise<void>;
  toggleSaveHostel: (hostelId: string) => Promise<void>;
  isLoading: boolean;
  connectionError: string | null;
}

export const AuthContext = createContext<AllAuthContextType | undefined>(undefined);

export function AllAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [landlords, setLandlords] = useState<MockLandlord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        await withTimeout(
          supabase.from('profiles').select('count', { count: 'exact', head: true }),
          10000,
          'connection test'
        );
        
        const sessionResult: any = await withTimeout(
          supabase.auth.getSession(),
          10000,
          'session check'
        );
        
        if (sessionResult.error) throw sessionResult.error;
        
        const userId = sessionResult.data?.session?.user.id;
        if (userId) {
          await fetchProfile(userId);
        }
      } catch (error: any) {
        // Suppress 'stolen lock' errors as they are internal Supabase race conditions
        // and don't represent a true connection failure.
        const msg = error.message || '';
        if (msg.includes('released because another request stole it')) {
          console.warn('Supabase auth lock contention handled safely.');
          return;
        }
        
        console.error('Initialization error:', msg);
        setConnectionError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const userId = session?.user.id;
      if (userId && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        await fetchProfile(userId);
      } else if (event === 'SIGNED_OUT') {
        setAdmin(null);
        setStudent(null);
        setUser(null);
        setLandlords([]);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const result: any = await withRetry(
        () => withTimeout(
          supabase.from('profiles').select('*').eq('id', userId).single(),
          AUTH_TIMEOUT,
          'fetch profile'
        ),
        MAX_RETRIES,
        'profile fetch'
      );

      const profile = result.data;
      const error = result.error;

      if (error || !profile) {
        const { data: userData } = await supabase.auth.getUser();
        const authUser = userData?.user;
        
        if (authUser?.id === userId && authUser.user_metadata?.name) {
          const metadata = authUser.user_metadata;
          const role = (metadata.role === 'admin' || metadata.role === 'landlord' || metadata.role === 'student')
            ? metadata.role
            : 'student';
          const status = role === 'landlord' ? 'pending' : 'approved';

          const insertResult: any = await withTimeout(
            supabase.from('profiles').insert({
              id: userId,
              name: metadata.name,
              email: authUser.email!,
              phone: metadata.phone || '',
              role,
              university: role === 'student' ? (metadata.university || '') : '',
              student_id: role === 'student' ? (metadata.student_id || '') : '',
              status,
              saved_hostels: []
            } as any).select('*').single(),
            AUTH_TIMEOUT,
            'self-healing insert'
          );
          
          if (!insertResult.error && insertResult.data) {
            updateStatesFromProfile(insertResult.data);
          }
        }
        return;
      }

      updateStatesFromProfile(profile);
    } catch (e: any) {
      console.error('fetchProfile error:', e.message);
    }
  };

  const updateStatesFromProfile = (profile: any) => {
    setUser({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone || '',
      role: profile.role as 'student' | 'landlord' | 'admin'
    });

    if (profile.role === 'admin') {
      setAdmin({ name: profile.name, email: profile.email });
      fetchLandlords();
    } else if (profile.role === 'student') {
      setStudent({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone || '',
        university: profile.university || '',
        studentId: profile.student_id || '',
        savedHostels: profile.saved_hostels || []
      });
    }
  };

  const fetchLandlords = async () => {
    try {
      const result: any = await withTimeout(
        supabase.from('profiles').select('*').eq('role', 'landlord'),
        AUTH_TIMEOUT,
        'fetch landlords'
      );
      if (result.data && !result.error) {
        setLandlords((result.data as any[]).map(p => ({
          id: p.id,
          name: p.name,
          email: p.email,
          phone: p.phone || '',
          status: p.status || 'pending',
          createdAt: p.created_at
        })));
      }
    } catch (e) {
      console.error('fetchLandlords failed', e);
    }
  };

  const login = async (email: string, pass: string) => studentLogin(email, pass);
  const signup = async (
    name: string,
    email: string,
    pass: string,
    phone: string,
    role: 'student' | 'landlord'
  ): Promise<boolean | { error: string }> => {
    if (role === 'student') {
      return studentSignup(name, email, pass, phone, '', '');
    }

    try {
      const result: any = await withTimeout(
        supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: { name, phone, role: 'landlord' }
          }
        }),
        AUTH_TIMEOUT,
        'landlord signup'
      );

      if (result.error) return { error: result.error.message };
      if (result.data.user) return true;
      return { error: 'Signup failed' };
    } catch (e: any) {
      return { error: e.message };
    }
  };
  const logout = async () => {
    await supabase.auth.signOut();
    setAdmin(null);
    setStudent(null);
    setUser(null);
    setLandlords([]);
  };

  const adminLogin = async (email: string, pass: string): Promise<boolean | { error: string }> => {
    try {
      const result: any = await withTimeout(
        supabase.auth.signInWithPassword({ email, password: pass }),
        AUTH_TIMEOUT,
        'admin auth'
      );
      if (result.error || !result.data.user) return { error: result.error?.message || 'Login failed' };

      const profileResult: any = await supabase.from('profiles').select('role').eq('id', result.data.user.id).single();
      if (profileResult.data?.role === 'admin') {
        return true;
      } else {
        await supabase.auth.signOut();
        return { error: 'Access denied: Admin role required.' };
      }
    } catch (e: any) {
      return { error: e.message };
    }
  };

  const adminLogout = logout;

  const studentLogin = async (email: string, pass: string): Promise<boolean | { error: string }> => {
    try {
      const result: any = await withRetry(
        () => withTimeout(
          supabase.auth.signInWithPassword({ email, password: pass }),
          AUTH_TIMEOUT,
          'student auth'
        ),
        MAX_RETRIES,
        'login'
      );
      
      if (result.error) return { error: result.error.message };
      if (!result.data.user) return { error: 'Login failed' };

      const profileResult: any = await supabase.from('profiles').select('role').eq('id', result.data.user.id).single();
      if (profileResult.data?.role === 'student' || profileResult.data?.role === 'landlord' || profileResult.data?.role === 'admin') {
        return true;
      }
      
      await supabase.auth.signOut();
      return { error: 'Access denied: Invalid role.' };
    } catch (e: any) {
      if (e.message.includes('Email not confirmed')) {
        return { error: 'Please confirm your email address before logging in.' };
      }
      return { error: e.message || 'Invalid credentials' };
    }
  };

  const studentSignup = async (
    name: string,
    email: string,
    pass: string,
    phone: string,
    university: string,
    studentId: string
  ): Promise<boolean | { error: string }> => {
    try {
      const result: any = await withTimeout(
        supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: { name, phone, university, student_id: studentId, role: 'student' }
          }
        }),
        AUTH_TIMEOUT,
        'student signup'
      );

      if (result.error) return { error: result.error.message };
      if (result.data.user) return true;
      return { error: 'Signup failed' };
    } catch (e: any) {
      return { error: e.message };
    }
  };

  const studentLogout = logout;

  const approveLandlord = async (id: string) => {
    try {
      const result: any = await supabase.from('profiles').update({ status: 'approved' } as any).eq('id', id);
      if (!result.error) {
        setLandlords(prev => prev.map(l => l.id === id ? { ...l, status: 'approved' } : l));
      }
    } catch (e) {
      console.error('Approve failed', e);
    }
  };

  const rejectLandlord = async (id: string) => {
    try {
      const result: any = await supabase.from('profiles').update({ status: 'rejected' } as any).eq('id', id);
      if (!result.error) {
        setLandlords(prev => prev.map(l => l.id === id ? { ...l, status: 'rejected' } : l));
      }
    } catch (e) {
      console.error('Reject failed', e);
    }
  };

  const toggleSaveHostel = async (hostelId: string) => {
    if (!student) return;
    const isSaved = student.savedHostels.includes(hostelId);
    const newSavedHostels = isSaved
      ? student.savedHostels.filter(sid => sid !== hostelId)
      : [...student.savedHostels, hostelId];

    const currentStudent = student;
    setStudent({ ...currentStudent, savedHostels: newSavedHostels });

    try {
      const result: any = await supabase.from('profiles')
        .update({ saved_hostels: newSavedHostels } as any)
        .eq('id', student.id);
      if (result.error) throw result.error;
    } catch (e) {
      setStudent(currentStudent);
      console.error("Failed to save hostel", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user, login, signup, logout,
        admin, adminLogin, adminLogout,
        student, studentLogin, studentSignup, studentLogout,
        landlords, approveLandlord, rejectLandlord,
        toggleSaveHostel,
        isLoading,
        connectionError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAllAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAllAuth must be used within an AllAuthProvider');
  return context;
}