# 🚀 Quick Start Guide - Supabase Setup

## Step 1: Set Up Database Tables

1. **Open your Supabase Dashboard**: https://supabase.com/dashboard/project/wazwpegjogtqtcjtqvsd
2. **Click "SQL Editor"** in the left sidebar
3. **Run these SQL files one by one** (copy and paste each file content, then click "Run"):

### File 1: `setup-database.sql`
```sql
-- Create custom types
CREATE TYPE field_status AS ENUM ('active', 'inactive', 'planned');
CREATE TYPE financial_type AS ENUM ('revenue', 'expense');

-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fields table
CREATE TABLE public.fields (
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

-- Create crop_history table
CREATE TABLE public.crop_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
  crop TEXT NOT NULL,
  yield DECIMAL(10,2) CHECK (yield >= 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial_records table
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

-- Create inventory table
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
```

### File 2: `setup-indexes.sql`
```sql
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
```

### File 3: `setup-triggers.sql`
```sql
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
```

### File 4: `setup-rls.sql`
```sql
-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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
```

## Step 2: Test Your Application

1. **Your app should be running at**: http://localhost:5173
2. **Create an account**: Click "Sign up" and create a test account
3. **Add a field**: Go to Fields page and click "Add a Field"
4. **Fill the form** and save - your data will be stored in Supabase!

## Step 3: Verify Database

1. **Go to Supabase Dashboard** → **Table Editor**
2. **You should see these tables**:
   - users
   - fields  
   - crop_history
   - financial_records
   - inventory
3. **Check that your test data appears** in the tables

## 🎉 You're Done!

Your agricultural management system now has:
- ✅ User authentication
- ✅ Database persistence  
- ✅ Field management
- ✅ Financial tracking
- ✅ Inventory management
- ✅ Secure data isolation

## 🐛 Troubleshooting

**If you get errors:**
1. Make sure you run the SQL files in the correct order
2. Check that all tables were created successfully
3. Verify your environment variables are set correctly
4. Restart your development server if needed

**Need help?** Check the browser console for any error messages!
