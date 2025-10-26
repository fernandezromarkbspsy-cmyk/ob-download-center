-- Create employees table for employee ID and name lookup
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view employees (for login lookup)
CREATE POLICY "Allow public to view employees"
  ON public.employees FOR SELECT
  USING (true);

-- Insert sample employees
INSERT INTO public.employees (employee_id, full_name) VALUES
  ('Ops1234', 'Juan dela Cruz'),
  ('Ops5678', 'Maria Santos'),
  ('Ops9012', 'Carlos Rodriguez'),
  ('Ops3456', 'Ana Garcia'),
  ('Ops7890', 'Miguel Lopez')
ON CONFLICT (employee_id) DO NOTHING;
