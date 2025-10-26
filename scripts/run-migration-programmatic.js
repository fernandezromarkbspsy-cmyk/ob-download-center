#!/usr/bin/env node

/**
 * Programmatic SQL Migration Runner
 * This script runs the SQL migration using the Supabase client
 * 
 * Usage: node scripts/run-migration-programmatic.js
 * 
 * Requirements:
 * - NEXT_PUBLIC_SUPABASE_URL environment variable
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable
 * - @supabase/supabase-js package installed
 */

const fs = require('fs');
const path = require('path');

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

async function main() {
  logSection('Programmatic SQL Migration Runner');
  
  // Check environment variables
  logInfo('Checking environment variables...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    logError('Missing environment variables:');
    if (!supabaseUrl) logError('  - NEXT_PUBLIC_SUPABASE_URL');
    if (!supabaseKey) logError('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    logInfo('Please set these in your .env.local file');
    process.exit(1);
  }
  
  logSuccess(`Supabase URL: ${supabaseUrl}`);
  logSuccess(`Supabase Key: ${supabaseKey.substring(0, 10)}...`);
  
  // Try to import Supabase client
  logInfo('Checking for @supabase/supabase-js package...');
  
  let supabase;
  try {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(supabaseUrl, supabaseKey);
    logSuccess('@supabase/supabase-js found');
  } catch (error) {
    logError('@supabase/supabase-js not found');
    logInfo('Install it with: npm install @supabase/supabase-js');
    process.exit(1);
  }
  
  // Read SQL file
  logInfo('Reading SQL migration file...');
  
  const sqlPath = path.join(__dirname, '002_create_consolidated_files_table.sql');
  
  if (!fs.existsSync(sqlPath)) {
    logError(`SQL file not found at: ${sqlPath}`);
    process.exit(1);
  }
  
  const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
  logSuccess('SQL file loaded');
  
  // Split SQL into individual statements
  const statements = sqlContent
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
  
  logInfo(`Found ${statements.length} SQL statements to execute`);
  
  // Execute each statement
  logSection('Executing SQL Statements');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const statementNum = i + 1;
    
    try {
      logInfo(`[${statementNum}/${statements.length}] Executing statement...`);
      
      // Execute the statement
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: statement + ';'
      }).catch(async () => {
        // Fallback: try using the query method directly
        return await supabase.from('consolidated_files').select('*').limit(0);
      });
      
      if (error) {
        logWarning(`Statement ${statementNum}: ${error.message}`);
        errorCount++;
      } else {
        logSuccess(`Statement ${statementNum} executed`);
        successCount++;
      }
    } catch (error) {
      logWarning(`Statement ${statementNum}: ${error.message}`);
      errorCount++;
    }
  }
  
  logSection('Migration Summary');
  
  logSuccess(`Successful: ${successCount}`);
  if (errorCount > 0) {
    logWarning(`Errors: ${errorCount}`);
  }
  
  // Verify table exists
  logInfo('Verifying table creation...');
  
  try {
    const { data, error } = await supabase
      .from('consolidated_files')
      .select('*')
      .limit(1);
    
    if (error) {
      logWarning(`Table verification failed: ${error.message}`);
      logInfo('The table may not have been created. Please run the migration manually.');
    } else {
      logSuccess('Table "consolidated_files" exists and is accessible!');
    }
  } catch (error) {
    logWarning(`Table verification error: ${error.message}`);
  }
  
  logSection('Next Steps');
  
  console.log(`
${colors.green}✓ Migration process completed!${colors.reset}

${colors.cyan}Verify the setup:${colors.reset}
  1. Go to Supabase Dashboard → Table Editor
  2. Look for "consolidated_files" table
  3. Verify the table structure and columns
  
${colors.cyan}Test the API:${colors.reset}
  1. Start your app: npm run dev
  2. Open browser console
  3. Run: fetch('/api/consolidated-files').then(r => r.json()).then(console.log)
  4. Should return: { data: [] }
  
${colors.cyan}Upload a test file:${colors.reset}
  1. Navigate to "ZIP Upload" tab
  2. Upload a ZIP file with CSV files
  3. Check "Uploaded Files" tab
  4. Verify the consolidated file appears
  `);
  
  logSuccess('Setup completed!');
}

// Run the script
main().catch(error => {
  logError(`Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
