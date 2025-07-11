#!/bin/bash

# ArtisanMarket Development Setup Script
# This script sets up the development environment for ArtisanMarket

echo "🎨 Setting up ArtisanMarket Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ and try again.${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️ Docker is not installed. You can still run the project locally.${NC}"
    DOCKER_AVAILABLE=false
else
    DOCKER_AVAILABLE=true
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Install client dependencies
echo -e "${YELLOW}📦 Installing client dependencies...${NC}"
cd client
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Client dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install client dependencies${NC}"
    exit 1
fi

# Install server dependencies
echo -e "${YELLOW}📦 Installing server dependencies...${NC}"
cd ../server
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Server dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install server dependencies${NC}"
    exit 1
fi

# Create .env file from example
cd ..
if [ ! -f "server/.env" ]; then
    echo -e "${YELLOW}⚙️ Creating environment file...${NC}"
    cp server/.env.example server/.env
    echo -e "${GREEN}✅ Environment file created at server/.env${NC}"
    echo -e "${YELLOW}⚠️ Please update the environment variables in server/.env${NC}"
else
    echo -e "${GREEN}✅ Environment file already exists${NC}"
fi

# Create uploads directory
mkdir -p server/uploads
echo -e "${GREEN}✅ Uploads directory created${NC}"

echo ""
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Update the environment variables in server/.env"
echo "2. Start the development servers:"
echo ""
echo "   ${YELLOW}Option 1: Using Docker (recommended)${NC}"
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "   docker-compose -f docker/docker-compose.yml up -d"
else
    echo "   (Docker not available - install Docker first)"
fi
echo ""
echo "   ${YELLOW}Option 2: Running locally${NC}"
echo "   # Terminal 1 - Start backend:"
echo "   cd server && npm run dev"
echo ""
echo "   # Terminal 2 - Start frontend:"
echo "   cd client && npm run dev"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   Health Check: http://localhost:5000/health"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
