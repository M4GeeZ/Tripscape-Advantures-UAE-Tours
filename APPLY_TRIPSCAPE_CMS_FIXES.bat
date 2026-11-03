@echo off
setlocal
if "%~1"=="" (
  set /p PROJECT_ROOT=Enter Tripscape project root path: 
) else (
  set "PROJECT_ROOT=%~1"
)
node "%~dp0APPLY_TRIPSCAPE_CMS_FIXES.mjs" "%PROJECT_ROOT%"
if errorlevel 1 (
  echo.
  echo Patch failed. No automatic deployment was performed.
  pause
  exit /b 1
)
echo.
echo Patch applied successfully.
pause
