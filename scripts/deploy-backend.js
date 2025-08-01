#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Backend Auto-Deployment to Render...');
console.log('==============================================');

// Check if we're in the right directory
if (!fs.existsSync('backend')) {
  console.error('❌ Error: backend directory not found. Please run this script from the project root.');
  process.exit(1);
}

try {
  // Step 1: Navigate to backend and install dependencies
  console.log('📦 Installing backend dependencies...');
  execSync('cd backend && npm install', { stdio: 'inherit' });

  // Step 2: Run tests (if available)
  console.log('🧪 Running backend tests...');
  try {
    execSync('cd backend && npm test', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Tests failed or not configured, continuing with deployment...');
  }

  // Step 3: Build the backend
  console.log('🔨 Building backend...');
  execSync('cd backend && npm run build', { stdio: 'inherit' });

  // Step 4: Commit and push changes to GitHub
  console.log('📝 Committing changes to Git...');
  execSync('git add .', { stdio: 'inherit' });
  
  const commitMessage = `Auto-deploy backend: ${new Date().toISOString()}`;
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  
  console.log('📤 Pushing to GitHub...');
  execSync('git push origin main', { stdio: 'inherit' });

  console.log('✅ Backend deployment triggered!');
  console.log('');
  console.log('📋 What happens next:');
  console.log('1. Render will automatically detect the push to GitHub');
  console.log('2. Render will start building and deploying your backend');
  console.log('3. You can monitor the deployment at: https://dashboard.render.com');
  console.log('4. Your backend will be available at: https://camera-rental-ndr0.onrender.com');
  console.log('');
  console.log('⏱️  Deployment usually takes 2-5 minutes...');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('');
  console.log('🔧 Troubleshooting:');
  console.log('1. Make sure you have Git configured');
  console.log('2. Ensure you have push access to the repository');
  console.log('3. Check that all dependencies are properly installed');
  console.log('4. Verify your backend builds successfully locally');
  process.exit(1);
} 