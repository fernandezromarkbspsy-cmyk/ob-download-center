@echo off
REM SQL Migration Runner for Windows
REM This script helps you run the SQL migration

setlocal enabledelayedexpansion

REM Colors (using ANSI escape codes)
set "RESET=[0m"
set "BRIGHT=[1m"
set "GREEN=[32m"
set "RED=[31m"
set "YELLOW=[33m"
set "BLUE=[34m"
set "CYAN=[36m"

cls
echo.
echo %CYAN%============================================================%RESET%
echo %BRIGHT%SQL Migration Setup Helper%RESET%
echo %CYAN%============================================================%RESET%
echo.

REM Check if Node.js is installed
echo %BLUE%Checking for Node.js...%RESET%
node --version >nul 2>&1
if errorlevel 1 (
    echo %RED%Error: Node.js is not installed or not in PATH%RESET%
    echo %YELLOW%Please install Node.js from https://nodejs.org/%RESET%
    pause
    exit /b 1
)
echo %GREEN%Node.js found%RESET%

echo.
echo %CYAN%============================================================%RESET%
echo %BRIGHT%Choose Migration Method:%RESET%
echo %CYAN%============================================================%RESET%
echo.
echo %BLUE%1. Display Migration Helper (Recommended)%RESET%
echo    Shows SQL content and manual instructions
echo.
echo %BLUE%2. Run Programmatic Migration%RESET%
echo    Automatically runs migration using Node.js
echo.
echo %BLUE%3. Open Supabase Dashboard%RESET%
echo    Opens browser to manual setup
echo.
echo %BLUE%4. View SQL File%RESET%
echo    Opens the SQL migration file
echo.
echo %BLUE%5. Exit%RESET%
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    call :display_helper
) else if "%choice%"=="2" (
    call :run_programmatic
) else if "%choice%"=="3" (
    call :open_dashboard
) else if "%choice%"=="4" (
    call :view_sql
) else if "%choice%"=="5" (
    exit /b 0
) else (
    echo %RED%Invalid choice%RESET%
    pause
    exit /b 1
)

pause
exit /b 0

:display_helper
echo.
echo %CYAN%============================================================%RESET%
echo %BRIGHT%Running Migration Helper%RESET%
echo %CYAN%============================================================%RESET%
echo.
node scripts/run-migration.js
exit /b 0

:run_programmatic
echo.
echo %CYAN%============================================================%RESET%
echo %BRIGHT%Running Programmatic Migration%RESET%
echo %CYAN%============================================================%RESET%
echo.

REM Check if @supabase/supabase-js is installed
echo %BLUE%Checking for @supabase/supabase-js...%RESET%
npm list @supabase/supabase-js >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%Installing @supabase/supabase-js...%RESET%
    call npm install @supabase/supabase-js
)

echo.
echo %BLUE%Running migration script...%RESET%
node scripts/run-migration-programmatic.js
exit /b 0

:open_dashboard
echo.
echo %CYAN%Opening Supabase Dashboard...%RESET%
echo.
start https://app.supabase.com
echo %GREEN%Dashboard opened in browser%RESET%
echo.
echo %BLUE%Next steps:%RESET%
echo 1. Select your project
echo 2. Click "SQL Editor" in the left sidebar
echo 3. Click "New Query"
echo 4. Copy content from: scripts/002_create_consolidated_files_table.sql
echo 5. Paste into the editor
echo 6. Click "Run"
exit /b 0

:view_sql
echo.
echo %CYAN%Opening SQL file...%RESET%
echo.
if exist "scripts\002_create_consolidated_files_table.sql" (
    start notepad scripts\002_create_consolidated_files_table.sql
    echo %GREEN%SQL file opened in Notepad%RESET%
) else (
    echo %RED%SQL file not found at: scripts\002_create_consolidated_files_table.sql%RESET%
)
exit /b 0
