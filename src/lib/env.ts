// Environment variable validation and configuration
// This ensures environment variables are properly loaded in both development and production

interface AppwriteConfig {
  endpoint: string;
  projectId: string;
  databaseId: string;
  collectionUsers: string;
  collectionTransactions: string;
  collectionGoals: string;
  bucketAvatars: string;
}

interface OpenAIConfig {
  apiKey: string | undefined;
}

// Validate and get environment variables
function getEnvVar(key: string, fallback?: string): string {
  const value = import.meta.env[key];
  
  if (!value && !fallback) {
    console.warn(`Environment variable ${key} is not set`);
    return '';
  }
  
  if (!value && fallback) {
    console.log(`Using fallback for ${key}: ${fallback}`);
    return fallback;
  }
  
  return value;
}

// Appwrite configuration
export const appwriteConfig: AppwriteConfig = {
  endpoint: getEnvVar('VITE_APPWRITE_ENDPOINT', 'https://cloud.appwrite.io/v1'),
  projectId: getEnvVar('VITE_APPWRITE_PROJECT_ID', 'your-project-id'),
  databaseId: getEnvVar('VITE_APPWRITE_DATABASE_ID', 'finboard-db'),
  collectionUsers: getEnvVar('VITE_APPWRITE_COLLECTION_USERS', 'users'),
  collectionTransactions: getEnvVar('VITE_APPWRITE_COLLECTION_TRANSACTIONS', 'transactions'),
  collectionGoals: getEnvVar('VITE_APPWRITE_COLLECTION_GOALS', 'goals'),
  bucketAvatars: getEnvVar('VITE_APPWRITE_BUCKET_AVATARS', 'avatars'),
};

// OpenAI configuration
export const openaiConfig: OpenAIConfig = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
};

// Validation function
export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required Appwrite variables
  if (!import.meta.env.VITE_APPWRITE_ENDPOINT) {
    errors.push('VITE_APPWRITE_ENDPOINT is not set');
  }
  
  if (!import.meta.env.VITE_APPWRITE_PROJECT_ID) {
    errors.push('VITE_APPWRITE_PROJECT_ID is not set');
  }
  
  if (!import.meta.env.VITE_APPWRITE_DATABASE_ID) {
    errors.push('VITE_APPWRITE_DATABASE_ID is not set');
  }
  
  if (!import.meta.env.VITE_APPWRITE_COLLECTION_USERS) {
    errors.push('VITE_APPWRITE_COLLECTION_USERS is not set');
  }
  
  if (!import.meta.env.VITE_APPWRITE_COLLECTION_TRANSACTIONS) {
    errors.push('VITE_APPWRITE_COLLECTION_TRANSACTIONS is not set');
  }
  
  // OpenAI is optional
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    console.log('VITE_OPENAI_API_KEY is not set - AI features will be disabled');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Debug function to log current environment
export function logEnvironment() {
  console.log('=== Environment Variables ===');
  console.log('VITE_APPWRITE_ENDPOINT:', import.meta.env.VITE_APPWRITE_ENDPOINT || 'NOT SET');
  console.log('VITE_APPWRITE_PROJECT_ID:', import.meta.env.VITE_APPWRITE_PROJECT_ID || 'NOT SET');
  console.log('VITE_APPWRITE_DATABASE_ID:', import.meta.env.VITE_APPWRITE_DATABASE_ID || 'NOT SET');
  console.log('VITE_APPWRITE_COLLECTION_USERS:', import.meta.env.VITE_APPWRITE_COLLECTION_USERS || 'NOT SET');
  console.log('VITE_APPWRITE_COLLECTION_TRANSACTIONS:', import.meta.env.VITE_APPWRITE_COLLECTION_TRANSACTIONS || 'NOT SET');
  console.log('VITE_OPENAI_API_KEY:', import.meta.env.VITE_OPENAI_API_KEY ? 'SET' : 'NOT SET');
  console.log('=============================');
}
