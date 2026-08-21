@echo off
cd /d "%~dp0client"
echo Starting Tripscape frontend on http://localhost:5173/
echo.
npm run dev
pause
