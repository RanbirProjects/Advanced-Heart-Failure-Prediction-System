#!/bin/bash

# Heart Failure Prediction System - Deployment Script
# This script helps deploy the application to production

set -e

echo "🚀 Starting deployment of Heart Failure Prediction System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js version $(node -v) is installed"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    print_success "npm version $(npm -v) is installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    print_success "All dependencies installed successfully"
}

# Setup environment variables
setup_env() {
    print_status "Setting up environment variables..."
    
    if [ ! -f "backend/.env" ]; then
        print_warning "Creating backend .env file from template..."
        cp backend/env.example backend/.env
        print_warning "Please edit backend/.env with your actual configuration"
    else
        print_success "Backend .env file already exists"
    fi
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    
    cd frontend
    npm run build
    cd ..
    
    print_success "Frontend built successfully"
}

# Test the application
test_application() {
    print_status "Running tests..."
    
    # Test backend
    cd backend
    npm test || print_warning "Backend tests failed or not configured"
    cd ..
    
    # Test frontend
    cd frontend
    npm test -- --watchAll=false || print_warning "Frontend tests failed or not configured"
    cd ..
    
    print_success "Tests completed"
}

# Deploy to Netlify
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    # Build frontend first
    build_frontend
    
    # Deploy to Netlify
    cd frontend
    netlify deploy --prod --dir=build
    cd ..
    
    print_success "Deployed to Netlify successfully"
}

# Deploy backend (example for Heroku)
deploy_backend() {
    print_status "Deploying backend..."
    
    print_warning "Backend deployment depends on your hosting provider."
    print_warning "For Heroku, you would run:"
    echo "  cd backend"
    echo "  heroku create your-app-name"
    echo "  git push heroku main"
    echo ""
    print_warning "For other providers, please refer to their documentation."
}

# Main deployment function
main() {
    print_status "Starting deployment process..."
    
    # Check prerequisites
    check_node
    check_npm
    
    # Install dependencies
    install_dependencies
    
    # Setup environment
    setup_env
    
    # Build application
    build_frontend
    
    # Run tests
    test_application
    
    print_success "Deployment preparation completed!"
    echo ""
    echo "Next steps:"
    echo "1. Edit backend/.env with your configuration"
    echo "2. Set up your database (MongoDB)"
    echo "3. Deploy backend to your preferred hosting provider"
    echo "4. Deploy frontend to Netlify or your preferred hosting provider"
    echo ""
    echo "To deploy to Netlify, run: ./deploy.sh netlify"
    echo "To deploy backend, run: ./deploy.sh backend"
}

# Handle command line arguments
case "${1:-}" in
    "netlify")
        deploy_netlify
        ;;
    "backend")
        deploy_backend
        ;;
    "test")
        test_application
        ;;
    "build")
        build_frontend
        ;;
    "install")
        install_dependencies
        ;;
    "help"|"-h"|"--help")
        echo "Heart Failure Prediction System - Deployment Script"
        echo ""
        echo "Usage: ./deploy.sh [command]"
        echo ""
        echo "Commands:"
        echo "  (no args)  - Full deployment preparation"
        echo "  netlify    - Deploy frontend to Netlify"
        echo "  backend    - Deploy backend (instructions)"
        echo "  test       - Run tests"
        echo "  build      - Build frontend"
        echo "  install    - Install dependencies"
        echo "  help       - Show this help message"
        ;;
    *)
        main
        ;;
esac 