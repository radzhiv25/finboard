#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = `# Appwrite Configuration
# Replace these values with your actual Appwrite project details

# Appwrite Endpoint (use cloud.appwrite.io for Appwrite Cloud)
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1

# Your Appwrite Project ID (get this from your Appwrite console)
VITE_APPWRITE_PROJECT_ID=your-project-id

# Database Configuration
VITE_APPWRITE_DATABASE_ID=finboard-db
VITE_APPWRITE_COLLECTION_USERS=users
VITE_APPWRITE_COLLECTION_TRANSACTIONS=transactions
VITE_APPWRITE_COLLECTION_GOALS=goals

# Storage Configuration
VITE_APPWRITE_BUCKET_AVATARS=avatars
`;

const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local file with default configuration');
    console.log('📝 Please update the values in .env.local with your actual Appwrite project details');
} else {
    console.log('⚠️  .env.local already exists, skipping creation');
}

console.log('\n🚀 Next steps:');
console.log('1. Set up your Appwrite project following APPWRITE_CONTENT.md');
console.log('2. Update .env.local with your project details');
console.log('3. Run: npm run dev');
