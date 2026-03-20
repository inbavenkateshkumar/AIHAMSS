@echo off
REM Start the Timetable Server with PM2
REM This keeps the server running permanently with auto-restart on crashes

cd /d "C:\Users\Thirumoorthy\Desktop\timetable"

REM Check if PM2 process already exists
pm2 info timetable-server >nul 2>&1
if %errorlevel% equ 0 (
    echo Server is already running with PM2
    echo Use: pm2 status  - to see status
    echo Use: pm2 logs    - to see logs
    echo Use: pm2 stop timetable-server - to stop
    echo Use: pm2 restart timetable-server - to restart
) else (
    echo Starting Timetable Server with PM2...
    pm2 start server.js --name "timetable-server" --watch --ignore-watch="node_modules" --max-memory-restart 500M
    pm2 save
    echo Server started! Access at: http://localhost:3000
)

pause
