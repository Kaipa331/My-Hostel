import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';

// Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'landlord' | 'admin';
}

export type Room = {
  id: string;
  type: 'single' | 'double' | 'shared';
  capacity: number;
  rent: number;
  available: number;
  amenities: string[];
};

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

export interface Booking {
  id: string;
  studentId: string;
  hostelId: string;
  roomId: string;
  totalRent: number;
  bookingFee: number;
  depositAmount: number;
  status: 'pending' | 'deposit_paid' | 'confirmed' | 'cancelled' | 'refunded';
  paymentMethod?: 'bank' | 'airtel_money' | 'mpamba';
  receiptUrl?: string;
  depositDeadline: string;
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
  signup: (name: string, email: string, password: string, phone: string, role: 'student' | 'landlord') => Promise<{success: boolean, requireConfirmation?: boolean, error?: string}>;
  logout: () => void;
}

interface DataContextType {
  hostels: Hostel[];
  inquiries: Inquiry[];
  bookings: Booking[];
  addHostel: (hostel: Omit<Hostel, 'id' | 'createdAt' | 'rating' | 'reviews'>) => Promise<void>;
  updateHostel: (id: string, hostel: Partial<Hostel>) => Promise<void>;
  deleteHostel: (id: string) => Promise<void>;
  getHostelById: (id: string) => Hostel | undefined;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'date'>) => Promise<void>;
  getInquiriesByLandlord: (landlordId: string) => Inquiry[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status' | 'depositDeadline'>) => Promise<string>;
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<void>;
  getBookingsByStudent: (studentId: string) => Booking[];
  getBookingsByLandlord: (landlordId: string) => Booking[];
  uploadReceipt: (bookingId: string, file: File) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DataContext = createContext<DataContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  const fetchProfile = async (userId: string) => {
    if (!userId) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, name, email, phone, role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Profile fetch error:', error);
      return null;
    }

    if (profile) {
      const userData: UserProfile = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone || '',
        role: profile.role as 'student' | 'landlord' | 'admin',
      };
      setUser(userData);
      return userData;
    }
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
        await fetchProfile(userId);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
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
      return { success: false, error: 'Profile not found.' };
    }
    return { success: true };
  };

  const signup = async (name: string, email: string, password: string, phone: string, role: 'student' | 'landlord'): Promise<{success: boolean, requireConfirmation?: boolean, error?: string}> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          role
        }
      }
    });

    if (error) {
      console.error('Supabase signup failed:', error);
      return { success: false, error: error.message };
    }

    if (data.user && data.session) {
      return { success: true };
    }

    return { success: true, requireConfirmation: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const normalizeBooking = (raw: any): Booking => ({
    id: raw.id,
    studentId: raw.student_id,
    hostelId: raw.hostel_id,
    roomId: raw.room_id,
    totalRent: Number(raw.total_rent),
    bookingFee: Number(raw.booking_fee),
    depositAmount: Number(raw.deposit_amount),
    status: raw.status,
    paymentMethod: raw.payment_method || undefined,
    receiptUrl: raw.receipt_url || undefined,
    depositDeadline: raw.deposit_deadline,
    createdAt: raw.created_at,
  });

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
      rent: Number(room.rent),
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
      } else {
        setHostels((data || []).map(normalizeHostel));
      }

      const { data: inquiriesData, error: inquiriesError } = await supabase
        .from('inquiries')
        .select('*');

      if (inquiriesError) {
        console.error('Failed to fetch inquiries:', inquiriesError);
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

      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*');

      if (bookingsError) {
        console.error('Failed to fetch bookings:', bookingsError);
      } else {
        setBookings((bookingsData || []).map(normalizeBooking));
      }
    };

    fetchData();
  }, []);

  const addHostel = async (hostel: Omit<Hostel, 'id' | 'createdAt' | 'rating' | 'reviews'>) => {
    const { data: newHostel, error } = await supabase
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

    if (error || !newHostel) {
      console.error('Add hostel failed:', error);
      throw new Error(error?.message ?? 'Add hostel failed');
    }

    const hostelId = newHostel.id;

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

    setHostels(prev => [...prev, { ...hostel, id: hostelId, createdAt: newHostel.created_at, rating: newHostel.rating || 0, reviews: [] }]);
  };

  const updateHostel = async (id: string, updates: Partial<Hostel>) => {
    const { data: updatedHostel, error } = await supabase
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

    setHostels(prev => prev.map(h => h.id === id ? { ...h, ...updates, rating: updatedHostel.rating ?? h.rating } : h));
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
    const { data: newInquiry, error } = await supabase
      .from('inquiries')
      .insert({
        hostel_id: inquiry.hostelId,
        student_id: '00000000-0000-0000-0000-000000000000', 
        student_name: inquiry.studentName,
        student_email: inquiry.studentEmail,
        student_phone: inquiry.studentPhone,
        room_type: inquiry.roomType as any,
        message: inquiry.message || null,
      })
      .select('*')
      .single();

    if (error || !newInquiry) {
      console.error('Add inquiry failed:', error);
      throw new Error(error?.message ?? 'Unable to add inquiry');
    }

    setInquiries(prev => [...prev, {
      id: newInquiry.id,
      hostelId: newInquiry.hostel_id,
      hostelName: '',
      studentName: newInquiry.student_name,
      studentEmail: newInquiry.student_email,
      studentPhone: newInquiry.student_phone ?? '',
      roomType: newInquiry.room_type ?? '',
      message: newInquiry.message ?? '',
      date: newInquiry.created_at,
    }]);
  };

  const getInquiriesByLandlord = (landlordId: string) => {
    const landlordHostelIds = hostels.filter(h => h.landlordId === landlordId).map(h => h.id);
    return inquiries.filter(i => landlordHostelIds.includes(i.hostelId));
  };

  const addBooking = async (booking: Omit<Booking, 'id' | 'createdAt' | 'status' | 'depositDeadline'>) => {
    const { data: newBooking, error } = await supabase
      .from('bookings')
      .insert({
        student_id: booking.studentId,
        hostel_id: booking.hostelId,
        room_id: booking.roomId,
        total_rent: booking.totalRent,
        booking_fee: booking.bookingFee,
        deposit_amount: booking.depositAmount,
        payment_method: booking.paymentMethod,
        receipt_url: booking.receiptUrl,
      })
      .select('*')
      .single();

    if (error || !newBooking) {
      console.error('Add booking failed:', error);
      throw new Error(error?.message ?? 'Add booking failed');
    }

    const bookingData = normalizeBooking(newBooking);
    setBookings(prev => [...prev, bookingData]);
    return bookingData.id;
  };

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update({
        status: updates.status,
        payment_method: updates.paymentMethod,
        receipt_url: updates.receiptUrl,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Update booking failed:', error);
      throw new Error(error.message);
    }

    setBookings(prev => prev.map(b => b.id === id ? normalizeBooking(updatedBooking) : b));
  };

  const getBookingsByStudent = (studentId: string) => {
    return bookings.filter(b => b.studentId === studentId);
  };

  const getBookingsByLandlord = (landlordId: string) => {
    const landlordHostelIds = hostels.filter(h => h.landlordId === landlordId).map(h => h.id);
    return bookings.filter(b => landlordHostelIds.includes(b.hostelId));
  };

  const uploadReceipt = async (bookingId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${bookingId}-${Date.now()}.${fileExt}`;
    const filePath = `receipts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('booking-receipts')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Receipt upload failed:', uploadError);
      throw new Error(uploadError.message);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('booking-receipts')
      .getPublicUrl(filePath);

    await updateBooking(bookingId, { receiptUrl: publicUrl, status: 'deposit_paid' });
    return publicUrl;
  };

  return (
    <DataContext.Provider value={{
      hostels,
      inquiries,
      bookings,
      addHostel,
      updateHostel,
      deleteHostel,
      getHostelById,
      addInquiry,
      getInquiriesByLandlord,
      addBooking,
      updateBooking,
      getBookingsByStudent,
      getBookingsByLandlord,
      uploadReceipt,
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