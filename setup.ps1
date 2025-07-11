# ArtisanMarket Development Setup Script (PowerShell)
# This script sets up the development environment for ArtisanMarket

Write-Host "🎨 Setting up ArtisanMarket Development Environment..." -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ and try again." -ForegroundColor Red
    exit 1
}

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker is installed: $dockerVersion" -ForegroundColor Green
    $dockerAvailable = $true
} catch {
    Write-Host "⚠️ Docker is not installed. You can still run the project locally." -ForegroundColor Yellow
    $dockerAvailable = $false
}

Write-Host "✅ Prerequisites check passed" -ForegroundColor Green

# Install client dependencies
Write-Host "📦 Installing client dependencies..." -ForegroundColor Yellow
Set-Location client
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Client dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install client dependencies" -ForegroundColor Red
    exit 1
}

# Install server dependencies
Write-Host "📦 Installing server dependencies..." -ForegroundColor Yellow
Set-Location ..\server
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Server dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install server dependencies" -ForegroundColor Red
    exit 1
}

# Create .env file from example
Set-Location ..
if (!(Test-Path "server\.env")) {
    Write-Host "⚙️ Creating environment file..." -ForegroundColor Yellow
    Copy-Item "server\.env.example" "server\.env"
    Write-Host "✅ Environment file created at server\.env" -ForegroundColor Green
    Write-Host "⚠️ Please update the environment variables in server\.env" -ForegroundColor Yellow
} else {
    Write-Host "✅ Environment file already exists" -ForegroundColor Green
}

# Create uploads directory
if (!(Test-Path "server\uploads")) {
    New-Item -ItemType Directory -Path "server\uploads" -Force | Out-Null
    Write-Host "✅ Uploads directory created" -ForegroundColor Green
} else {
    Write-Host "✅ Uploads directory already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update the environment variables in server\.env"
Write-Host "2. Start the development servers:"
Write-Host ""
Write-Host "   Option 1: Using Docker (recommended)" -ForegroundColor Yellow
if ($dockerAvailable) {
    Write-Host "   docker-compose -f docker/docker-compose.yml up -d"
} else {
    Write-Host "   (Docker not available - install Docker first)"
}
Write-Host ""
Write-Host "   Option 2: Running locally" -ForegroundColor Yellow
Write-Host "   # Terminal 1 - Start backend:"
Write-Host "   cd server; npm run dev"
Write-Host ""
Write-Host "   # Terminal 2 - Start frontend:"
Write-Host "   cd client; npm run dev"
Write-Host ""
Write-Host "🌐 Application URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000"
Write-Host "   Backend API: http://localhost:5000"
Write-Host "   Health Check: http://localhost:5000/health"
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green
