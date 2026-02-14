#!/bin/bash
# Setup script for Jarvis AI Backend

set -e

echo "🚀 Setting up Jarvis AI Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install Node.js 16+"
  exit 1
fi

echo "✓ Node.js $(node --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# TypeScript check
echo ""
echo "✨ Running TypeScript check..."
npm run type-check

# Run tests
echo ""
echo "🧪 Running tests..."
npm test -- --passWithNoTests

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. cp .env.example .env"
echo "  2. npm run dev"
echo ""
echo "📚 Documentation: https://example.com/docs"
