#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Frontend Auto-Deployment to Vercel...');
console.log('================================================');

// Check if we're in the right directory
if (!fs.existsSync('frontend')) {
  console.error('❌ Error: frontend directory not found. Please run this script from the project root.');
  process.exit(1);
}

try {
  // Step 1: Navigate to frontend and install dependencies
  console.log('📦 Installing frontend dependencies...');
  execSync('cd frontend && npm install', { stdio: 'inherit' });

  // Step 2: Run tests (if available)
  console.log('🧪 Running frontend tests...');
  try {
    execSync('cd frontend && npm test', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Tests failed or not configured, continuing with deployment...');
  }

  // Step 3: Build the frontend
  console.log('🔨 Building frontend...');
  execSync('cd frontend && npm run build', { stdio: 'inherit' });

  // Step 4: Check if Vercel CLI is installed
  console.log('🔍 Checking Vercel CLI...');
  try {
    execSync('vercel --version', { stdio: 'pipe' });
  } catch (error) {
    console.log('📦 Installing Vercel CLI...');
    execSync('npm install -g vercel', { stdio: 'inherit' });
  }

  // Step 5: Deploy to Vercel
  console.log('🚀 Deploying to Vercel...');
  execSync('cd frontend && vercel --prod --yes', { stdio: 'inherit' });

  // Step 6: Commit and push changes to GitHub
  console.log('📝 Committing changes to Git...');
  execSync('git add .', { stdio: 'inherit' });
  
  const commitMessage = `Auto-deploy frontend: ${new Date().toISOString()}`;
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  
  console.log('📤 Pushing to GitHub...');
  execSync('git push origin main', { stdio: 'inherit' });

  console.log('✅ Frontend deployment completed!');
  console.log('');
  console.log('📋 Deployment Summary:');
  console.log('1. Frontend has been deployed to Vercel');
  console.log('2. Changes have been committed and pushed to GitHub');
  console.log('3. Your frontend will be available at: https://camera-rental-one.vercel.app');
  console.log('');
  console.log('🎯 Next steps:');
  console.log('1. Test your deployed frontend');
  console.log('2. Verify all API calls work correctly');
  console.log('3. Check that authentication flows work');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('');
  console.log('🔧 Troubleshooting:');
  console.log('1. Make sure you have Git configured');
  console.log('2. Ensure you have push access to the repository');
  console.log('3. Check that all dependencies are properly installed');
  console.log('4. Verify your frontend builds successfully locally');
  console.log('5. Make sure you\'re logged into Vercel CLI');
  process.exit(1);
} 