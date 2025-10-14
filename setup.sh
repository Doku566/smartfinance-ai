#!/bin/bash

echo "🚀 SmartFinance AI - Setup Script"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm found: $(npm --version)${NC}"
echo ""

# Setup Backend
echo -e "${BLUE}Setting up Backend...${NC}"
cd backend

if [ ! -f ".env" ]; then
    echo -e "${BLUE}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env created. Please add your OPENAI_API_KEY!${NC}"
fi

echo -e "${BLUE}Installing backend dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

echo -e "${BLUE}Generating Prisma Client...${NC}"
npx prisma generate
echo -e "${GREEN}✓ Prisma Client generated${NC}"

echo -e "${BLUE}Running database migrations...${NC}"
npx prisma migrate dev --name init
echo -e "${GREEN}✓ Database migrations completed${NC}"

cd ..

# Setup Frontend
echo ""
echo -e "${BLUE}Setting up Frontend...${NC}"
cd frontend

echo -e "${BLUE}Installing frontend dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

cd ..

echo ""
echo -e "${GREEN}=================================="
echo "✅ Setup completed successfully!"
echo "==================================${NC}"
echo ""
echo "📝 Next steps:"
echo "1. Add your OPENAI_API_KEY to backend/.env"
echo "2. Start the backend: cd backend && npm run dev"
echo "3. Start the frontend: cd frontend && npm run dev"
echo ""
echo "🐳 Or use Docker:"
echo "   export OPENAI_API_KEY='your-key'"
echo "   docker-compose up"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"