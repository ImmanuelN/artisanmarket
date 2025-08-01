@echo off
echo 🚀 ArtisanMarket Vendor Banking - Quick Start
echo ==============================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install dependencies
echo.
echo 📦 Installing dependencies...

REM Install root dependencies
if exist "package.json" (
    echo Installing root dependencies...
    npm install
)

REM Install client dependencies
if exist "client" (
    echo Installing client dependencies...
    cd client
    npm install
    cd ..
)

REM Install server dependencies
if exist "server" (
    echo Installing server dependencies...
    cd server
    npm install
    cd ..
)

echo ✅ Dependencies installed successfully!

REM Check for environment files
echo.
echo 🔧 Environment Configuration

if not exist "client\.env" (
    if exist "client\env.example" (
        echo Creating client .env file from example...
        copy "client\env.example" "client\.env"
        echo ✅ Client .env file created. Please update with your configuration.
    ) else (
        echo ⚠️  No client environment example found.
    )
) else (
    echo ✅ Client .env file exists
)

if not exist "server\.env" (
    if exist "server\env.example" (
        echo Creating server .env file from example...
        copy "server\env.example" "server\.env"
        echo ✅ Server .env file created. Please update with your configuration.
    ) else (
        echo ⚠️  No server environment example found.
    )
) else (
    echo ✅ Server .env file exists
)

echo.
echo 🎯 Quick Start Instructions:
echo 1. Update environment files with your configuration
echo 2. Start MongoDB (if not already running)
echo 3. Start the server: cd server ^&^& npm run dev
echo 4. Start the client: cd client ^&^& npm run dev
echo 5. Access the application at: http://localhost:5172
echo.
echo 📚 For detailed setup instructions, see: IMPLEMENTATION_COMPLETE.md
echo.
echo 🔑 Demo Accounts:
echo    Customer: demo@artisanmarket.com / demo123
echo    Vendor: vendor@artisanmarket.com / demo123
echo.
echo ✨ Happy coding!
pause 