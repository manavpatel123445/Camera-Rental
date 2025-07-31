#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to recursively find all .tsx files
function findTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to update API URLs in a file
function updateApiUrls(filePath, newBaseUrl) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Replace localhost:3000 with the new base URL
    const oldUrl = 'https://camera-rental-ndr0.onrender.com';
    if (content.includes(oldUrl)) {
      content = content.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newBaseUrl);
      updated = true;
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// Main execution
const frontendDir = path.join(__dirname, 'frontend', 'src');
const newBaseUrl = process.argv[2];

if (!newBaseUrl) {
  console.log('🚀 API URL Update Script');
  console.log('========================');
  console.log('');
  console.log('Usage: node update-api-urls.js <new-backend-url>');
  console.log('');
  console.log('Example: node update-api-urls.js https://your-app.railway.app');
  console.log('');
  console.log('This script will update all localhost:3000 references in your frontend files.');
  console.log('');
  console.log('⚠️  Make sure to:');
  console.log('1. Deploy your backend first');
  console.log('2. Get the backend URL from Railway/Render/etc.');
  console.log('3. Run this script with the backend URL');
  console.log('4. Deploy your frontend to Vercel');
  console.log('');
  process.exit(1);
}

console.log(`🔄 Updating API URLs from localhost:3000 to ${newBaseUrl}...`);
console.log('');

const tsxFiles = findTsxFiles(frontendDir);
let updatedCount = 0;

tsxFiles.forEach(file => {
  const relativePath = path.relative(process.cwd(), file);
  updateApiUrls(file, newBaseUrl);
  updatedCount++;
});

console.log('');
console.log(`✅ Updated ${updatedCount} files`);
console.log('');
console.log('🎯 Next steps:');
console.log('1. Test your frontend locally to make sure API calls work');
console.log('2. Deploy your frontend to Vercel');
console.log('3. Update CORS_ORIGIN in your backend to include your Vercel domain');
console.log(''); 