-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    hostel_id UUID REFERENCES public.hostels(id) ON DELETE CASCADE NOT NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
    total_rent INTEGER NOT NULL,
    booking_fee INTEGER NOT NULL,
    deposit_amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'deposit_paid', 'confirmed', 'cancelled', 'refunded')),
    payment_method TEXT CHECK (payment_method IN ('bank', 'airtel_money', 'mpamba')),
    receipt_url TEXT,
    deposit_deadline TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '48 hours'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Students can view their own bookings" 
    ON public.bookings FOR SELECT 
    USING (auth.uid() = student_id);

CREATE POLICY "Students can create their own bookings" 
    ON public.bookings FOR INSERT 
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own pending bookings" 
    ON public.bookings FOR UPDATE 
    USING (auth.uid() = student_id AND status = 'pending');

CREATE POLICY "Landlords can view bookings for their hostels" 
    ON public.bookings FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.hostels
            WHERE public.hostels.id = public.bookings.hostel_id
            AND public.hostels.landlord_id = auth.uid()
        )
    );

CREATE POLICY "Landlords can update bookings for their hostels" 
    ON public.bookings FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.hostels
            WHERE public.hostels.id = public.bookings.hostel_id
            AND public.hostels.landlord_id = auth.uid()
        )
    );

-- Create trigger for updated_at
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Instructions for Storage Bucket (Manual setup in Supabase Dashboard):
-- 1. Create a new public bucket named 'booking-receipts'
-- 2. Set 'Public' to true or keep it private and use signed URLs (public is easier for this MVP).
