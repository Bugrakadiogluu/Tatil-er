@echo off
set "PATH=%LOCALAPPDATA%\Programs\node;%PATH%"
cd /d "%~dp0frontend"
echo ===================================================
echo Starting Holliday Arbitrage Frontend (Port 3000)
echo ===================================================
npm run dev
pause
