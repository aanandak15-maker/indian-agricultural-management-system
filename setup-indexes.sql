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
