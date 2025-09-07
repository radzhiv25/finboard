import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env.local');

// Check if .env.local already exists
if (fs.existsSync(envPath)) {
    console.log('✅ .env.local already exists');
    
    // Read existing content
    const existingContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if OpenAI key is already configured
    if (existingContent.includes('VITE_OPENAI_API_KEY')) {
        console.log('✅ OpenAI API key is already configured');
        console.log('📝 To update your OpenAI API key, edit the VITE_OPENAI_API_KEY value in .env.local');
    } else {
        // Add OpenAI configuration to existing file
        const openaiConfig = `

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
`;
        
        fs.appendFileSync(envPath, openaiConfig);
        console.log('✅ Added OpenAI configuration to existing .env.local');
        console.log('📝 Please update VITE_OPENAI_API_KEY with your actual OpenAI API key');
    }
} else {
    // Create new .env.local file
    const envContent = `# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=your_database_id_here

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local file with OpenAI configuration');
    console.log('📝 Please update the configuration values with your actual API keys');
}

console.log('\n🔧 Next steps:');
console.log('1. Get your OpenAI API key from: https://platform.openai.com/api-keys');
console.log('2. Update VITE_OPENAI_API_KEY in .env.local with your actual key');
console.log('3. Restart your development server: npm run dev');
console.log('\n💡 The app will work without OpenAI (using fallback predictions), but AI features will be enhanced with a valid API key.');
