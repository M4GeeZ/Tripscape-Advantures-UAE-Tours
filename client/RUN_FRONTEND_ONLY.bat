@echo off
setlocal
cd /d "%~dp0"

echo Installing frontend dependencies...
call npm install --no-audit --no-fund
if errorlevel 1 goto :failed

echo.
echo Starting Vite frontend...
echo Open http://localhost:5173
echo.
call npm run dev
if errorlevel 1 goto :failed

goto :end

:failed
echo.
echo Frontend startup failed. Read the error shown above.
pause
exit /b 1

:end
endlocal
