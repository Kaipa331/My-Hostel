import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';

// Types
export interface Landlord {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Room {
  id: string;
  type: 'single' | 'double' | 'shared';
  capacity: number;
  rent: number;
  available: number;
  amenities: string[];
}

export interface Hostel {
  id: string;
  landlordId: string;
  name: string;
  description: string;
  address: string;
  university: string;
  distance: number; // in km
  photos: string[];
  rooms: Room[];
  amenities: string[];
  rating: number;
  reviews: Review[];
  createdAt: string;
}

export interface Review {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Inquiry {
  id: string;
  hostelId: string;
  hostelName: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  roomType: string;
  message: string;
  date: string;
}

interface AuthContextType {
  landlord: Landlord | null;
  login: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<{success: boolean, requireConfirmation?: boolean, error?: string}>;
  logout: () => void;
}

interface DataContextType {
  hostels: Hostel[];
  inquiries: Inquiry[];
  addHostel: (hostel: Omit<Hostel, 'id' | 'createdAt' | 'rating' | 'reviews'>) => Promise<void>;
  updateHostel: (id: string, hostel: Partial<Hostel>) => Promise<void>;
  deleteHostel: (id: string) => Promise<void>;
  getHostelById: (id: string) => Hostel | undefined;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'date'>) => Promise<void>;
  getInquiriesByLandlord: (landlordId: string) => Inquiry[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockHostels: Hostel[] = [
  {
    id: '1',
    landlordId: 'mock-landlord',
    name: 'Chancellor College Heights',
    description: 'Modern hostel with excellent facilities, just 10 minutes walk from Chancellor College. Perfect for UNIMA students seeking comfort and convenience with 24/7 security.',
    address: 'Chirunga Road, Near Chancellor College, Zomba',
    university: 'University of Malawi (UNIMA)',
    distance: 0.8,
    photos: ['https://images.unsplash.com/photo-1763924636780-4da2a7c3327c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwZG9ybWl0b3J5JTIwcm9vbXxlbnwxfHx8fDE3NzQ0NTAxMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    rooms: [
      { id: 'r1', type: 'single', capacity: 1, rent: 120000, available: 3, amenities: ['Fan', 'Study Table', 'Wardrobe'] },
      { id: 'r2', type: 'double', capacity: 2, rent: 90000, available: 5, amenities: ['Fan', 'Study Table', 'Wardrobe'] },
      { id: 'r3', type: 'shared', capacity: 4, rent: 60000, available: 8, amenities: ['Fan', 'Study Table'] },
    ],
    amenities: ['WiFi', 'Laundry', 'Common Room', 'Security', 'Kitchen', 'Water Supply'],
    rating: 4.5,
    reviews: [
      { id: '1', studentName: 'Chisomo Banda', rating: 5, comment: 'Great place to stay! Clean and well maintained. Very close to campus.', date: '2026-03-20' },
      { id: '2', studentName: 'Grace Phiri', rating: 4, comment: 'Good facilities and friendly landlord. Quiet environment for studying.', date: '2026-03-15' },
    ],
    createdAt: '2026-01-15',
  },
  {
    id: '2',
    landlordId: 'mock-landlord',
    name: 'MUBAS Student Residence',
    description: 'Affordable and comfortable hostel with reliable power backup. Close to MUBAS campus and Blantyre city center with easy access to public transport.',
    address: 'Ginnery Corner, Near Polytechnic, Blantyre',
    university: 'Malawi University of Business and Applied Sciences (MUBAS)',
    distance: 1.5,
    photos: ['https://images.unsplash.com/photo-1697494794128-0cdc5e4314c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYWNjb21tb2RhdGlvbiUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3NDQ1MDEwMnww&ixlib=rb-4.1.0&q=80&w=1080'],
    rooms: [
      { id: 'r4', type: 'single', capacity: 1, rent: 100000, available: 2, amenities: ['Fan', 'Study Table', 'Wardrobe', 'Private Bathroom'] },
      { id: 'r5', type: 'double', capacity: 2, rent: 80000, available: 4, amenities: ['Fan', 'Study Table', 'Wardrobe'] },
    ],
    amenities: ['WiFi', 'Parking', 'Security', 'Power Backup', 'Borehole Water'],
    rating: 4.2,
    reviews: [
      { id: '3', studentName: 'Tawonga Mwale', rating: 4, comment: 'Value for money. Good location near shops and campus.', date: '2026-03-10' },
    ],
    createdAt: '2026-02-01',
  },
  {
    id: '3',
    landlordId: 'mock-landlord-2',
    name: 'Mzuzu University Lodge',
    description: 'Peaceful hostel in a secure neighborhood. Perfect study environment with modern facilities and beautiful mountain views. Ideal for Mzuzu University students.',
    address: 'Luwinga Area 2, Near Mzuzu University, Mzuzu',
    university: 'Mzuzu University',
    distance: 2.0,
    photos: ['https://images.unsplash.com/photo-1635151926449-b9e7e5246fa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3N0ZWwlMjBjb21tb24lMjBhcmVhJTIwbG91bmdlfGVufDF8fHx8MTc3NDQ1MDEwM3ww&ixlib=rb-4.1.0&q=80&w=1080'],
    rooms: [
      { id: 'r6', type: 'single', capacity: 1, rent: 130000, available: 1, amenities: ['Fan', 'Study Table', 'Wardrobe', 'Private Bathroom'] },
      { id: 'r7', type: 'shared', capacity: 3, rent: 70000, available: 6, amenities: ['Fan', 'Study Table', 'Wardrobe'] },
    ],
    amenities: ['WiFi', 'Study Room', 'Garden', 'Security', 'Kitchen', 'Backup Generator'],
    rating: 4.8,
    reviews: [
      { id: '4', studentName: 'Mphatso Chirwa', rating: 5, comment: 'Best hostel I have stayed in! Clean, peaceful, and very supportive landlord.', date: '2026-03-18' },
      { id: '5', studentName: 'Yamikani Gondwe', rating: 5, comment: 'Excellent facilities and safe environment. Highly recommend!', date: '2026-03-12' },
    ],
    createdAt: '2026-01-20',
  },
  {
    id: '4',
    landlordId: 'mock-landlord',
    name: 'LUANAR Bunda Campus Lodge',
    description: 'Spacious hostel located near Bunda Campus. Great for agriculture students with easy access to campus facilities and Lilongwe city.',
    address: 'Bunda Turn-off, Near LUANAR Campus, Lilongwe',
    university: 'Lilongwe University of Agriculture and Natural Resources (LUANAR)',
    distance: 1.0,
    photos: ['https://images.unsplash.com/photo-1615431303449-9ad9207d05de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3N0ZWwlMjBleHRlcmlvciUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3NDQ1MDEwM3ww&ixlib=rb-4.1.0&q=80&w=1080'],
    rooms: [
      { id: 'r8', type: 'single', capacity: 1, rent: 110000, available: 4, amenities: ['Fan', 'Study Table', 'Wardrobe'] },
      { id: 'r9', type: 'double', capacity: 2, rent: 85000, available: 3, amenities: ['Fan', 'Study Table', 'Wardrobe'] },
    ],
    amenities: ['WiFi', 'Security', 'Parking', 'Kitchen', 'Laundry', 'Water Supply'],
    rating: 4.3,
    reviews: [
      { id: '6', studentName: 'Kondwani Nkhoma', rating: 4, comment: 'Good hostel with helpful landlord. Close to campus and affordable.', date: '2026-03-05' },
    ],
    createdAt: '2026-01-25',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [landlord, setLandlord] = useState<Landlord | null>(null);

  const fetchProfile = async (userId: string) => {
    if (!userId) return null;

    // First try to get existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, name, email, phone, role')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('Profile fetch error:', fetchError);
    }

    if (existingProfile) {
      // Profile exists
      if (existingProfile.role !== 'landlord') {
        console.error('User is not a landlord');
        return null;
      }
      const landlordData: Landlord = {
        id: existingProfile.id,
        name: existingProfile.name,
        email: existingProfile.email,
        phone: existingProfile.phone || '',
      };
      setLandlord(landlordData);
      return landlordData;
    }

    // Profile doesn't exist, this might be a new user - but we shouldn't create it here
    // The profile should be created during signup process
    console.error('Profile not found for user:', userId);
    return null;
  };

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
        // Check if profile exists, if not create it
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single();

        if (!existingProfile) {
          // Try to get user metadata from auth
          const user = session.user;

          if (user?.user_metadata && user.user_metadata.role === 'landlord') {
            const { error: profileError } = await supabase.from('profiles').insert({
              id: userId,
              name: user.user_metadata.name || user.user_metadata.full_name || '',
              email: user.email || '',
              phone: user.user_metadata.phone || '',
              role: user.user_metadata.role,
            });

            if (profileError) {
              console.error('Creating profile on auth state change failed:', profileError);
            }
          }
        }

        await fetchProfile(userId);
      } else if (event === 'SIGNED_OUT') {
        setLandlord(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{success: boolean, error?: string}> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Supabase login failed:', error);
      return { success: false, error: error.message };
    }
    if (!data.user) {
      return { success: false, error: 'Login failed' };
    }

    const profile = await fetchProfile(data.user.id);
    if (!profile) {
      return { success: false, error: 'Account is not configured as a Landlord, or profile is missing.' };
    }
    return { success: true };
  };

  const signup = async (name: string, email: string, password: string, phone: string): Promise<{success: boolean, requireConfirmation?: boolean, error?: string}> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          role: 'landlord'
        }
      }
    });

    if (error) {
      console.error('Supabase signup failed:', error);
      return { success: false, error: error.message };
    }

    // If user is immediately authenticated (no email confirmation)
    if (data.user && data.session) {
      // User is authenticated, profile will be created in auth state change listener
      return { success: true };
    }

    // Email confirmation required or user not immediately authenticated
    return { success: true, requireConfirmation: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setLandlord(null);
  };

  return (
    <AuthContext.Provider value={{ landlord, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const normalizeHostel = (raw: any): Hostel => ({
    id: raw.id,
    landlordId: raw.landlord_id,
    name: raw.name,
    description: raw.description || '',
    address: raw.address,
    university: raw.university,
    distance: Number(raw.distance) || 0,
    photos: raw.photos || [],
    rooms: (raw.rooms || []).map((room: any) => ({
      id: room.id,
      type: room.type,
      capacity: room.capacity,
      rent: room.rent,
      available: room.available,
      amenities: room.amenities || [],
    })),
    amenities: raw.amenities || [],
    rating: Number(raw.rating) || 0,
    reviews: (raw.reviews || []).map((rev: any) => ({
      id: rev.id,
      studentName: rev.student_name,
      rating: rev.rating,
      comment: rev.comment || '',
      date: rev.created_at,
    })),
    createdAt: raw.created_at,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('hostels')
        .select('*, rooms(*), reviews(*)');

      if (error) {
        console.error('Failed to fetch hostels:', error);
        setHostels(mockHostels);
      } else {
        setHostels((data || []).map(normalizeHostel));
      }

      const { data: inquiriesData, error: inquiriesError } = await supabase
        .from('inquiries')
        .select('*');

      if (inquiriesError) {
        console.error('Failed to fetch inquiries:', inquiriesError);
        setInquiries([]);
      } else {
        setInquiries((inquiriesData || []).map((item: any) => ({
          id: item.id,
          hostelId: item.hostel_id,
          hostelName: '',
          studentName: item.student_name,
          studentEmail: item.student_email,
          studentPhone: item.student_phone || '',
          roomType: item.room_type || '',
          message: item.message || '',
          date: item.created_at,
        })));
      }
    };

    fetchData();
  }, []);

  const addHostel = async (hostel: Omit<Hostel, 'id' | 'createdAt' | 'rating' | 'reviews'>) => {
    const { data, error } = await supabase
      .from('hostels')
      .insert({
        landlord_id: hostel.landlordId,
        name: hostel.name,
        description: hostel.description,
        address: hostel.address,
        university: hostel.university,
        distance: hostel.distance,
        photos: hostel.photos,
        amenities: hostel.amenities,
      })
      .select('*')
      .single();

    if (error || !data) {
      console.error('Add hostel failed:', error);
      throw new Error(error?.message ?? 'Add hostel failed');
    }

    const hostelId = data.id;

    if (hostel.rooms?.length) {
      const roomsToInsert = hostel.rooms.map(room => ({
        hostel_id: hostelId,
        type: room.type,
        capacity: room.capacity,
        rent: room.rent,
        available: room.available,
        amenities: room.amenities || [],
      }));
      const { error: roomsError } = await supabase.from('rooms').insert(roomsToInsert);
      if (roomsError) {
        console.error('Insert rooms failed:', roomsError);
        throw new Error(roomsError.message);
      }
    }

    setHostels(prev => [...prev, { ...hostel, id: hostelId, createdAt: data.created_at, rating: data.rating || 0, reviews: [] }]);
  };

  const updateHostel = async (id: string, updates: Partial<Hostel>) => {
    const { data, error } = await supabase
      .from('hostels')
      .update({
        name: updates.name,
        description: updates.description,
        address: updates.address,
        university: updates.university,
        distance: updates.distance,
        photos: updates.photos,
        amenities: updates.amenities,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Update hostel failed:', error);
      throw new Error(error.message);
    }

    if (updates.rooms) {
      await supabase.from('rooms').delete().eq('hostel_id', id);
      const roomsToInsert = updates.rooms.map(room => ({
        hostel_id: id,
        type: room.type,
        capacity: room.capacity,
        rent: room.rent,
        available: room.available,
        amenities: room.amenities,
      }));
      const { error: roomsError } = await supabase.from('rooms').insert(roomsToInsert);
      if (roomsError) {
        console.error('Update rooms failed:', roomsError);
        throw new Error(roomsError.message);
      }
    }

    setHostels(prev => prev.map(h => h.id === id ? { ...h, ...updates, rating: data.rating ?? h.rating } : h));
  };

  const deleteHostel = async (id: string) => {
    const { error } = await supabase.from('hostels').delete().eq('id', id);
    if (error) {
      console.error('Delete hostel failed:', error);
      throw new Error(error.message);
    }
    setHostels(prev => prev.filter(h => h.id !== id));
  };

  const getHostelById = (id: string) => {
    return hostels.find(h => h.id === id);
  };

  const addInquiry = async (inquiry: Omit<Inquiry, 'id' | 'date'>) => {
    const { data, error } = await supabase
      .from('inquiries')
      .insert({
        hostel_id: inquiry.hostelId,
        student_id: '00000000-0000-0000-0000-000000000000', // placeholder until auth is integrated
        student_name: inquiry.studentName,
        student_email: inquiry.studentEmail,
        student_phone: inquiry.studentPhone,
        room_type: inquiry.roomType || null,
        message: inquiry.message || null,
      })
      .select('*')
      .single();

    if (error || !data) {
      console.error('Add inquiry failed:', error);
      throw new Error(error?.message ?? 'Unable to add inquiry');
    }

    setInquiries(prev => [...prev, {
      id: data.id,
      hostelId: data.hostel_id,
      hostelName: '',
      studentName: data.student_name,
      studentEmail: data.student_email,
      studentPhone: data.student_phone ?? '',
      roomType: data.room_type ?? '',
      message: data.message ?? '',
      date: data.created_at,
    }]);
  };

  const getInquiriesByLandlord = (landlordId: string) => {
    const landlordHostelIds = hostels.filter(h => h.landlordId === landlordId).map(h => h.id);
    return inquiries.filter(i => landlordHostelIds.includes(i.hostelId));
  };

  return (
    <DataContext.Provider value={{
      hostels,
      inquiries,
      addHostel,
      updateHostel,
      deleteHostel,
      getHostelById,
      addInquiry,
      getInquiriesByLandlord,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}