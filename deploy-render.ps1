# =================================
# ArtisanMarket Render Deployment Script (PowerShell)
# =================================

Write-Host "🚀 Preparing ArtisanMarket for Render Deployment..." -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Pre-deployment checklist:" -ForegroundColor Cyan
Write-Host ""

# Check for required files
Write-Host "✅ Checking required files..." -ForegroundColor Yellow

if (Test-Path "render.yaml") {
    Write-Host "   ✓ render.yaml found" -ForegroundColor Green
} else {
    Write-Host "   ❌ render.yaml missing" -ForegroundColor Red
}

if (Test-Path ".env.production") {
    Write-Host "   ✓ .env.production template found" -ForegroundColor Green
} else {
    Write-Host "   ❌ .env.production template missing" -ForegroundColor Red
}

if (Test-Path "server/package.json") {
    Write-Host "   ✓ server/package.json found" -ForegroundColor Green
} else {
    Write-Host "   ❌ server/package.json missing" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔧 Environment Variables to Set in Render:" -ForegroundColor Cyan
Write-Host "   • MONGODB_URI (MongoDB Atlas connection string)" -ForegroundColor White
Write-Host "   • IMAGEKIT_PUBLIC_KEY" -ForegroundColor White
Write-Host "   • IMAGEKIT_PRIVATE_KEY" -ForegroundColor White
Write-Host "   • IMAGEKIT_URL_ENDPOINT" -ForegroundColor White
Write-Host "   • STRIPE_SECRET_KEY" -ForegroundColor White
Write-Host "   • STRIPE_PUBLISHABLE_KEY" -ForegroundColor White
Write-Host "   • PLAID_CLIENT_ID" -ForegroundColor White
Write-Host "   • PLAID_SECRET" -ForegroundColor White
Write-Host ""

Write-Host "📝 Deployment Steps:" -ForegroundColor Cyan
Write-Host "   1. Push code to GitHub: git add . && git commit -m 'Deploy to Render' && git push" -ForegroundColor White
Write-Host "   2. Go to render.com and create new Blueprint" -ForegroundColor White
Write-Host "   3. Connect your GitHub repository" -ForegroundColor White
Write-Host "   4. Set environment variables in Render dashboard" -ForegroundColor White
Write-Host "   5. Deploy and monitor logs" -ForegroundColor White
Write-Host ""

Write-Host "🔗 Useful Links:" -ForegroundColor Cyan
Write-Host "   • Render Dashboard: https://dashboard.render.com" -ForegroundColor Blue
Write-Host "   • MongoDB Atlas: https://cloud.mongodb.com" -ForegroundColor Blue
Write-Host "   • Deployment Guide: ./RENDER_DEPLOYMENT.md" -ForegroundColor Blue
Write-Host ""

Write-Host "✨ Ready for deployment! Follow the steps above to deploy to Render." -ForegroundColor Green

# Optional: Open useful links
$openLinks = Read-Host "Would you like to open the deployment links in your browser? (y/N)"
if ($openLinks -eq "y" -or $openLinks -eq "Y") {
    Start-Process "https://dashboard.render.com"
    Start-Process "https://cloud.mongodb.com"
}
