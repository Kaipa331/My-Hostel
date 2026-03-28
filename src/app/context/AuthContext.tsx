import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';

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
  ) => Promise<boolean | { error: string }>;
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
    // Using any casting to avoid persistent TypeScript "never" errors on the profiles table
    const { data: profile, error } = await (supabase
      .from('profiles') as any)
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      // Self-healing: try to create the profile from auth metadata 
      // if it was missed during signup (e.g. before trigger was fixed)
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser && authUser.id === userId && authUser.user_metadata?.name) {
        const metadata = authUser.user_metadata;
        const { data: newProfile, error: insertError } = await (supabase
          .from('profiles') as any)
          .insert({
            id: userId,
            name: metadata.name,
            email: authUser.email!,
            phone: metadata.phone || '',
            role: metadata.role || 'student',
            university: metadata.university || '',
            student_id: metadata.student_id || '',
            status: 'approved',
            saved_hostels: []
          })
          .select('*')
          .single();
        
        if (!insertError && newProfile) {
          // Retry setting the student/admin state with the newly created profile
          setStudentFromProfile(newProfile);
        }
      }
      return;
    }

    setStudentFromProfile(profile);
  };

  const setStudentFromProfile = (profile: any) => {
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
    const { data, error } = await (supabase
      .from('profiles') as any)
      .select('*')
      .eq('role', 'landlord');
    
    if (data && !error) {
      setLandlords((data as any[]).map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone || '',
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
    const { data: profile } = await (supabase.from('profiles') as any).select('role').eq('id', data.user.id).single();
    if ((profile as any)?.role === 'admin') {
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

    const { data: profile } = await (supabase.from('profiles') as any).select('role').eq('id', data.user.id).single();
    if ((profile as any)?.role === 'student') {
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
  ): Promise<boolean | { error: string }> => {
    // We pass extra metadata (phone, university, student_id) so the DB trigger can 
    // handle the profile creation automatically and atomically.
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          name,
          phone,
          university,
          student_id: studentId,
          role: 'student'
        }
      }
    });

    if (error) {
      console.error('Signup auth error:', error);
      return { error: error.message };
    }

    if (data.user) {
      // The DB trigger handle_new_user() will create the profile.
      // We return true immediately. If the user needs to confirm email,
      // data.session will be null, but signUp was still successful.
      return true;
    }
    return { error: 'Unknown signup error' };
  };

  const studentLogout = async () => {
    await supabase.auth.signOut();
  };

  // --- LANDLORD APPROVAL ---
  const approveLandlord = async (id: string) => {
    const { error } = await (supabase.from('profiles') as any).update({ status: 'approved' }).eq('id', id);
    if (!error) {
      setLandlords(prev => prev.map(l => l.id === id ? { ...l, status: 'approved' } : l));
    }
  };

  const rejectLandlord = async (id: string) => {
    const { error } = await (supabase.from('profiles') as any).update({ status: 'rejected' }).eq('id', id);
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
    const { error } = await (supabase
      .from('profiles') as any)
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
