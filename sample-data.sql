-- Insert sample data for testing (optional)
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
