#!/usr/bin/env node

/**
 * SQL Migration Runner
 * This script helps you run the SQL migration to set up the consolidated_files table
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n');
  log('═'.repeat(60), 'cyan');
  log(title, 'bright');
  log('═'.repeat(60), 'cyan');
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

// Read SQL file
function readSQLFile() {
  const sqlPath = path.join(__dirname, '002_create_consolidated_files_table.sql');
  
  if (!fs.existsSync(sqlPath)) {
    logError(`SQL file not found at: ${sqlPath}`);
    process.exit(1);
  }
  
  return fs.readFileSync(sqlPath, 'utf-8');
}

// Check environment variables
function checkEnvironment() {
  logSection('Checking Environment Variables');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl) {
    logError('NEXT_PUBLIC_SUPABASE_URL is not set');
    return false;
  }
  
  if (!supabaseKey) {
    logError('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
    return false;
  }
  
  logSuccess(`Supabase URL: ${supabaseUrl}`);
  logSuccess(`Supabase Key: ${supabaseKey.substring(0, 10)}...`);
  
  return true;
}

// Display SQL content
function displaySQL() {
  logSection('SQL Migration Content');
  
  const sql = readSQLFile();
  log(sql, 'yellow');
}

// Display manual instructions
function displayManualInstructions() {
  logSection('Manual Setup Instructions');
  
  log('Follow these steps to run the migration manually:', 'bright');
  console.log(`
${colors.cyan}Step 1: Open Supabase Dashboard${colors.reset}
  - Go to https://app.supabase.com
  - Select your project
  
${colors.cyan}Step 2: Navigate to SQL Editor${colors.reset}
  - Click on "SQL Editor" in the left sidebar
  - Click "New Query"
  
${colors.cyan}Step 3: Copy and Paste SQL${colors.reset}
  - Copy the SQL content shown above
  - Paste it into the SQL Editor
  
${colors.cyan}Step 4: Execute the Query${colors.reset}
  - Click the "Run" button (or press Ctrl+Enter)
  - Wait for the query to complete
  
${colors.cyan}Step 5: Verify${colors.reset}
  - Go to "Table Editor" in the left sidebar
  - Look for "consolidated_files" table
  - Verify the table structure
  `);
}

// Display programmatic instructions
function displayProgrammaticInstructions() {
  logSection('Programmatic Setup (Using Supabase CLI)');
  
  log('If you have Supabase CLI installed, you can run:', 'bright');
  console.log(`
${colors.cyan}Option 1: Using Supabase CLI${colors.reset}
  supabase db push
  
${colors.cyan}Option 2: Using Node.js with Supabase Client${colors.reset}
  npm install @supabase/supabase-js
  node scripts/run-migration-programmatic.js
  `);
}

// Display verification steps
function displayVerification() {
  logSection('Verification Steps');
  
  log('After running the migration, verify it was successful:', 'bright');
  console.log(`
${colors.cyan}1. Check Table Exists${colors.reset}
   - Go to Supabase Dashboard → Table Editor
   - Look for "consolidated_files" table
   
${colors.cyan}2. Check Table Structure${colors.reset}
   - Click on the table to view columns
   - Verify all columns are present:
     * id (UUID)
     * file_name (text)
     * file_size (bigint)
     * uploaded_by (text)
     * employee_id (text)
     * original_file_name (text)
     * row_count (integer)
     * created_at (timestamp)
     * is_public (boolean)
     * created_by_id (UUID)
   
${colors.cyan}3. Check Indexes${colors.reset}
   - Go to Supabase Dashboard → SQL Editor
   - Run: SELECT * FROM pg_indexes WHERE tablename = 'consolidated_files';
   - Verify 3 indexes exist
   
${colors.cyan}4. Check RLS Policies${colors.reset}
   - Go to Supabase Dashboard → Authentication → Policies
   - Look for policies on "consolidated_files" table
   - Verify 4 policies exist (SELECT, INSERT, UPDATE, DELETE)
   
${colors.cyan}5. Test the API${colors.reset}
   - Start your Next.js app: npm run dev
   - Open browser console
   - Test: fetch('/api/consolidated-files').then(r => r.json()).then(console.log)
   - Should return: { data: [] }
  `);
}

// Display troubleshooting
function displayTroubleshooting() {
  logSection('Troubleshooting');
  
  console.log(`
${colors.cyan}Issue: "Permission denied" error${colors.reset}
  Solution: Make sure you're using a service role key or have proper permissions
  
${colors.cyan}Issue: "Table already exists" error${colors.reset}
  Solution: The table already exists. You can safely ignore this or drop it first:
    DROP TABLE IF EXISTS consolidated_files CASCADE;
  
${colors.cyan}Issue: RLS policies not working${colors.reset}
  Solution: Make sure RLS is enabled on the table:
    ALTER TABLE consolidated_files ENABLE ROW LEVEL SECURITY;
  
${colors.cyan}Issue: API returns 401 Unauthorized${colors.reset}
  Solution: Check your Supabase keys in .env.local
  
${colors.cyan}Issue: Files not appearing in UI${colors.reset}
  Solution: 
    1. Check browser console for errors
    2. Verify RLS policies allow SELECT
    3. Check Supabase logs for API errors
  `);
}

// Main execution
function main() {
  logSection('SQL Migration Setup Helper');
  
  log('This script will help you set up the consolidated_files table', 'bright');
  
  // Check environment
  if (!checkEnvironment()) {
    logWarning('Environment variables not found. You can still run the migration manually.');
  }
  
  // Display SQL
  displaySQL();
  
  // Display instructions
  displayManualInstructions();
  displayProgrammaticInstructions();
  
  // Display verification
  displayVerification();
  
  // Display troubleshooting
  displayTroubleshooting();
  
  logSection('Next Steps');
  
  console.log(`
${colors.green}✓ Choose one of the following options:${colors.reset}

${colors.cyan}Option 1: Manual Setup (Recommended for first-time)${colors.reset}
  1. Copy the SQL content shown above
  2. Go to Supabase Dashboard → SQL Editor
  3. Paste and run the SQL
  4. Verify the table was created
  
${colors.cyan}Option 2: Using Supabase CLI${colors.reset}
  1. Install Supabase CLI: npm install -g supabase
  2. Run: supabase db push
  
${colors.cyan}Option 3: Using Node.js Script${colors.reset}
  1. Run: node scripts/run-migration-programmatic.js
  
${colors.cyan}After Setup:${colors.reset}
  1. Verify the table exists in Supabase Dashboard
  2. Start your app: npm run dev
  3. Test by uploading a ZIP file
  4. Check "Uploaded Files" tab for the consolidated file
  `);
  
  logSuccess('Setup helper completed!');
}

// Run the script
main();
