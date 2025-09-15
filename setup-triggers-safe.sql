-- Create updated_at trigger function (only if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at (only if they don't exist)
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
