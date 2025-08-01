#!/bin/bash

echo "🚀 ArtisanMarket Vendor Banking - Quick Start"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if MongoDB is running (optional check)
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Please start MongoDB before continuing."
        echo "   You can start it with: mongod"
    fi
else
    echo "⚠️  MongoDB not found. Please ensure MongoDB is installed and running."
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."

# Install root dependencies
if [ -f "package.json" ]; then
    echo "Installing root dependencies..."
    npm install
fi

# Install client dependencies
if [ -d "client" ]; then
    echo "Installing client dependencies..."
    cd client
    npm install
    cd ..
fi

# Install server dependencies
if [ -d "server" ]; then
    echo "Installing server dependencies..."
    cd server
    npm install
    cd ..
fi

echo "✅ Dependencies installed successfully!"

# Check for environment files
echo ""
echo "🔧 Environment Configuration"

if [ ! -f "client/.env" ]; then
    if [ -f "client/env.example" ]; then
        echo "Creating client .env file from example..."
        cp client/env.example client/.env
        echo "✅ Client .env file created. Please update with your configuration."
    else
        echo "⚠️  No client environment example found."
    fi
else
    echo "✅ Client .env file exists"
fi

if [ ! -f "server/.env" ]; then
    if [ -f "server/env.example" ]; then
        echo "Creating server .env file from example..."
        cp server/env.example server/.env
        echo "✅ Server .env file created. Please update with your configuration."
    else
        echo "⚠️  No server environment example found."
    fi
else
    echo "✅ Server .env file exists"
fi

echo ""
echo "🎯 Quick Start Instructions:"
echo "1. Update environment files with your configuration"
echo "2. Start MongoDB (if not already running)"
echo "3. Start the server: cd server && npm run dev"
echo "4. Start the client: cd client && npm run dev"
echo "5. Access the application at: http://localhost:5172"
echo ""
echo "📚 For detailed setup instructions, see: IMPLEMENTATION_COMPLETE.md"
echo ""
echo "🔑 Demo Accounts:"
echo "   Customer: demo@artisanmarket.com / demo123"
echo "   Vendor: vendor@artisanmarket.com / demo123"
echo ""
echo "✨ Happy coding!" 