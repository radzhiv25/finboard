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

