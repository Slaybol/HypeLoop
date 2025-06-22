@echo off
echo 🚀 HypeLoop Deployment Script
echo =============================

echo.
echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo 📦 Installing client dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install client dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo 🔨 Building for production...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Failed to build application
    pause
    exit /b 1
)

echo.
echo 🌐 Getting your IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    goto :found_ip
)
:found_ip
set IP=%IP: =%

echo.
echo ✅ Build complete!
echo.
echo 🌐 Your HypeLoop game is ready to share!
echo.
echo 📱 Share this URL with your friends:
echo    http://%IP%:3001
echo.
echo 💡 Make sure your firewall allows connections on port 3001
echo.
echo 🎮 Starting server...
echo.
call npm start 