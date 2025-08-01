# 🚀 Automatic Deployment Guide for Camera Rental

## 🎯 Overview

This guide will help you set up automatic deployment for your Camera Rental application. You'll have multiple options for deployment:

1. **Manual Deployment Scripts** - Quick one-command deployment
2. **GitHub Actions** - Automatic deployment on every push
3. **Platform Auto-Deploy** - Using Render and Vercel's built-in features

## 📋 Quick Start

### Option 1: Manual Deployment (Recommended for beginners)

```bash
# Deploy everything (backend + frontend)
npm run deploy

# Deploy only backend
npm run deploy:backend

# Deploy only frontend
npm run deploy:frontend

# Or use the script files directly
./deploy.sh          # Linux/Mac
deploy.bat           # Windows
```

### Option 2: GitHub Actions (Automatic on every push)

```bash
# Setup automatic deployment
npm run setup-auto-deploy
```

## 🔧 Setup Instructions

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install Vercel CLI globally (for frontend deployment)
npm install -g vercel
```

### Step 2: Configure Environment Variables

#### Backend (Render)
Go to your Render dashboard and set these environment variables:
- `MONGODB_URL` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string for JWT tokens
- `CORS_ORIGIN` - Your frontend URL (e.g., `https://camera-rental-one.vercel.app`)

#### Frontend (Vercel)
Go to your Vercel dashboard and set:
- `VITE_API_URL` - Your backend URL (e.g., `https://camera-rental-ndr0.onrender.com`)

### Step 3: Login to Vercel

```bash
vercel login
```

## 🚀 Deployment Methods

### Method 1: NPM Scripts (Easiest)

```bash
# Deploy everything
npm run deploy

# Deploy only backend
npm run deploy:backend

# Deploy only frontend
npm run deploy:frontend
```

### Method 2: Script Files

#### Linux/Mac
```bash
# Make script executable
chmod +x deploy.sh

# Deploy everything
./deploy.sh

# Deploy specific parts
./deploy.sh backend
./deploy.sh frontend
```

#### Windows
```cmd
# Deploy everything
deploy.bat

# Deploy specific parts
deploy.bat backend
deploy.bat frontend
```

### Method 3: GitHub Actions (Fully Automatic)

1. **Setup GitHub Actions:**
   ```bash
   npm run setup-auto-deploy
   ```

2. **Add GitHub Secrets:**
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `RENDER_TOKEN` - Get from https://dashboard.render.com/account/tokens
     - `RENDER_SERVICE_ID` - Your Render service ID
     - `VERCEL_TOKEN` - Get from https://vercel.com/account/tokens
     - `VERCEL_ORG_ID` - Your Vercel organization ID
     - `VERCEL_PROJECT_ID` - Your Vercel project ID

3. **Push to trigger deployment:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

## 📊 Deployment Status

### Your URLs
- **Frontend**: https://camera-rental-one.vercel.app
- **Backend**: https://camera-rental-ndr0.onrender.com

### Monitor Deployments
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Actions**: Your repository → Actions tab

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Test builds locally first
   npm run build:backend
   npm run build:frontend
   ```

2. **CORS Errors**
   - Update `CORS_ORIGIN` in Render to include your frontend URL
   - Make sure the URL format is correct (no trailing slash)

3. **Environment Variables**
   - Double-check all environment variables are set correctly
   - Restart your services after changing environment variables

4. **Git Issues**
   ```bash
   # Make sure you're on the main branch
   git checkout main
   
   # Pull latest changes
   git pull origin main
   ```

### Debug Commands

```bash
# Check if everything is working locally
npm run dev

# Test backend only
npm run dev:backend

# Test frontend only
npm run dev:frontend

# Check deployment configuration
cat deploy-config.json
```

## 🎯 Best Practices

1. **Always test locally first**
   ```bash
   npm run dev
   ```

2. **Use meaningful commit messages**
   ```bash
   git commit -m "feat: add user authentication"
   git commit -m "fix: resolve CORS issue"
   ```

3. **Monitor deployments**
   - Check deployment logs for errors
   - Test your application after deployment

4. **Keep environment variables secure**
   - Never commit secrets to Git
   - Use platform-specific environment variable systems

## 📝 Script Reference

### NPM Scripts
```json
{
  "deploy": "npm run deploy:backend && npm run deploy:frontend",
  "deploy:backend": "node scripts/deploy-backend.js",
  "deploy:frontend": "node scripts/deploy-frontend.js",
  "setup-auto-deploy": "node scripts/setup-auto-deploy.js"
}
```

### File Structure
```
├── scripts/
│   ├── deploy-backend.js      # Backend deployment script
│   ├── deploy-frontend.js     # Frontend deployment script
│   └── setup-auto-deploy.js   # GitHub Actions setup
├── .github/workflows/
│   └── auto-deploy.yml        # GitHub Actions workflow
├── deploy.sh                  # Linux/Mac deployment script
├── deploy.bat                 # Windows deployment script
└── deploy-config.json         # Deployment configuration
```

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review deployment logs in your platform dashboards
3. Test builds locally to isolate issues
4. Verify all environment variables are set correctly

## 🎉 Success!

Once everything is set up, you can deploy your changes with a single command:

```bash
npm run deploy
```

Your application will be automatically deployed to both Render (backend) and Vercel (frontend)! 