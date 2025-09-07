#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building FinBoard for Appwrite deployment...');

try {
  // Clean previous build
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Install dependencies with legacy peer deps
  console.log('📦 Installing dependencies...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });

  // Type check
  console.log('🔍 Running TypeScript check...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });

  // Build the project
  console.log('🏗️ Building project...');
  execSync('npm run build', { stdio: 'inherit' });

  // Verify build
  if (fs.existsSync('dist/index.html')) {
    console.log('✅ Build successful!');
    console.log('📁 Build output: dist/');
    console.log('🚀 Ready for Appwrite deployment!');
  } else {
    throw new Error('Build failed - dist/index.html not found');
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
