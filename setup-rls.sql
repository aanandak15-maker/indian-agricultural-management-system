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
