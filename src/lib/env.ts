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
        return fallback;
    }

    return value;
}

// Appwrite configuration
export const appwriteConfig: AppwriteConfig = {
    endpoint: getEnvVar('VITE_APPWRITE_ENDPOINT', 'https://sfo.cloud.appwrite.io/v1'),
    projectId: getEnvVar('VITE_APPWRITE_PROJECT_ID', '68bd87cf003939f9cf46'),
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

    console.log('🔍 Environment Variables Check:');
    console.log('================================');

    // Check required Appwrite variables
    const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
    const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionUsers = import.meta.env.VITE_APPWRITE_COLLECTION_USERS;
    const collectionTransactions = import.meta.env.VITE_APPWRITE_COLLECTION_TRANSACTIONS;

    if (!endpoint) {
        errors.push('VITE_APPWRITE_ENDPOINT is not set');
    }

    if (!projectId) {
        errors.push('VITE_APPWRITE_PROJECT_ID is not set');
    }

    if (!databaseId) {
        errors.push('VITE_APPWRITE_DATABASE_ID is not set');
    }

    if (!collectionUsers) {
        errors.push('VITE_APPWRITE_COLLECTION_USERS is not set');
    }

    if (!collectionTransactions) {
        errors.push('VITE_APPWRITE_COLLECTION_TRANSACTIONS is not set');
    }

    // OpenAI is optional
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
        console.log('ℹ️  VITE_OPENAI_API_KEY is not set - AI features will be disabled');
    }

    if (errors.length > 0) {
        console.error('❌ Environment validation failed!');
        console.error('Please set up your environment variables:');
        errors.forEach(error => console.error(`   - ${error}`));
        console.error('\nRun: node setup-environment.js');
        console.error('Then follow APPWRITE_SETUP_GUIDE.md for database setup');
    } else {
        console.log('✅ All required environment variables are set!');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

