-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profiles Table (Linked to Auth.Users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'driver' CHECK (role IN ('admin', 'driver')),
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Drivers Table (Extended KYC Info)
CREATE TABLE public.drivers (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_type TEXT,
  vehicle_number TEXT,
  license_number TEXT,
  aadhaar_number TEXT,
  aadhaar_front_url TEXT,
  aadhaar_back_url TEXT,
  driver_photo_url TEXT,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  is_online BOOLEAN DEFAULT FALSE,
  last_location_lat FLOAT,
  last_location_lng FLOAT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Cab Types Table
CREATE TABLE public.cab_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  base_fare NUMERIC NOT NULL,
  price_per_km NUMERIC NOT NULL,
  min_fare NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Trips (Leads) Table
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pickup_location TEXT NOT NULL,
  drop_location TEXT NOT NULL,
  pickup_lat FLOAT,
  pickup_lng FLOAT,
  drop_lat FLOAT,
  drop_lng FLOAT,
  distance_km FLOAT,
  estimated_fare NUMERIC,
  lead_fee NUMERIC,
  status TEXT DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'ACCEPTED', 'PAID', 'STARTED', 'COMPLETED')),
  customer_name TEXT,
  customer_phone TEXT,
  accepted_driver_id UUID REFERENCES public.drivers(id),
  details_unlocked BOOLEAN DEFAULT FALSE,
  payment_status TEXT DEFAULT 'pending',
  start_otp TEXT,
  drop_otp TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Global Settings Table
CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Trigger for Profile Creation on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email, COALESCE(new.raw_user_meta_data->>'role', 'driver'));
  
  IF (COALESCE(new.raw_user_meta_data->>'role', 'driver') = 'driver') THEN
    INSERT INTO public.drivers (id) VALUES (new.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. Seed Cab Types
INSERT INTO public.cab_types (name, base_fare, price_per_km, min_fare) VALUES
('Sedan', 100, 15, 150),
('Mini', 60, 12, 100),
('Suv', 150, 20, 250);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cab_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Adjust as needed)
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profiles." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public cab types are viewable by everyone." ON public.cab_types FOR SELECT USING (true);

CREATE POLICY "Trips are viewable by everyone." ON public.trips FOR SELECT USING (true);
CREATE POLICY "Drivers can update trips they accepted." ON public.trips FOR UPDATE USING (auth.uid() = accepted_driver_id);
