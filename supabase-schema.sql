-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE room_type AS ENUM ('single', 'double', 'shared');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'landlord', 'admin')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  university TEXT,
  student_id TEXT,
  saved_hostels UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Hostels table
CREATE TABLE hostels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  landlord_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  university TEXT NOT NULL,
  distance DECIMAL(4,2), -- in km
  photos TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Rooms table
CREATE TABLE rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hostel_id UUID REFERENCES hostels(id) ON DELETE CASCADE NOT NULL,
  type room_type NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  rent INTEGER NOT NULL CHECK (rent > 0), -- in MWK
  available INTEGER NOT NULL DEFAULT 0 CHECK (available >= 0),
  amenities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hostel_id UUID REFERENCES hostels(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  student_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(hostel_id, student_id)
);

-- Inquiries table
CREATE TABLE inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hostel_id UUID REFERENCES hostels(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_phone TEXT,
  room_type room_type,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX idx_hostels_landlord_id ON hostels(landlord_id);
CREATE INDEX idx_hostels_university ON hostels(university);
CREATE INDEX idx_rooms_hostel_id ON rooms(hostel_id);
CREATE INDEX idx_reviews_hostel_id ON reviews(hostel_id);
CREATE INDEX idx_reviews_student_id ON reviews(student_id);
CREATE INDEX idx_inquiries_hostel_id ON inquiries(hostel_id);
CREATE INDEX idx_inquiries_student_id ON inquiries(student_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hostels_updated_at BEFORE UPDATE ON hostels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update hostel rating
CREATE OR REPLACE FUNCTION update_hostel_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE hostels
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM reviews
    WHERE hostel_id = COALESCE(NEW.hostel_id, OLD.hostel_id)
  )
  WHERE id = COALESCE(NEW.hostel_id, OLD.hostel_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Rating triggers
CREATE TRIGGER update_hostel_rating_on_insert AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_hostel_rating();

CREATE TRIGGER update_hostel_rating_on_update AFTER UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_hostel_rating();

CREATE TRIGGER update_hostel_rating_on_delete AFTER DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_hostel_rating();

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostels ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies (your policies look good — they use auth.uid() correctly)
-- Profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Hostels
CREATE POLICY "Anyone can view hostels" ON hostels FOR SELECT USING (true);

CREATE POLICY "Landlords can insert their own hostels" ON hostels
  FOR INSERT WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update their own hostels" ON hostels
  FOR UPDATE USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete their own hostels" ON hostels
  FOR DELETE USING (auth.uid() = landlord_id);

-- Rooms (your policy is fine)
CREATE POLICY "Anyone can view rooms" ON rooms FOR SELECT USING (true);

CREATE POLICY "Landlords can manage rooms in their hostels" ON rooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM hostels
      WHERE hostels.id = rooms.hostel_id
      AND hostels.landlord_id = auth.uid()
    )
  );

-- Reviews
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Users can delete their own reviews" ON reviews
  FOR DELETE USING (auth.uid() = student_id);

-- Inquiries
CREATE POLICY "Students can view their own inquiries" ON inquiries
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Landlords can view inquiries for their hostels" ON inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM hostels
      WHERE hostels.id = inquiries.hostel_id
      AND hostels.landlord_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Landlords can update inquiries for their hostels" ON inquiries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM hostels
      WHERE hostels.id = inquiries.hostel_id
      AND hostels.landlord_id = auth.uid()
    )
  );

-- Handle new user signup (your function is good)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, role, university, student_id)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NEW.raw_user_meta_data->>'university',
    NEW.raw_user_meta_data->>'student_id'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();