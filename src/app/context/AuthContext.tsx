import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';

export interface Admin {
  name: string;
  email: string;
}

export interface Student {
  id: string; // added to sync with db
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

interface AllAuthContextType {
  // Admin
  admin: Admin | null;
  adminLogin: (email: string, pass: string) => Promise<boolean>;
  adminLogout: () => void;
  // Student
  student: Student | null;
  studentLogin: (email: string, pass: string) => Promise<boolean>;
  studentSignup: (
    name: string,
    email: string,
    pass: string,
    phone: string,
    university: string,
    studentId: string
  ) => Promise<boolean>;
  studentLogout: () => void;
  // Landlord Management (Admin usage)
  landlords: MockLandlord[];
  approveLandlord: (id: string) => void;
  rejectLandlord: (id: string) => void;
  // Student Actions
  toggleSaveHostel: (hostelId: string) => void;
}

export const AuthContext = createContext<AllAuthContextType | undefined>(undefined);

export function AllAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [landlords, setLandlords] = useState<MockLandlord[]>([]);

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const userId = data?.session?.user.id;
      if (userId) {
        await fetchProfile(userId);
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
        setLandlords([]);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) return;

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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'landlord');
    
    if (data && !error) {
      setLandlords(data.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        status: p.status || 'pending',
        createdAt: p.created_at
      })));
    }
  };

  // --- ADMIN ---
  const adminLogin = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error || !data.user) return false;

    // Check role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
    if (profile?.role === 'admin') {
      return true;
    } else {
      await supabase.auth.signOut();
      return false;
    }
  };

  const adminLogout = async () => {
    await supabase.auth.signOut();
  };

  // --- STUDENT ---
  const studentLogin = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error || !data.user) return false;

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
    if (profile?.role === 'student') {
      return true;
    } else {
      await supabase.auth.signOut();
      return false;
    }
  };

  const studentSignup = async (
    name: string,
    email: string,
    pass: string,
    phone: string,
    university: string,
    studentId: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          name,
          phone,
          role: 'student'
        }
      }
    });

    if (error) return false;

    if (data.user) {
      // Small delay to ensure the database trigger has run
      await new Promise(resolve => setTimeout(resolve, 800));
      await supabase.from('profiles').update({
        university,
        student_id: studentId,
        saved_hostels: []
      }).eq('id', data.user.id);
      
      return true;
    }
    return false;
  };

  const studentLogout = async () => {
    await supabase.auth.signOut();
  };

  // --- LANDLORD APPROVAL ---
  const approveLandlord = async (id: string) => {
    const { error } = await supabase.from('profiles').update({ status: 'approved' }).eq('id', id);
    if (!error) {
      setLandlords(prev => prev.map(l => l.id === id ? { ...l, status: 'approved' } : l));
    }
  };

  const rejectLandlord = async (id: string) => {
    const { error } = await supabase.from('profiles').update({ status: 'rejected' }).eq('id', id);
    if (!error) {
      setLandlords(prev => prev.map(l => l.id === id ? { ...l, status: 'rejected' } : l));
    }
  };

  // --- STUDENT ACTIONS ---
  const toggleSaveHostel = async (hostelId: string) => {
    if (!student) return;

    const isSaved = student.savedHostels.includes(hostelId);
    const newSavedHostels = isSaved
      ? student.savedHostels.filter(id => id !== hostelId)
      : [...student.savedHostels, hostelId];

    // Optimistic UI update
    setStudent({ ...student, savedHostels: newSavedHostels });

    // DB update
    const { error } = await supabase
      .from('profiles')
      .update({ saved_hostels: newSavedHostels })
      .eq('id', student.id);

    // Rollback if failed
    if (error) {
      setStudent({ ...student, savedHostels: student.savedHostels });
      console.error("Failed to save hostel", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        adminLogin,
        adminLogout,
        student,
        studentLogin,
        studentSignup,
        studentLogout,
        landlords,
        approveLandlord,
        rejectLandlord,
        toggleSaveHostel
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAllAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAllAuth must be used within an AllAuthProvider');
  }
  return context;
}
