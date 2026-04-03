import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';

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

interface DataContextType {
  hostels: Hostel[];
  inquiries: Inquiry[];
  bookings: Booking[];
  addHostel: (hostel: Omit<Hostel, 'id' | 'createdAt' | 'rating' | 'reviews'>) => Promise<void>;
  updateHostel: (id: string, hostel: Partial<Hostel>) => Promise<void>;
  deleteHostel: (id: string) => Promise<void>;
  getHostelById: (id: string) => Hostel | undefined;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'date'> & { studentId?: string }) => Promise<void>;
  getInquiriesByLandlord: (landlordId: string) => Inquiry[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status' | 'depositDeadline'>) => Promise<string>;
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<void>;
  getBookingsByStudent: (studentId: string) => Booking[];
  getBookingsByLandlord: (landlordId: string) => Booking[];
  uploadReceipt: (bookingId: string, file: File) => Promise<string>;
}

const defaultDataContext: DataContextType = {
  hostels: [],
  inquiries: [],
  bookings: [],
  addHostel: async () => {},
  updateHostel: async () => {},
  deleteHostel: async () => {},
  getHostelById: () => undefined,
  addInquiry: async () => {},
  getInquiriesByLandlord: () => [],
  addBooking: async () => '',
  updateBooking: async () => {},
  getBookingsByStudent: () => [],
  getBookingsByLandlord: () => [],
  uploadReceipt: async () => '',
};

const DataContext = createContext<DataContextType>(defaultDataContext);

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
      try {
        const hostelsResult: any = await supabase
          .from('hostels')
          .select('*, rooms(*), reviews(*)');

        if (hostelsResult.data) {
          setHostels(hostelsResult.data.map(normalizeHostel));
        }

        const inquiriesResult: any = await supabase
          .from('inquiries')
          .select('*');

        if (inquiriesResult.data) {
          setInquiries(inquiriesResult.data.map((raw: any) => {
            const hostel = hostelsResult.data?.find((h: any) => h.id === raw.hostel_id);
            return {
              id: raw.id,
              hostelId: raw.hostel_id,
              hostelName: hostel?.name || 'Unknown Hostel',
              studentName: raw.student_name,
              studentEmail: raw.student_email,
              studentPhone: raw.student_phone || '',
              roomType: raw.room_type || '',
              message: raw.message || '',
              date: raw.created_at,
            };
          }));
        }

        const bookingsResult: any = await supabase
          .from('bookings')
          .select('*');

        if (bookingsResult.data) {
          setBookings(bookingsResult.data.map(normalizeBooking));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const addHostel = async (hostel: Omit<Hostel, 'id' | 'createdAt' | 'rating' | 'reviews'>) => {
    const hostelResult: any = await supabase
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
      } as any)
      .select('*')
      .single();

    if (hostelResult.error || !hostelResult.data) {
      throw new Error(hostelResult.error?.message || 'Failed to add hostel');
    }

    const roomsToInsert = hostel.rooms.map(room => ({
      hostel_id: hostelResult.data.id,
      type: room.type,
      capacity: room.capacity,
      rent: room.rent,
      available: room.available,
      amenities: room.amenities,
    }));

    const roomsResult: any = await supabase
      .from('rooms')
      .insert(roomsToInsert as any)
      .select('*');

    const completeHostel = normalizeHostel({ ...hostelResult.data, rooms: roomsResult.data || [], reviews: [] });
    setHostels(prev => [...prev, completeHostel]);
  };

  const updateHostel = async (id: string, updates: Partial<Hostel>) => {
    const result: any = await supabase
      .from('hostels')
      .update({
        name: updates.name,
        description: updates.description,
        address: updates.address,
        university: updates.university,
        distance: updates.distance,
        photos: updates.photos,
        amenities: updates.amenities,
      } as any)
      .eq('id', id)
      .select('*, rooms(*), reviews(*)')
      .single();

    if (result.error) {
      throw new Error(result.error.message);
    }

    setHostels(prev => prev.map(h => h.id === id ? normalizeHostel(result.data) : h));
  };

  const deleteHostel = async (id: string) => {
    const result: any = await supabase.from('hostels').delete().eq('id', id);
    if (result.error) throw new Error(result.error.message);
    setHostels(prev => prev.filter(h => h.id !== id));
  };

  const getHostelById = (id: string) => hostels.find(h => h.id === id);

  const addInquiry = async (inquiry: Omit<Inquiry, 'id' | 'date'> & { studentId?: string }) => {
    const result: any = await supabase
      .from('inquiries')
      .insert({
        hostel_id: inquiry.hostelId,
        student_id: inquiry.studentId, // Pass studentId if available
        student_name: inquiry.studentName,
        student_email: inquiry.studentEmail,
        student_phone: inquiry.studentPhone,
        room_type: inquiry.roomType,
        message: inquiry.message,
      } as any)
      .select('*')
      .single();

    if (result.error || !result.data) {
      console.error('Add inquiry failed:', result.error);
      throw new Error(result.error?.message ?? 'Unable to add inquiry');
    }

    setInquiries(prev => [...prev, {
      id: result.data.id,
      hostelId: result.data.hostel_id,
      hostelName: inquiry.hostelName,
      studentName: result.data.student_name,
      studentEmail: result.data.student_email,
      studentPhone: result.data.student_phone ?? '',
      roomType: result.data.room_type ?? '',
      message: result.data.message ?? '',
      date: result.data.created_at,
    }]);
  };

  const getInquiriesByLandlord = (landlordId: string) => {
    const landlordHostelIds = hostels.filter(h => h.landlordId === landlordId).map(h => h.id);
    return inquiries.filter(i => landlordHostelIds.includes(i.hostelId));
  };

  const addBooking = async (booking: Omit<Booking, 'id' | 'createdAt' | 'status' | 'depositDeadline'>) => {
    const result: any = await supabase
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
      } as any)
      .select('*')
      .single();

    if (result.error || !result.data) {
      console.error('Add booking failed:', result.error);
      throw new Error(result.error?.message ?? 'Add booking failed');
    }

    const bookingData = normalizeBooking(result.data);
    setBookings(prev => [...prev, bookingData]);
    return bookingData.id;
  };

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    const result: any = await supabase
      .from('bookings')
      .update({
        status: updates.status,
        payment_method: updates.paymentMethod,
        receipt_url: updates.receiptUrl,
      } as any)
      .eq('id', id)
      .select('*')
      .single();

    if (result.error) {
      console.error('Update booking failed:', result.error);
      throw new Error(result.error.message);
    }

    setBookings(prev => prev.map(b => b.id === id ? normalizeBooking(result.data) : b));
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
      hostels, inquiries, bookings,
      addHostel, updateHostel, deleteHostel, getHostelById,
      addInquiry, getInquiriesByLandlord,
      addBooking, updateBooking, getBookingsByStudent, getBookingsByLandlord,
      uploadReceipt
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  return context;
}
