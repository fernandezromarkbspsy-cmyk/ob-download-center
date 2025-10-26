@echo off
echo 🔥 Killing Next.js dev server...
taskkill /f /im node.exe >nul 2>&1

echo 🧹 Removing .next cache...
rmdir /s /q .next 2>nul

echo 🧹 Clearing npm cache...
npm cache clean --force >nul

echo ✅ Done! Run 'npm run dev' to start fresh.
pause