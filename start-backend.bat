@echo off
set "PATH=%LOCALAPPDATA%\Programs\node;%PATH%"
cd /d "%~dp0backend"
echo ===================================================
echo Starting Holliday Arbitrage Backend Gateway (Port 4000)
echo ===================================================
npm run dev
pause
