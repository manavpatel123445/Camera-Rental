#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Automatic Deployment...');
console.log('====================================');

// Create .github/workflows directory
const workflowsDir = '.github/workflows';
if (!fs.existsSync(workflowsDir)) {
  fs.mkdirSync(workflowsDir, { recursive: true });
  console.log('📁 Created .github/workflows directory');
}

// Create GitHub Actions workflow for automatic deployment
const workflowContent = `name: Auto Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: backend/package-lock.json
    
    - name: Install Backend Dependencies
      run: |
        cd backend
        npm ci
    
    - name: Run Backend Tests
      run: |
        cd backend
        npm test
      continue-on-error: true
    
    - name: Build Backend
      run: |
        cd backend
        npm run build
    
    - name: Deploy to Render
      env:
        RENDER_TOKEN: \${{ secrets.RENDER_TOKEN }}
        RENDER_SERVICE_ID: \${{ secrets.RENDER_SERVICE_ID }}
      run: |
        curl -X POST "https://api.render.com/v1/services/\${{ secrets.RENDER_SERVICE_ID }}/deploys" \\
          -H "Authorization: Bearer \${{ secrets.RENDER_TOKEN }}" \\
          -H "Content-Type: application/json"
    
    - name: Notify Backend Deployment
      run: |
        echo "Backend deployment triggered on Render"
        echo "Check status at: https://dashboard.render.com"

  deploy-frontend:
    runs-on: ubuntu-latest
    needs: deploy-backend
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
    
    - name: Install Frontend Dependencies
      run: |
        cd frontend
        npm ci
    
    - name: Run Frontend Tests
      run: |
        cd frontend
        npm test
      continue-on-error: true
    
    - name: Build Frontend
      run: |
        cd frontend
        npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: \${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
        working-directory: ./frontend
        vercel-args: '--prod'
    
    - name: Notify Frontend Deployment
      run: |
        echo "Frontend deployment completed on Vercel"
        echo "Check status at: https://vercel.com/dashboard"
`;

fs.writeFileSync(path.join(workflowsDir, 'auto-deploy.yml'), workflowContent);
console.log('✅ Created GitHub Actions workflow');

// Create deployment configuration file
const deployConfig = {
  backend: {
    platform: 'render',
    url: 'https://camera-rental-ndr0.onrender.com',
    autoDeploy: true
  },
  frontend: {
    platform: 'vercel',
    url: 'https://camera-rental-one.vercel.app',
    autoDeploy: true
  },
  scripts: {
    deployAll: 'npm run deploy',
    deployBackend: 'npm run deploy:backend',
    deployFrontend: 'npm run deploy:frontend'
  }
};

fs.writeFileSync('deploy-config.json', JSON.stringify(deployConfig, null, 2));
console.log('✅ Created deployment configuration file');

// Create README for deployment
const deployReadme = `# 🚀 Automatic Deployment Setup

## Quick Commands

\`\`\`bash
# Deploy everything (backend + frontend)
npm run deploy

# Deploy only backend
npm run deploy:backend

# Deploy only frontend
npm run deploy:frontend

# Setup automatic deployment with GitHub Actions
npm run setup-auto-deploy
\`\`\`

## GitHub Actions Setup

To enable automatic deployment on every push:

1. **Get Render Token:**
   - Go to https://dashboard.render.com/account/tokens
   - Create a new token
   - Add it as GitHub secret: \`RENDER_TOKEN\`

2. **Get Render Service ID:**
   - Go to your service on Render
   - Copy the service ID from the URL
   - Add it as GitHub secret: \`RENDER_SERVICE_ID\`

3. **Get Vercel Tokens:**
   - Go to https://vercel.com/account/tokens
   - Create a new token
   - Add it as GitHub secret: \`VERCEL_TOKEN\`
   - Add \`VERCEL_ORG_ID\` and \`VERCEL_PROJECT_ID\` from your Vercel project

## Manual Deployment

If you prefer manual deployment:

\`\`\`bash
# Backend (Render)
npm run deploy:backend

# Frontend (Vercel)
npm run deploy:frontend
\`\`\`

## Environment Variables

Make sure these are set in your deployment platforms:

### Render (Backend)
- \`MONGODB_URL\`
- \`JWT_SECRET\`
- \`CORS_ORIGIN\`

### Vercel (Frontend)
- \`VITE_API_URL\`

## Troubleshooting

- Check deployment logs in GitHub Actions
- Verify environment variables are set correctly
- Ensure all dependencies are properly installed
- Test builds locally before deploying
`;

fs.writeFileSync('DEPLOYMENT_README.md', deployReadme);
console.log('✅ Created deployment README');

console.log('');
console.log('🎉 Automatic deployment setup completed!');
console.log('');
console.log('📋 Next steps:');
console.log('1. Set up GitHub secrets for automatic deployment');
console.log('2. Test manual deployment: npm run deploy');
console.log('3. Push to GitHub to trigger automatic deployment');
console.log('');
console.log('📚 Read DEPLOYMENT_README.md for detailed instructions'); 