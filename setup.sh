#!/bin/bash

# Workout Admin Dashboard - Setup Script
# This script helps with initial setup and common tasks

echo "🏋️ Workout Admin Dashboard - Setup Helper"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Parse command
case "$1" in
  "dev")
    echo "🚀 Starting development server..."
    npm run dev
    ;;
  "build")
    echo "🏗️ Building for production..."
    npm run build
    ;;
  "start")
    echo "▶️ Starting production server..."
    npm start
    ;;
  "lint")
    echo "🔍 Running linter..."
    npm run lint
    ;;
  "install")
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    ;;
  "setup")
    echo "🔧 Running complete setup..."
    npm install
    echo ""
    echo "📝 Setup Complete!"
    echo ""
    echo "Next steps:"
    echo "1. Update .env.local with your Firebase credentials"
    echo "2. Run 'npm run dev' to start the development server"
    echo "3. Open http://localhost:3000 in your browser"
    echo ""
    echo "Demo credentials:"
    echo "  Email: admin@admin.com"
    echo "  Password: Admin@123"
    ;;
  "env")
    echo "📋 Firebase Environment Variables:"
    echo ""
    echo "Add these to your .env.local file:"
    echo ""
    echo "NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key"
    echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain"
    echo "NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url"
    echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id"
    echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket"
    echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id"
    echo "NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id"
    echo "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id"
    echo ""
    ;;
  *)
    echo "📖 Available Commands:"
    echo ""
    echo "  npm run setup     - Install dependencies and show next steps"
    echo "  npm run dev       - Start development server (http://localhost:3000)"
    echo "  npm run build     - Build for production"
    echo "  npm start         - Start production server"
    echo "  npm run lint      - Run ESLint"
    echo "  npm run env       - Show Firebase environment variables needed"
    echo ""
    echo "Or use this script:"
    echo ""
    echo "  bash setup.sh dev     - Start development server"
    echo "  bash setup.sh build   - Build for production"
    echo "  bash setup.sh start   - Start production server"
    echo "  bash setup.sh install - Install dependencies"
    echo "  bash setup.sh setup   - Full setup"
    echo "  bash setup.sh env     - Show environment variables"
    echo ""
    echo "📚 Documentation:"
    echo "  - README.md              - Project overview and features"
    echo "  - QUICKSTART.md          - Quick start guide"
    echo "  - IMPLEMENTATION_GUIDE.md - Feature implementation examples"
    echo "  - PROJECT_SUMMARY.md     - Complete project summary"
    echo ""
    echo "🔗 Useful Links:"
    echo "  - http://localhost:3000         - App (development)"
    echo "  - http://localhost:3000/login   - Login page"
    echo "  - http://localhost:3000/dashboard - Main dashboard"
    echo ""
    ;;
esac
