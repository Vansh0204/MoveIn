-- MoveIn Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Profiles Table (Extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'owner')),
  college_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Properties Table
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly INTEGER NOT NULL,
  address TEXT NOT NULL,
  coordinates POINT, -- For map integration
  images TEXT[] DEFAULT '{}',
  amenities JSONB DEFAULT '[]',
  safety_score INTEGER DEFAULT 0,
  beds_available INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  college_zones TEXT[] DEFAULT '{}', -- Nearby colleges
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Inquiries Table (Book a Visit)
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Wishlist Table
CREATE TABLE wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, property_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Anyone can view, only owner can update
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Properties: Anyone can view, only owners can insert/update their own
CREATE POLICY "Properties are viewable by everyone." ON properties FOR SELECT USING (true);
CREATE POLICY "Owners can insert their own properties." ON properties FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update their own properties." ON properties FOR UPDATE USING (auth.uid() = owner_id);

-- Inquiries: Students can view their own, Owners can view inquiries for their properties
CREATE POLICY "Students can view own inquiries." ON inquiries FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Owners can view inquiries for their properties." ON inquiries FOR SELECT USING (
  EXISTS (SELECT 1 FROM properties WHERE properties.id = inquiries.property_id AND properties.owner_id = auth.uid())
);
CREATE POLICY "Students can create inquiries." ON inquiries FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Wishlist: Only owner can view/modify
CREATE POLICY "Users can manage their own wishlist." ON wishlists FOR ALL USING (auth.uid() = user_id);
