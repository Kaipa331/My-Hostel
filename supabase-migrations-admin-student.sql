-- SQL Migration to support Admin & Student Components
-- Run this exactly once in your Supabase SQL Editor

-- 1. Add fields for Landlord approval tracking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- 2. Add fields for Student data
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS saved_hostels UUID[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS university TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS student_id TEXT;

-- 3. Update the role constraint to support admin accounts
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('student', 'landlord', 'admin'));

-- Note: We shouldn't change the handle_new_user() trigger for saved_hostels 
-- because the default '{}' creates the empty array immediately on insertion.
