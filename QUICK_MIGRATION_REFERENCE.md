# Quick Migration Reference

## 🚀 Fastest Way to Run Migration

### Option 1: Manual (2 minutes)
```
1. Go to https://app.supabase.com
2. Select your project
3. Click "SQL Editor" → "New Query"
4. Copy content from: scripts/002_create_consolidated_files_table.sql
5. Paste into editor
6. Click "Run"
7. Done! ✓
```

### Option 2: Helper Script (1 minute)
```bash
node scripts/run-migration.js
```
Then follow the instructions displayed.

### Option 3: Supabase CLI (3 minutes)
```bash
npm install -g supabase
supabase link --project-ref your_project_ref
supabase db push
```

### Option 4: Programmatic (2 minutes)
```bash
npm install @supabase/supabase-js
node scripts/run-migration-programmatic.js
```

---

## ✅ Verify It Worked

### In Supabase Dashboard:
1. Go to "Table Editor"
2. Look for "consolidated_files" table
3. Click it to see columns

### In Browser Console:
```javascript
fetch('/api/consolidated-files').then(r => r.json()).then(console.log)
// Should return: { data: [] }
```

### In SQL Editor:
```sql
SELECT * FROM consolidated_files LIMIT 1;
```

---

## 🧪 Test the Feature

1. Go to "ZIP Upload" tab
2. Upload a ZIP file with CSV files
3. Wait for processing
4. Go to "Uploaded Files" tab
5. See your consolidated file! ✓

---

## 📋 SQL Migration File

**Location:** `scripts/002_create_consolidated_files_table.sql`

**Creates:**
- Table: `consolidated_files`
- 3 Indexes for performance
- 4 RLS policies for security

---

## 🔧 Environment Setup

Make sure `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

---

## ❌ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Table already exists" | Safe to ignore or drop first |
| "Permission denied" | Use service role key |
| API returns 401 | Check .env.local keys |
| Files not showing | Check browser console for errors |
| RLS policies fail | Run: `ALTER TABLE consolidated_files ENABLE ROW LEVEL SECURITY;` |

---

## 📚 Full Documentation

- **Setup Guide:** `CONSOLIDATED_FILES_SETUP.md`
- **Migration Guide:** `MIGRATION_GUIDE.md`
- **Changes Summary:** `CHANGES_SUMMARY.md`

---

## 🎯 Next Steps

1. ✅ Run migration (choose any method above)
2. ✅ Verify table exists
3. ✅ Test API endpoint
4. ✅ Upload test file
5. ✅ Check "Uploaded Files" tab
6. ✅ Deploy to production

---

## 💡 Pro Tips

- **Fastest:** Use manual method (copy-paste SQL)
- **Easiest:** Use helper script (`node scripts/run-migration.js`)
- **Best for CI/CD:** Use Supabase CLI
- **Most Automated:** Use programmatic script

---

## 🆘 Need Help?

1. Check `MIGRATION_GUIDE.md` for detailed troubleshooting
2. Review Supabase logs in dashboard
3. Check browser console (F12)
4. Check server logs in terminal

---

**That's it! You're ready to go.** 🎉
