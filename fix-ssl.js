#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Fixing SSL/TLS issues...\n');

// Set environment variables for Windows
try {
  console.log('Setting environment variables...');
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  process.env.NODE_OPTIONS = '--openssl-legacy-provider';
  
  console.log('✅ Environment variables set');
} catch (error) {
  console.log('⚠️  Could not set environment variables:', error.message);
}

// Clear npm cache
try {
  console.log('\nClearing npm cache...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ npm cache cleared');
} catch (error) {
  console.log('⚠️  Could not clear npm cache:', error.message);
}

// Check if node_modules exist and reinstall if needed
const backendNodeModules = './backend/node_modules';
const frontendNodeModules = './frontend/node_modules';

if (!fs.existsSync(backendNodeModules) || !fs.existsSync(frontendNodeModules)) {
  console.log('\nReinstalling dependencies...');
  try {
    execSync('npm run install-all', { stdio: 'inherit' });
    console.log('✅ Dependencies reinstalled');
  } catch (error) {
    console.log('⚠️  Could not reinstall dependencies:', error.message);
  }
}

console.log('\n🚀 SSL fixes applied!');
console.log('\nNext steps:');
console.log('1. Run: npm run dev');
console.log('2. If issues persist, check SSL_FIX_GUIDE.md');
console.log('3. Make sure all URLs use http:// not https:// for local development');

// Test the backend
console.log('\n🧪 Testing backend connection...');
try {
  const http = require('http');
  const testRequest = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/',
    method: 'GET',
    timeout: 5000
  }, (res) => {
    console.log('✅ Backend is accessible');
  });
  
  testRequest.on('error', (error) => {
    console.log('⚠️  Backend not accessible:', error.message);
    console.log('   Make sure to start the backend with: npm run server');
  });
  
  testRequest.end();
} catch (error) {
  console.log('⚠️  Could not test backend:', error.message);
}
