@echo off
setlocal
cd /d "%~dp0"

echo ==============================================
echo   Tripscape - Localhost Setup and Start
echo ==============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed or not available in PATH.
  echo Install Node.js LTS, then run this file again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm is not available in PATH.
  echo Reinstall Node.js LTS, then run this file again.
  pause
  exit /b 1
)

echo [1/3] Installing root dependencies...
call npm install --no-audit --no-fund
if errorlevel 1 goto :failed

echo.
echo [2/3] Installing client and server dependencies...
call npm run install:all
if errorlevel 1 goto :failed

echo.
echo [3/3] Starting frontend and backend...
echo Frontend: http://localhost:5173
echo API:      http://localhost:5000
echo.
call npm run dev
if errorlevel 1 goto :failed

goto :end

:failed
echo.
echo ==============================================
echo Startup failed. Read the error shown above.
echo ==============================================
pause
exit /b 1

:end
endlocal
