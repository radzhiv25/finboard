#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Setting up FinBoard Environment...\n');

// Check if .env already exists
const envPath = path.join(__dirname, '.env');
const envLocalPath = path.join(__dirname, '.env.local');

if (fs.existsSync(envPath) || fs.existsSync(envLocalPath)) {
    console.log('⚠️  Environment file already exists!');
    console.log('📝 Please update your existing .env or .env.local file with the correct values.\n');
} else {
    // Create .env.local file
    const envContent = `# Appwrite Configuration
# Get these values from your Appwrite Console: https://cloud.appwrite.io
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id-here

# Database Configuration
# Create these in your Appwrite Console after setting up the database
VITE_APPWRITE_DATABASE_ID=finboard-db
VITE_APPWRITE_COLLECTION_USERS=users
VITE_APPWRITE_COLLECTION_TRANSACTIONS=transactions
VITE_APPWRITE_COLLECTION_GOALS=goals
VITE_APPWRITE_BUCKET_AVATARS=avatars

# OpenAI Configuration (Optional)
# Get your API key from: https://platform.openai.com/api-keys
VITE_OPENAI_API_KEY=your-openai-api-key-here
`;

    fs.writeFileSync(envLocalPath, envContent);
    console.log('✅ Created .env.local file with default configuration');
}

console.log('🔧 Next Steps:');
console.log('1. Go to https://cloud.appwrite.io and create a new project');
console.log('2. Copy your Project ID and update VITE_APPWRITE_PROJECT_ID in .env.local');
console.log('3. Follow the APPWRITE_SETUP_GUIDE.md to set up your database');
console.log('4. Run: npm run dev');
console.log('\n📚 For detailed setup instructions, see:');
console.log('   - APPWRITE_SETUP_GUIDE.md');
console.log('   - ENVIRONMENT_SETUP.md');
