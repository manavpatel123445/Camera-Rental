#!/bin/bash

echo "🚀 Camera Rental Auto-Deployment Script"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to deploy backend
deploy_backend() {
    echo "🔧 Deploying Backend to Render..."
    echo "=================================="
    
    # Install dependencies
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
    
    # Run tests (if available)
    echo "🧪 Running backend tests..."
    cd backend && npm test && cd .. || echo "⚠️  Tests failed or not configured, continuing..."
    
    # Build backend
    echo "🔨 Building backend..."
    cd backend && npm run build && cd ..
    
    # Commit and push
    echo "📝 Committing changes..."
    git add .
    git commit -m "Auto-deploy backend: $(date)"
    
    echo "📤 Pushing to GitHub..."
    git push origin main
    
    echo "✅ Backend deployment triggered!"
    echo "⏱️  Check status at: https://dashboard.render.com"
    echo ""
}

# Function to deploy frontend
deploy_frontend() {
    echo "🎨 Deploying Frontend to Vercel..."
    echo "=================================="
    
    # Install dependencies
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    
    # Run tests (if available)
    echo "🧪 Running frontend tests..."
    cd frontend && npm test && cd .. || echo "⚠️  Tests failed or not configured, continuing..."
    
    # Build frontend
    echo "🔨 Building frontend..."
    cd frontend && npm run build && cd ..
    
    # Deploy to Vercel
    echo "🚀 Deploying to Vercel..."
    cd frontend && vercel --prod --yes && cd ..
    
    # Commit and push
    echo "📝 Committing changes..."
    git add .
    git commit -m "Auto-deploy frontend: $(date)"
    
    echo "📤 Pushing to GitHub..."
    git push origin main
    
    echo "✅ Frontend deployment completed!"
    echo "🌐 Check status at: https://vercel.com/dashboard"
    echo ""
}

# Main deployment logic
case "$1" in
    "backend")
        deploy_backend
        ;;
    "frontend")
        deploy_frontend
        ;;
    "all"|"")
        echo "🚀 Deploying both backend and frontend..."
        echo ""
        deploy_backend
        echo "Waiting 30 seconds for backend to start deploying..."
        sleep 30
        deploy_frontend
        ;;
    *)
        echo "Usage: $0 [backend|frontend|all]"
        echo ""
        echo "Commands:"
        echo "  backend  - Deploy only backend to Render"
        echo "  frontend - Deploy only frontend to Vercel"
        echo "  all      - Deploy both (default)"
        echo ""
        echo "Examples:"
        echo "  ./deploy.sh          # Deploy both"
        echo "  ./deploy.sh backend  # Deploy only backend"
        echo "  ./deploy.sh frontend # Deploy only frontend"
        exit 1
        ;;
esac

echo "🎉 Deployment process completed!"
echo ""
echo "📋 Your URLs:"
echo "  Frontend: https://camera-rental-one.vercel.app"
echo "  Backend:  https://camera-rental-ndr0.onrender.com"
echo ""
echo "🔍 Monitor deployments:"
echo "  Render:   https://dashboard.render.com"
echo "  Vercel:   https://vercel.com/dashboard" 