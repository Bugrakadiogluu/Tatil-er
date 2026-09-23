@echo off
echo Starting Backend and Frontend services...
start "ArbiTrip Backend" "%~dp0start-backend.bat"
start "ArbiTrip Frontend" "%~dp0start-frontend.bat"
echo Both services launched!
echo Backend: http://localhost:4000
echo Frontend: http://localhost:3000
