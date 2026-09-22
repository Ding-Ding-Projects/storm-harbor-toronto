@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  where winget >nul 2>&1
  if errorlevel 1 (echo Node.js missing and winget unavailable. & exit /b 1)
  winget install OpenJS.NodeJS.LTS --scope user --accept-package-agreements --accept-source-agreements --silent
  if errorlevel 1 exit /b 1
  set "PATH=%LOCALAPPDATA%\Microsoft\WinGet\Links;%PATH%"
)
call npm ci
if errorlevel 1 exit /b 1
call npm run build
exit /b %errorlevel%
