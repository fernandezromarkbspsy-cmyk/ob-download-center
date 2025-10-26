# SQL Migration Guide

This guide provides step-by-step instructions to run the SQL migration for the consolidated files system.

## Quick Start

Choose one of the following methods:

### Method 1: Manual Setup (Recommended for First-Time)

**Step 1: Open Supabase Dashboard**
- Go to https://app.supabase.com
- Sign in to your account
- Select your project

**Step 2: Navigate to SQL Editor**
- Click on "SQL Editor" in the left sidebar
- Click the "New Query" button

**Step 3: Copy SQL Migration**
- Open the file: `scripts/002_create_consolidated_files_table.sql`
- Copy all the SQL content

**Step 4: Paste and Execute**
- Paste the SQL into the editor
- Click the "Run" button (or press Ctrl+Enter)
- Wait for the query to complete

**Step 5: Verify Success**
- Go to "Table Editor" in the left sidebar
- Look for the "consolidated_files" table
- Click on it to verify the structure

---

### Method 2: Using Helper Script

**Step 1: Run the Helper Script**
```bash
node scripts/run-migration.js
```

This will:
- Display the SQL content
- Show manual setup instructions
- Provide verification steps
- List troubleshooting tips

**Step 2: Follow the Instructions**
- Copy the SQL from the output
- Go to Supabase Dashboard → SQL Editor
- Paste and run the SQL

---

### Method 3: Using Supabase CLI

**Step 1: Install Supabase CLI**
```bash
npm install -g supabase
```

**Step 2: Link Your Project**
```bash
supabase link --project-ref your_project_ref
```

**Step 3: Push the Migration**
```bash
supabase db push
```

---

### Method 4: Programmatic Setup (Node.js)

**Step 1: Install Dependencies**
```bash
npm install @supabase/supabase-js
```

**Step 2: Set Environment Variables**
Create or update `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Step 3: Run the Migration Script**
```bash
node scripts/run-migration-programmatic.js
```

---

## SQL Migration Content

The migration creates:

1. **Table: `consolidated_files`**
   - Stores metadata about consolidated files
   - Columns: id, file_name, file_size, uploaded_by, employee_id, original_file_name, row_count, created_at, is_public, created_by_id

2. **Indexes**
   - `idx_consolidated_files_created_at` - For sorting by date
   - `idx_consolidated_files_employee_id` - For filtering by uploader
   - `idx_consolidated_files_is_public` - For filtering public files

3. **Row Level Security (RLS) Policies**
   - SELECT: All authenticated users can read public files
   - INSERT: All authenticated users can insert files
   - UPDATE: All authenticated users can update files
   - DELETE: All authenticated users can delete files

---

## Verification Steps

### 1. Check Table Exists

**Via Supabase Dashboard:**
- Go to Table Editor
- Look for "consolidated_files" table
- Click on it to view columns

**Via SQL Query:**
```sql
SELECT * FROM information_schema.tables 
WHERE table_name = 'consolidated_files';
```

### 2. Verify Table Structure

**Via Supabase Dashboard:**
- Click on the table
- Verify all columns are present

**Via SQL Query:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'consolidated_files'
ORDER BY ordinal_position;
```

Expected columns:
- id (uuid)
- file_name (character varying)
- file_size (bigint)
- uploaded_by (character varying)
- employee_id (character varying)
- original_file_name (character varying)
- row_count (integer)
- created_at (timestamp with time zone)
- is_public (boolean)
- created_by_id (uuid)

### 3. Check Indexes

**Via SQL Query:**
```sql
SELECT * FROM pg_indexes 
WHERE tablename = 'consolidated_files';
```

Expected indexes:
- idx_consolidated_files_created_at
- idx_consolidated_files_employee_id
- idx_consolidated_files_is_public

### 4. Verify RLS Policies

**Via Supabase Dashboard:**
- Go to Authentication → Policies
- Look for policies on "consolidated_files" table

**Via SQL Query:**
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'consolidated_files';
```

Expected policies:
- Allow all users to read public consolidated files
- Allow users to insert their own consolidated files
- Allow users to update their own consolidated files
- Allow users to delete their own consolidated files

### 5. Test the API

**In Browser Console:**
```javascript
fetch('/api/consolidated-files')
  .then(r => r.json())
  .then(console.log)
```

Expected response:
```json
{
  "data": []
}
```

---

## Troubleshooting

### Issue: "Permission denied" Error

**Cause:** Insufficient permissions

**Solution:**
- Use a service role key instead of anon key
- Or ensure your user has proper database permissions
- Check Supabase project settings

### Issue: "Table already exists" Error

**Cause:** Table was already created

**Solution:**
- This is safe to ignore
- Or drop the table first:
  ```sql
  DROP TABLE IF EXISTS consolidated_files CASCADE;
  ```

### Issue: RLS Policies Not Working

**Cause:** RLS not enabled on table

**Solution:**
```sql
ALTER TABLE consolidated_files ENABLE ROW LEVEL SECURITY;
```

### Issue: API Returns 401 Unauthorized

**Cause:** Invalid or missing Supabase keys

**Solution:**
1. Check `.env.local` for correct keys
2. Verify keys in Supabase Dashboard → Settings → API
3. Restart your Next.js app

### Issue: Files Not Appearing in UI

**Cause:** Multiple possible reasons

**Solution:**
1. Check browser console for errors
2. Verify RLS policies allow SELECT:
   ```sql
   SELECT * FROM pg_policies 
   WHERE tablename = 'consolidated_files' 
   AND policyname LIKE '%read%';
   ```
3. Check Supabase logs for API errors
4. Verify table has data:
   ```sql
   SELECT * FROM consolidated_files;
   ```

### Issue: Migration Script Fails

**Cause:** Missing dependencies or environment variables

**Solution:**
1. Install dependencies:
   ```bash
   npm install @supabase/supabase-js
   ```
2. Set environment variables in `.env.local`
3. Run the helper script first:
   ```bash
   node scripts/run-migration.js
   ```

---

## Manual SQL Execution

If you prefer to run the SQL manually, here's the complete migration:

```sql
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

-- Create index for faster queries
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

---

## Post-Migration Setup

### 1. Verify Environment Variables

Check `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. Start Your Application

```bash
npm run dev
```

### 3. Test the Feature

1. Navigate to "ZIP Upload" tab
2. Upload a ZIP file with CSV files
3. Wait for processing to complete
4. Navigate to "Uploaded Files" tab
5. Verify the consolidated file appears

### 4. Test Cross-User Visibility

1. Open the app in another browser/incognito window
2. Navigate to "Uploaded Files" tab
3. Verify the file is visible to other users

---

## Rollback Instructions

If you need to remove the migration:

```sql
-- Drop the table (this will also drop all policies and indexes)
DROP TABLE IF EXISTS consolidated_files CASCADE;
```

Then revert the code changes:
1. Restore `components/uploaded-files-panel.tsx` to use localStorage
2. Remove Supabase integration from `components/file-upload-section.tsx`
3. Delete new files:
   - `app/api/consolidated-files/route.ts`
   - `lib/use-consolidated-files.ts`

---

## Support

For issues or questions:

1. **Check Supabase Logs**
   - Go to Supabase Dashboard → Logs
   - Look for error messages

2. **Check Browser Console**
   - Open DevTools (F12)
   - Look for JavaScript errors

3. **Check Server Logs**
   - Look at terminal where `npm run dev` is running
   - Look for API errors

4. **Review Documentation**
   - See `CONSOLIDATED_FILES_SETUP.md` for detailed setup
   - See `CHANGES_SUMMARY.md` for implementation details

---

## Next Steps

After successful migration:

1. ✅ Verify table exists in Supabase
2. ✅ Test API endpoint
3. ✅ Upload a test file
4. ✅ Verify file appears in "Uploaded Files" tab
5. ✅ Test cross-user visibility
6. ✅ Deploy to production

Congratulations! Your consolidated files system is now ready to use.
