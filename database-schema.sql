-- Create custom types
CREATE TYPE field_status AS ENUM ('active', 'inactive', 'planned');
CREATE TYPE financial_type AS ENUM ('revenue', 'expense');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fields table
CREATE TABLE public.fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  area DECIMAL(10,2) NOT NULL CHECK (area > 0),
  crop TEXT,
  status field_status DEFAULT 'planned',
  soil_type TEXT,
  coordinates JSONB, -- {lat: number, lng: number}
  irrigation TEXT,
  planting_date DATE,
  harvest_date DATE,
  rainfall INTEGER CHECK (rainfall >= 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crop history table
CREATE TABLE public.crop_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
  crop TEXT NOT NULL,
  yield DECIMAL(10,2) CHECK (yield >= 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial records table
CREATE TABLE public.financial_records (
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

-- Inventory table
CREATE TABLE public.inventory (
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

-- Create indexes for better performance
CREATE INDEX idx_fields_user_id ON public.fields(user_id);
CREATE INDEX idx_fields_status ON public.fields(status);
CREATE INDEX idx_crop_history_field_id ON public.crop_history(field_id);
CREATE INDEX idx_crop_history_year ON public.crop_history(year);
CREATE INDEX idx_financial_records_user_id ON public.financial_records(user_id);
CREATE INDEX idx_financial_records_date ON public.financial_records(date);
CREATE INDEX idx_financial_records_type ON public.financial_records(type);
CREATE INDEX idx_inventory_user_id ON public.inventory(user_id);
CREATE INDEX idx_inventory_category ON public.inventory(category);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fields_updated_at BEFORE UPDATE ON public.fields
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Fields policies
CREATE POLICY "Users can view own fields" ON public.fields
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own fields" ON public.fields
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own fields" ON public.fields
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own fields" ON public.fields
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Crop history policies
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

-- Financial records policies
CREATE POLICY "Users can view own financial records" ON public.financial_records
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own financial records" ON public.financial_records
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own financial records" ON public.financial_records
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own financial records" ON public.financial_records
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Inventory policies
CREATE POLICY "Users can view own inventory" ON public.inventory
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own inventory" ON public.inventory
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own inventory" ON public.inventory
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own inventory" ON public.inventory
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Insert sample data (optional - for testing)
INSERT INTO public.users (id, email, name) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'demo@agridom.com', 'Demo Farmer');

-- Sample fields data
INSERT INTO public.fields (user_id, name, area, crop, status, soil_type, coordinates, irrigation, planting_date, harvest_date, rainfall, notes) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'North Punjab', 12.5, 'Sugarcane', 'active', 'Argilo-calcaire', '{"lat": 16.3772, "lng": -61.4483}', 'Drip irrigation', '2023-02-15', '2024-02-15', 1200, 'Main field for sugarcane production'),
  ('00000000-0000-0000-0000-000000000001', 'Maharashtra Sud', 8.3, 'Cotton', 'active', 'Volcanique', '{"lat": 16.0220, "lng": -61.7425}', 'Aspersion', '2023-04-10', '2023-12-10', 2500, 'Cotton field with good irrigation'),
  ('00000000-0000-0000-0000-000000000001', 'Capesterre', 15.7, 'Rice', 'active', 'Volcanique', '{"lat": 16.0504, "lng": -61.5643}', 'Drip irrigation', '2023-05-20', '2024-01-20', 2300, 'Rice cultivation field');

-- Sample crop history
INSERT INTO public.crop_history (field_id, year, crop, yield, notes) VALUES 
  ((SELECT id FROM public.fields WHERE name = 'North Punjab' LIMIT 1), 2022, 'Sugarcane', 8.2, 'Good yield despite dry season'),
  ((SELECT id FROM public.fields WHERE name = 'North Punjab' LIMIT 1), 2021, 'Wheat', 7.5, 'Standard yield'),
  ((SELECT id FROM public.fields WHERE name = 'Maharashtra Sud' LIMIT 1), 2022, 'Cotton', 15.3, 'Excellent cotton yield');

-- Sample financial records
INSERT INTO public.financial_records (user_id, field_id, type, amount, description, date, category) VALUES 
  ('00000000-0000-0000-0000-000000000001', (SELECT id FROM public.fields WHERE name = 'North Punjab' LIMIT 1), 'revenue', 15000, 'Sugarcane harvest sale', '2023-06-15', 'Crop Sales'),
  ('00000000-0000-0000-0000-000000000001', (SELECT id FROM public.fields WHERE name = 'North Punjab' LIMIT 1), 'expense', 5000, 'Purchase fertilizers', '2023-05-10', 'Inputs'),
  ('00000000-0000-0000-0000-000000000001', (SELECT id FROM public.fields WHERE name = 'Maharashtra Sud' LIMIT 1), 'revenue', 8500, 'Cotton sale', '2023-07-20', 'Crop Sales');

-- Sample inventory
INSERT INTO public.inventory (user_id, name, category, quantity, unit, price) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'NPK Fertilizer', 'Inputs', 500, 'kg', 2.5),
  ('00000000-0000-0000-0000-000000000001', 'Bio Pesticide', 'Inputs', 50, 'L', 18.75),
  ('00000000-0000-0000-0000-000000000001', 'Tractor', 'Equipment', 2, 'units', 25000);
