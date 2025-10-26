# 🚀 START HERE - SQL Migration Setup

Welcome! This guide will help you set up the consolidated files system in just a few minutes.

## ⚡ 30-Second Quick Start

### Windows Users
```bash
# Just run this:
run-migration.bat
```

### Mac/Linux Users
```bash
# Just run this:
node scripts/run-migration.js
```

### All Platforms (Manual)
1. Go to https://app.supabase.com
2. Select your project
3. Click "SQL Editor" → "New Query"
4. Copy content from: `scripts/002_create_consolidated_files_table.sql`
5. Paste and click "Run"

---

## 📋 What You Need

Before starting, make sure you have:

- [ ] `.env.local` file with Supabase credentials
- [ ] Node.js installed (for script methods)
- [ ] Access to Supabase dashboard
- [ ] 5-10 minutes of time

### Check Your Environment

**Verify `.env.local` has:**
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

**Get these values from:**
1. https://app.supabase.com
2. Select your project
3. Settings → API
4. Copy Project URL and Anon Key

---

## 🎯 Choose Your Method

### 🟢 Method 1: Windows Batch Script (Easiest)
**Time:** 1 minute | **Difficulty:** Very Easy

```bash
# Just double-click:
run-migration.bat

# Or run from command line:
run-migration.bat
```

**What it does:**
- Shows interactive menu
- Checks dependencies
- Runs migration
- Provides next steps

---

### 🟢 Method 2: Helper Script (Recommended)
**Time:** 1 minute | **Difficulty:** Very Easy

```bash
node scripts/run-migration.js
```

**What it does:**
- Displays SQL content
- Shows manual instructions
- Provides verification steps
- Lists troubleshooting tips

---

### 🟡 Method 3: Manual Setup (Most Control)
**Time:** 2 minutes | **Difficulty:** Easy

1. Open https://app.supabase.com
2. Select your project
3. Click "SQL Editor" → "New Query"
4. Open `scripts/002_create_consolidated_files_table.sql`
5. Copy all content
6. Paste into SQL Editor
7. Click "Run"

---

### 🟡 Method 4: Programmatic (Automated)
**Time:** 2 minutes | **Difficulty:** Easy

```bash
# Install dependency (if needed)
npm install @supabase/supabase-js

# Run migration
node scripts/run-migration-programmatic.js
```

---

### 🔵 Method 5: Supabase CLI (Advanced)
**Time:** 3 minutes | **Difficulty:** Medium

```bash
# Install CLI
npm install -g supabase

# Link project
supabase link --project-ref your_project_ref

# Push migration
supabase db push
```

---

## ✅ Verify It Worked

### Quick Check (30 seconds)
1. Open browser console (F12)
2. Run:
   ```javascript
   fetch('/api/consolidated-files').then(r => r.json()).then(console.log)
   ```
3. Should see: `{ data: [] }`

### Full Check (2 minutes)
1. Go to https://app.supabase.com
2. Select your project
3. Click "Table Editor"
4. Look for "consolidated_files" table
5. Click it to see columns

---

## 🧪 Test the Feature

After migration is complete:

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
   - You should see your consolidated file!

4. **Test visibility:**
   - Open app in another browser/incognito
   - Go to "Uploaded Files" tab
   - File should be visible to all users

---

## 📚 Documentation

| Document | Purpose | Read Time |
|----------|---------|-----------|
| `QUICK_MIGRATION_REFERENCE.md` | Quick reference card | 2 min |
| `MIGRATION_GUIDE.md` | Detailed step-by-step guide | 10 min |
| `CONSOLIDATED_FILES_SETUP.md` | Complete setup documentation | 15 min |
| `MIGRATION_SCRIPTS_README.md` | Scripts documentation | 5 min |
| `CHANGES_SUMMARY.md` | Implementation details | 10 min |

---

## ❌ Troubleshooting

### Problem: "Table already exists"
✅ **Solution:** Safe to ignore - table is already set up

### Problem: "Permission denied"
✅ **Solution:** Check your Supabase keys in `.env.local`

### Problem: API returns 401
✅ **Solution:** Verify environment variables are correct

### Problem: Files not appearing
✅ **Solution:** 
1. Check browser console (F12) for errors
2. Verify table exists in Supabase
3. Check RLS policies are enabled

### Problem: Script won't run
✅ **Solution:**
1. Install Node.js from https://nodejs.org/
2. Run: `npm install`
3. Try helper script: `node scripts/run-migration.js`

**More help?** See `MIGRATION_GUIDE.md` for extensive troubleshooting.

---

## 🎯 Next Steps

### After Successful Migration

1. ✅ Verify table exists in Supabase
2. ✅ Test API endpoint in browser console
3. ✅ Upload a test ZIP file
4. ✅ Check "Uploaded Files" tab
5. ✅ Test with another user/browser
6. ✅ Deploy to production

### If Something Goes Wrong

1. Check `MIGRATION_GUIDE.md` troubleshooting section
2. Review Supabase logs in dashboard
3. Check browser console (F12)
4. Check terminal where `npm run dev` runs

---

## 💡 Pro Tips

- **Fastest:** Use manual method (copy-paste SQL)
- **Easiest:** Use Windows batch script or helper script
- **Best for CI/CD:** Use Supabase CLI
- **Most Automated:** Use programmatic script

---

## 🔄 Rollback (If Needed)

If you need to remove the migration:

```sql
DROP TABLE IF EXISTS consolidated_files CASCADE;
```

Then revert code changes in:
- `components/uploaded-files-panel.tsx`
- `components/file-upload-section.tsx`

---

## 📞 Need Help?

### Quick Questions
→ Check `QUICK_MIGRATION_REFERENCE.md`

### Detailed Help
→ Check `MIGRATION_GUIDE.md`

### Setup Questions
→ Check `CONSOLIDATED_FILES_SETUP.md`

### Script Questions
→ Check `MIGRATION_SCRIPTS_README.md`

### Implementation Details
→ Check `CHANGES_SUMMARY.md`

---

## 🎉 Ready to Go!

Choose your preferred method above and run the migration. You'll be done in minutes!

### Recommended Path for Most Users:

1. **Windows?** → Run `run-migration.bat`
2. **Mac/Linux?** → Run `node scripts/run-migration.js`
3. **Prefer manual?** → Copy-paste SQL to Supabase
4. **Verify** → Check table exists
5. **Test** → Upload a file
6. **Done!** ✅

---

## 📝 Files Included

### Scripts
- `scripts/002_create_consolidated_files_table.sql` - SQL migration
- `scripts/run-migration.js` - Helper script
- `scripts/run-migration-programmatic.js` - Programmatic runner
- `run-migration.bat` - Windows batch script

### Documentation
- `START_HERE.md` - This file
- `QUICK_MIGRATION_REFERENCE.md` - Quick reference
- `MIGRATION_GUIDE.md` - Detailed guide
- `CONSOLIDATED_FILES_SETUP.md` - Setup docs
- `MIGRATION_SCRIPTS_README.md` - Scripts docs
- `CHANGES_SUMMARY.md` - Implementation details

---

## ✨ What This Does

The migration creates:

1. **Database Table** - Stores consolidated file metadata
2. **Indexes** - For fast queries
3. **Security Policies** - RLS for access control
4. **API Endpoints** - To manage files
5. **React Hook** - To use in components

Result: Consolidated files are automatically saved and visible to all users!

---

**Let's get started! Choose your method above and run the migration.** 🚀

Questions? Check the documentation files or see the troubleshooting section.
