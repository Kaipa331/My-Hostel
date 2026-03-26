-- =============================================
-- Seed data for development - Run AFTER schema setup
-- =============================================

-- Temporarily bypass foreign keys and triggers for seeding
SET session_replication_role = replica;

-- Clear existing data first (optional but recommended for clean resets)
DELETE FROM inquiries;
DELETE FROM reviews;
DELETE FROM rooms;
DELETE FROM hostels;
DELETE FROM profiles;

-- Insert sample profiles (these IDs must match auth.users if you create real users)
INSERT INTO profiles (id, name, email, phone, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'John Landlord', 'john@example.com', '+265999123456', 'landlord'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Mary Property Manager', 'mary@example.com', '+265999123457', 'landlord'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Alice Student', 'alice@student.edu', '+265999123458', 'student'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Bob Student', 'bob@student.edu', '+265999123459', 'student')
ON CONFLICT (id) DO NOTHING;

-- Insert sample hostels
INSERT INTO hostels (id, landlord_id, name, description, address, university, distance, photos, amenities, rating) VALUES
  ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Chancellor College Heights',
   'Modern hostel with excellent facilities, just 10 minutes walk from Chancellor College.',
   'Chirunga Road, Near Chancellor College, Zomba', 'University of Malawi (UNIMA)', 0.8,
   ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
   ARRAY['WiFi', 'Laundry', 'Common Room', 'Security', 'Kitchen', 'Water Supply'], 4.5),

  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Polytechnic View Hostel',
   'Affordable accommodation for Polytechnic students.',
   'Chancellor College Area, Zomba', 'University of Malawi (UNIMA)', 1.2,
   ARRAY['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
   ARRAY['WiFi', 'Study Area', 'Security', 'Water Supply'], 4.2)
ON CONFLICT (id) DO NOTHING;

-- Insert sample rooms
INSERT INTO rooms (hostel_id, type, capacity, rent, available, amenities) VALUES
  ('660e8400-e29b-41d4-a716-446655440000', 'single', 1, 120000, 3, ARRAY['Fan', 'Study Table', 'Wardrobe']),
  ('660e8400-e29b-41d4-a716-446655440000', 'double', 2, 90000, 5, ARRAY['Fan', 'Study Table', 'Wardrobe']),
  ('660e8400-e29b-41d4-a716-446655440000', 'shared', 4, 60000, 8, ARRAY['Fan', 'Study Table']),

  ('660e8400-e29b-41d4-a716-446655440001', 'single', 1, 100000, 2, ARRAY['Fan', 'Study Table', 'Wardrobe']),
  ('660e8400-e29b-41d4-a716-446655440001', 'double', 2, 75000, 4, ARRAY['Fan', 'Study Table']),
  ('660e8400-e29b-41d4-a716-446655440001', 'shared', 6, 50000, 12, ARRAY['Fan'])
ON CONFLICT DO NOTHING;   -- rooms has no unique id, so this won't do much, but harmless

-- Insert sample reviews
INSERT INTO reviews (hostel_id, student_id, student_name, rating, comment) VALUES
  ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'Alice Student', 5, 'Great place! Clean and close to campus.'),
  ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', 'Bob Student', 4, 'Good facilities and quiet.'),
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Alice Student', 4, 'Affordable and clean.')
ON CONFLICT (hostel_id, student_id) DO NOTHING;

-- Insert sample inquiries
INSERT INTO inquiries (hostel_id, student_id, student_name, student_email, student_phone, room_type, message) VALUES
  ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'Alice Student',
   'alice@student.edu', '+265999123458', 'single', 'Interested in a single room for next semester. Still available?'),
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Bob Student',
   'bob@student.edu', '+265999123459', 'double', 'Looking for double room for me and my roommate.')
ON CONFLICT DO NOTHING;

-- Re-enable normal behavior
SET session_replication_role = DEFAULT;

-- Optional: Refresh ratings (in case trigger didn't fire)
UPDATE hostels 
SET rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE reviews.hostel_id = hostels.id);