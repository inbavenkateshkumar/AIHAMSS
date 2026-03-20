@echo off
echo ================================================
echo   Holy Angels Substitution - Ngrok Setup
echo ================================================
echo.

REM Check if ngrok is installed
where ngrok >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Ngrok is not installed!
    echo.
    echo Please install ngrok:
    echo 1. Download from: https://ngrok.com/download
    echo 2. Extract ngrok.exe to this folder
    echo 3. Or add ngrok to your PATH
    echo.
    pause
    exit /b 1
)

echo [1/3] Starting Node.js server...
start "Holy Angels Substitution Server" cmd /k "npm start"
timeout /t 5 /nobreak >nul

echo [2/3] Waiting for server to start...
timeout /t 3 /nobreak >nul

echo [3/3] Starting ngrok tunnel...
echo.
echo ================================================
echo   Your public URL will appear below:
echo ================================================
echo.

REM Start ngrok
ngrok http 3000

pause
