# 🚨 LOGIN ISSUE - Setup Instructions

## Problem Identified
You cannot login because the database is not properly configured. Here's what's missing:

1. **Missing Supabase Environment Variables**
2. **Database Tables Not Created**
3. **No Sample Employee Data**

## 🔧 Quick Fix (5 minutes)

### Step 1: Get Supabase Credentials
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in to your account
3. Select your project (or create a new one)
4. Go to **Settings** → **API**
5. Copy these two values:
   - **Project URL** (looks like: `https://your-project-ref.supabase.co`)
   - **Anon Key** (long string starting with `eyJ...`)

### Step 2: Update Environment File
1. Open `.env.local` in your project
2. Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### Step 3: Create Database Tables
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click **SQL Editor** → **New Query**
4. Copy and paste this SQL:

```sql
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

-- Create consolidated_files table
CREATE TABLE IF NOT EXISTS consolidated_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  uploaded_by VARCHAR(255) NOT NULL,
  employee_id VARCHAR(50) NOT NULL,
  original_file_name VARCHAR(255),
  row_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT TRUE,
  created_by_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_consolidated_files_created_at 
ON consolidated_files(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_consolidated_files_employee_id 
ON consolidated_files(employee_id);

CREATE INDEX IF NOT EXISTS idx_consolidated_files_is_public 
ON consolidated_files(is_public);

-- Enable RLS (Row Level Security)
ALTER TABLE consolidated_files ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read public files
CREATE POLICY "Allow all users to read public consolidated files"
ON consolidated_files
FOR SELECT
USING (is_public = TRUE);

-- Create policy to allow users to insert their own files
CREATE POLICY "Allow users to insert their own consolidated files"
ON consolidated_files
FOR INSERT
WITH CHECK (TRUE);

-- Create policy to allow users to update their own files
CREATE POLICY "Allow users to update their own consolidated files"
ON consolidated_files
FOR UPDATE
USING (TRUE)
WITH CHECK (TRUE);

-- Create policy to allow users to delete their own files
CREATE POLICY "Allow users to delete their own consolidated files"
ON consolidated_files
FOR DELETE
USING (TRUE);
```

5. Click **Run** to execute the SQL

### Step 4: Test Login
1. Start your development server:
   ```bash
   npm run dev
   ```
2. Go to the login page
3. Try logging in with one of these test accounts:
   - **Employee ID**: `Ops1234` → **Name**: Juan dela Cruz
   - **Employee ID**: `Ops5678` → **Name**: Maria Santos
   - **Employee ID**: `Ops9012` → **Name**: Carlos Rodriguez

## ✅ Verification

After setup, you should be able to:
1. ✅ Login with any of the test employee IDs
2. ✅ See the dashboard with the new design
3. ✅ Upload files and see them in the "Uploaded Files" tab
4. ✅ View the overview cards and charts

## 🆘 Still Having Issues?

### Check Environment Variables
Make sure your `.env.local` file has the correct format:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Check Database Tables
1. Go to Supabase Dashboard → **Table Editor**
2. You should see two tables:
   - `employees` (with 5 sample records)
   - `consolidated_files` (empty initially)

### Check Browser Console
1. Open browser developer tools (F12)
2. Look for any error messages
3. Check the Network tab for failed API calls

### Test API Directly
Open browser console and run:
```javascript
fetch('/api/users').then(r => r.json()).then(console.log)
```
Should return an array of employee objects.

## 📞 Need Help?

If you're still having issues:
1. Check the browser console for error messages
2. Verify your Supabase project is active
3. Make sure the environment variables are correctly set
4. Ensure the database tables were created successfully

The login system uses a simple employee ID lookup, so once the database is set up with the sample data, you should be able to login immediately!
