# Migration Scripts Documentation

This directory contains scripts and guides to help you run the SQL migration for the consolidated files system.

## 📁 Files Included

### Migration Scripts

1. **`scripts/002_create_consolidated_files_table.sql`**
   - The actual SQL migration file
   - Creates table, indexes, and RLS policies
   - Can be run manually or programmatically

2. **`scripts/run-migration.js`**
   - Helper script that displays migration information
   - Shows SQL content and instructions
   - Provides troubleshooting tips
   - **Usage:** `node scripts/run-migration.js`

3. **`scripts/run-migration-programmatic.js`**
   - Automatically runs the migration using Supabase client
   - Requires `@supabase/supabase-js` package
   - Requires environment variables set
   - **Usage:** `node scripts/run-migration-programmatic.js`

4. **`run-migration.bat`** (Windows only)
   - Interactive batch script for Windows users
   - Menu-driven interface
   - Handles all migration methods
   - **Usage:** Double-click or run `run-migration.bat`

### Documentation

1. **`QUICK_MIGRATION_REFERENCE.md`**
   - Quick reference card
   - Fastest way to run migration
   - Verification steps
   - Troubleshooting table

2. **`MIGRATION_GUIDE.md`**
   - Comprehensive migration guide
   - Step-by-step instructions for each method
   - Detailed verification steps
   - Extensive troubleshooting section

3. **`CONSOLIDATED_FILES_SETUP.md`**
   - Complete setup documentation
   - Database schema details
   - API endpoint documentation
   - Usage examples

4. **`CHANGES_SUMMARY.md`**
   - Summary of all changes made
   - Files created and modified
   - Data flow diagrams
   - Future enhancements

---

## 🚀 Quick Start

### For Windows Users
```bash
# Double-click this file:
run-migration.bat

# Or run from command line:
run-migration.bat
```

### For Mac/Linux Users
```bash
# Run the helper script:
node scripts/run-migration.js

# Or run programmatic migration:
node scripts/run-migration-programmatic.js
```

### Manual Method (All Platforms)
1. Go to https://app.supabase.com
2. Select your project
3. Click "SQL Editor" → "New Query"
4. Copy content from `scripts/002_create_consolidated_files_table.sql`
5. Paste and click "Run"

---

## 📋 Migration Methods

### Method 1: Manual (Recommended for First-Time)
- **Time:** 2 minutes
- **Difficulty:** Easy
- **Steps:**
  1. Open Supabase Dashboard
  2. Go to SQL Editor
  3. Copy-paste SQL
  4. Click Run

### Method 2: Helper Script
- **Time:** 1 minute
- **Difficulty:** Very Easy
- **Command:** `node scripts/run-migration.js`
- **Features:**
  - Displays SQL content
  - Shows instructions
  - Provides verification steps

### Method 3: Programmatic
- **Time:** 2 minutes
- **Difficulty:** Easy
- **Command:** `node scripts/run-migration-programmatic.js`
- **Requirements:**
  - `@supabase/supabase-js` installed
  - Environment variables set

### Method 4: Supabase CLI
- **Time:** 3 minutes
- **Difficulty:** Medium
- **Commands:**
  ```bash
  npm install -g supabase
  supabase link --project-ref your_project_ref
  supabase db push
  ```

### Method 5: Windows Batch Script
- **Time:** 1 minute
- **Difficulty:** Very Easy
- **Usage:** Double-click `run-migration.bat`
- **Features:**
  - Interactive menu
  - Automatic dependency checking
  - Opens Supabase dashboard

---

## 🔧 Environment Setup

Before running any migration script, ensure your `.env.local` file has:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### How to Get These Values

1. Go to https://app.supabase.com
2. Select your project
3. Click "Settings" → "API"
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## ✅ Verification

### Quick Verification
```javascript
// In browser console:
fetch('/api/consolidated-files').then(r => r.json()).then(console.log)
// Should return: { data: [] }
```

### Full Verification
1. Go to Supabase Dashboard → Table Editor
2. Look for "consolidated_files" table
3. Click to view columns
4. Verify all columns exist

### SQL Verification
```sql
-- Check table exists
SELECT * FROM information_schema.tables 
WHERE table_name = 'consolidated_files';

-- Check columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'consolidated_files';

-- Check indexes
SELECT * FROM pg_indexes 
WHERE tablename = 'consolidated_files';

-- Check RLS policies
SELECT * FROM pg_policies 
WHERE tablename = 'consolidated_files';
```

---

## 🧪 Testing

After migration, test the feature:

1. **Start your app:**
   ```bash
   npm run dev
   ```

2. **Upload a test file:**
   - Go to "ZIP Upload" tab
   - Upload a ZIP file with CSV files
   - Wait for processing

3. **Check results:**
   - Go to "Uploaded Files" tab
   - Verify the consolidated file appears

4. **Test cross-user visibility:**
   - Open app in another browser/incognito
   - Go to "Uploaded Files" tab
   - Verify file is visible

---

## ❌ Troubleshooting

### Issue: "Table already exists"
**Solution:** Safe to ignore or drop first:
```sql
DROP TABLE IF EXISTS consolidated_files CASCADE;
```

### Issue: "Permission denied"
**Solution:** Use service role key or check permissions

### Issue: API returns 401
**Solution:** Check `.env.local` for correct keys

### Issue: Files not appearing
**Solution:**
1. Check browser console (F12)
2. Verify RLS policies
3. Check Supabase logs

### Issue: Script fails to run
**Solution:**
1. Install Node.js
2. Install dependencies: `npm install`
3. Set environment variables
4. Try helper script first

---

## 📚 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| `QUICK_MIGRATION_REFERENCE.md` | Quick reference | Everyone |
| `MIGRATION_GUIDE.md` | Detailed guide | Developers |
| `CONSOLIDATED_FILES_SETUP.md` | Setup documentation | Developers |
| `CHANGES_SUMMARY.md` | Implementation details | Developers |
| `MIGRATION_SCRIPTS_README.md` | This file | Everyone |

---

## 🎯 Recommended Approach

### For First-Time Setup
1. Read `QUICK_MIGRATION_REFERENCE.md` (2 min)
2. Run helper script: `node scripts/run-migration.js` (1 min)
3. Follow manual instructions (2 min)
4. Verify in Supabase Dashboard (1 min)
5. Test the feature (2 min)

**Total Time:** ~8 minutes

### For Experienced Users
1. Copy SQL from `scripts/002_create_consolidated_files_table.sql`
2. Paste into Supabase SQL Editor
3. Click Run
4. Done!

**Total Time:** ~2 minutes

### For Automation/CI-CD
1. Use Supabase CLI: `supabase db push`
2. Or use programmatic script: `node scripts/run-migration-programmatic.js`

---

## 🔄 Rollback

If you need to remove the migration:

```sql
DROP TABLE IF EXISTS consolidated_files CASCADE;
```

Then revert code changes:
1. Restore `components/uploaded-files-panel.tsx`
2. Remove Supabase integration from `components/file-upload-section.tsx`
3. Delete new files

---

## 📞 Support

### Getting Help

1. **Check Documentation:**
   - `QUICK_MIGRATION_REFERENCE.md` - Quick answers
   - `MIGRATION_GUIDE.md` - Detailed help
   - `CONSOLIDATED_FILES_SETUP.md` - Setup help

2. **Check Logs:**
   - Supabase Dashboard → Logs
   - Browser Console (F12)
   - Terminal where `npm run dev` runs

3. **Common Issues:**
   - See "Troubleshooting" section above
   - See `MIGRATION_GUIDE.md` for extensive troubleshooting

---

## ✨ What's Next

After successful migration:

1. ✅ Verify table exists
2. ✅ Test API endpoint
3. ✅ Upload test file
4. �� Check "Uploaded Files" tab
5. ✅ Test cross-user visibility
6. ✅ Deploy to production

---

## 📝 Notes

- All scripts are safe to run multiple times
- Migration is idempotent (can be run repeatedly)
- No data loss if table already exists
- RLS policies ensure security
- Indexes improve performance

---

## 🎉 You're Ready!

Choose your preferred method and run the migration. The system will be ready to use in minutes!

**Questions?** Check the documentation files or review the troubleshooting section.
