-- Create custom types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE field_status AS ENUM ('active', 'inactive', 'planned');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE financial_type AS ENUM ('revenue', 'expense');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create users table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fields table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  area DECIMAL(10,2) NOT NULL CHECK (area > 0),
  crop TEXT,
  status field_status DEFAULT 'planned',
  soil_type TEXT,
  coordinates JSONB,
  irrigation TEXT,
  planting_date DATE,
  harvest_date DATE,
  rainfall INTEGER CHECK (rainfall >= 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create crop_history table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.crop_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
  crop TEXT NOT NULL,
  yield DECIMAL(10,2) CHECK (yield >= 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial_records table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.financial_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  field_id UUID REFERENCES public.fields(id) ON DELETE SET NULL,
  type financial_type NOT NULL,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  description TEXT,
  date DATE NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL CHECK (quantity >= 0),
  unit TEXT NOT NULL,
  price DECIMAL(10,2) CHECK (price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
