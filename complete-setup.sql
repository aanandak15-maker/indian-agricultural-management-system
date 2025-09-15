-- Complete Supabase Setup - Safe to run multiple times
-- This file creates everything needed for the agricultural management system

-- 1. Create custom types (only if they don't exist)
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

-- 2. Create tables (only if they don't exist)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS public.crop_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
  crop TEXT NOT NULL,
  yield DECIMAL(10,2) CHECK (yield >= 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- 3. Create indexes (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_fields_user_id ON public.fields(user_id);
CREATE INDEX IF NOT EXISTS idx_fields_status ON public.fields(status);
CREATE INDEX IF NOT EXISTS idx_crop_history_field_id ON public.crop_history(field_id);
CREATE INDEX IF NOT EXISTS idx_crop_history_year ON public.crop_history(year);
CREATE INDEX IF NOT EXISTS idx_financial_records_user_id ON public.financial_records(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_records_date ON public.financial_records(date);
CREATE INDEX IF NOT EXISTS idx_financial_records_type ON public.financial_records(type);
CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON public.inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON public.inventory(category);

-- 4. Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Create triggers (only if they don't exist)
DO $$ BEGIN
    CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_fields_updated_at BEFORE UPDATE ON public.fields
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 6. Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- 7. Drop existing policies and recreate them
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own fields" ON public.fields;
DROP POLICY IF EXISTS "Users can insert own fields" ON public.fields;
DROP POLICY IF EXISTS "Users can update own fields" ON public.fields;
DROP POLICY IF EXISTS "Users can delete own fields" ON public.fields;
DROP POLICY IF EXISTS "Users can view crop history for own fields" ON public.crop_history;
DROP POLICY IF EXISTS "Users can insert crop history for own fields" ON public.crop_history;
DROP POLICY IF EXISTS "Users can update crop history for own fields" ON public.crop_history;
DROP POLICY IF EXISTS "Users can delete crop history for own fields" ON public.crop_history;
DROP POLICY IF EXISTS "Users can view own financial records" ON public.financial_records;
DROP POLICY IF EXISTS "Users can insert own financial records" ON public.financial_records;
DROP POLICY IF EXISTS "Users can update own financial records" ON public.financial_records;
DROP POLICY IF EXISTS "Users can delete own financial records" ON public.financial_records;
DROP POLICY IF EXISTS "Users can view own inventory" ON public.inventory;
DROP POLICY IF EXISTS "Users can insert own inventory" ON public.inventory;
DROP POLICY IF EXISTS "Users can update own inventory" ON public.inventory;
DROP POLICY IF EXISTS "Users can delete own inventory" ON public.inventory;

-- 8. Create RLS policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own fields" ON public.fields
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own fields" ON public.fields
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own fields" ON public.fields
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own fields" ON public.fields
  FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view crop history for own fields" ON public.crop_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.fields 
      WHERE fields.id = crop_history.field_id 
      AND fields.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert crop history for own fields" ON public.crop_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.fields 
      WHERE fields.id = crop_history.field_id 
      AND fields.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can update crop history for own fields" ON public.crop_history
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.fields 
      WHERE fields.id = crop_history.field_id 
      AND fields.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete crop history for own fields" ON public.crop_history
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.fields 
      WHERE fields.id = crop_history.field_id 
      AND fields.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can view own financial records" ON public.financial_records
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own financial records" ON public.financial_records
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own financial records" ON public.financial_records
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own financial records" ON public.financial_records
  FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own inventory" ON public.inventory
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own inventory" ON public.inventory
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own inventory" ON public.inventory
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own inventory" ON public.inventory
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Setup complete! Your agricultural management system is ready.
