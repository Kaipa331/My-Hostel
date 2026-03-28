// Database types generated from Supabase schema
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          role: 'student' | 'landlord' | 'admin'
          status: 'pending' | 'approved' | 'rejected'
          university: string | null
          student_id: string | null
          saved_hostels: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          phone?: string | null
          role?: 'student' | 'landlord' | 'admin'
          status?: 'pending' | 'approved' | 'rejected'
          university?: string | null
          student_id?: string | null
          saved_hostels?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          role?: 'student' | 'landlord' | 'admin'
          status?: 'pending' | 'approved' | 'rejected'
          university?: string | null
          student_id?: string | null
          saved_hostels?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      hostels: {
        Row: {
          id: string
          landlord_id: string
          name: string
          description: string | null
          address: string
          university: string
          distance: number | null
          photos: string[]
          amenities: string[]
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          landlord_id: string
          name: string
          description?: string | null
          address: string
          university: string
          distance?: number | null
          photos?: string[]
          amenities?: string[]
          rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          landlord_id?: string
          name?: string
          description?: string | null
          address?: string
          university?: string
          distance?: number | null
          photos?: string[]
          amenities?: string[]
          rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          hostel_id: string
          type: 'single' | 'double' | 'shared'
          capacity: number
          rent: number
          available: number
          amenities: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hostel_id: string
          type: 'single' | 'double' | 'shared'
          capacity: number
          rent: number
          available?: number
          amenities?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hostel_id?: string
          type?: 'single' | 'double' | 'shared'
          capacity?: number
          rent?: number
          available?: number
          amenities?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          hostel_id: string
          student_id: string
          student_name: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hostel_id: string
          student_id: string
          student_name: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hostel_id?: string
          student_id?: string
          student_name?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          hostel_id: string
          student_id: string
          student_name: string
          student_email: string
          student_phone: string | null
          room_type: 'single' | 'double' | 'shared' | null
          message: string | null
          status: 'pending' | 'responded' | 'closed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hostel_id: string
          student_id: string
          student_name: string
          student_email: string
          student_phone?: string | null
          room_type?: 'single' | 'double' | 'shared' | null
          message?: string | null
          status?: 'pending' | 'responded' | 'closed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hostel_id?: string
          student_id?: string
          student_name?: string
          student_email?: string
          student_phone?: string | null
          room_type?: 'single' | 'double' | 'shared' | null
          message?: string | null
          status?: 'pending' | 'responded' | 'closed'
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          student_id: string
          hostel_id: string
          room_id: string
          total_rent: number
          booking_fee: number
          deposit_amount: number
          status: 'pending' | 'deposit_paid' | 'confirmed' | 'cancelled' | 'refunded'
          payment_method: 'bank' | 'airtel_money' | 'mpamba' | null
          receipt_url: string | null
          deposit_deadline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          hostel_id: string
          room_id: string
          total_rent: number
          booking_fee: number
          deposit_amount: number
          status?: 'pending' | 'deposit_paid' | 'confirmed' | 'cancelled' | 'refunded'
          payment_method?: 'bank' | 'airtel_money' | 'mpamba' | null
          receipt_url?: string | null
          deposit_deadline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          hostel_id?: string
          room_id?: string
          total_rent?: number
          booking_fee?: number
          deposit_amount?: number
          status?: 'pending' | 'deposit_paid' | 'confirmed' | 'cancelled' | 'refunded'
          payment_method?: 'bank' | 'airtel_money' | 'mpamba' | null
          receipt_url?: string | null
          deposit_deadline?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      room_type: 'single' | 'double' | 'shared'
    }
  }
}

// Helper types for easier use
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Hostel = Database['public']['Tables']['hostels']['Row']
export type Room = Database['public']['Tables']['rooms']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Inquiry = Database['public']['Tables']['inquiries']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']

export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type HostelInsert = Database['public']['Tables']['hostels']['Insert']
export type RoomInsert = Database['public']['Tables']['rooms']['Insert']
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
export type InquiryInsert = Database['public']['Tables']['inquiries']['Insert']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']

export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type HostelUpdate = Database['public']['Tables']['hostels']['Update']
export type RoomUpdate = Database['public']['Tables']['rooms']['Update']
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update']
export type InquiryUpdate = Database['public']['Tables']['inquiries']['Update']
export type BookingUpdate = Database['public']['Tables']['bookings']['Update']