#!/bin/bash

# =================================
# ArtisanMarket Render Deployment Script
# =================================

echo "🚀 Preparing ArtisanMarket for Render Deployment..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📋 Pre-deployment checklist:"
echo ""

# Check for required files
echo "✅ Checking required files..."
if [ -f "render.yaml" ]; then
    echo "   ✓ render.yaml found"
else
    echo "   ❌ render.yaml missing"
fi

if [ -f ".env.production" ]; then
    echo "   ✓ .env.production template found"
else
    echo "   ❌ .env.production template missing"
fi

if [ -f "server/package.json" ]; then
    echo "   ✓ server/package.json found"
else
    echo "   ❌ server/package.json missing"
fi

echo ""
echo "🔧 Environment Variables to Set in Render:"
echo "   • MONGODB_URI (MongoDB Atlas connection string)"
echo "   • IMAGEKIT_PUBLIC_KEY"
echo "   • IMAGEKIT_PRIVATE_KEY" 
echo "   • IMAGEKIT_URL_ENDPOINT"
echo "   • STRIPE_SECRET_KEY"
echo "   • STRIPE_PUBLISHABLE_KEY"
echo "   • PLAID_CLIENT_ID"
echo "   • PLAID_SECRET"
echo ""

echo "📝 Deployment Steps:"
echo "   1. Push code to GitHub: git add . && git commit -m 'Deploy to Render' && git push"
echo "   2. Go to render.com and create new Blueprint"
echo "   3. Connect your GitHub repository"
echo "   4. Set environment variables in Render dashboard"
echo "   5. Deploy and monitor logs"
echo ""

echo "🔗 Useful Links:"
echo "   • Render Dashboard: https://dashboard.render.com"
echo "   • MongoDB Atlas: https://cloud.mongodb.com"
echo "   • Deployment Guide: ./RENDER_DEPLOYMENT.md"
echo ""

echo "✨ Ready for deployment! Follow the steps above to deploy to Render."
