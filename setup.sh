#!/usr/bin/env bash
set -e

echo "📦 Installing backend dependencies..."
cd backend && npm install

echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Start the backend:   cd backend && npm run dev"
echo "Start the frontend:  cd frontend && npm run dev"
echo ""
echo "Then open:  http://localhost:5173"
