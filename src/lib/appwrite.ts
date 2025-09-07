import { Client, Account, Databases, Storage, ID, Query, OAuthProvider } from 'appwrite';
import { appwriteConfig, validateEnvironment } from './env';

// Validate environment variables
const envValidation = validateEnvironment();
if (!envValidation.isValid) {
    console.error('Environment validation failed:', envValidation.errors);
}

// Appwrite configuration
const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Debug function to check database and collections
export async function debugAppwrite() {
    try {
        console.log('=== Appwrite Debug ===');
        console.log('Endpoint:', appwriteConfig.endpoint);
        console.log('Project ID:', appwriteConfig.projectId);
        console.log('Database ID:', appwriteConfig.databaseId);
        console.log('Collection Users:', appwriteConfig.collectionUsers);
        console.log('Collection Transactions:', appwriteConfig.collectionTransactions);
        
        // Test basic connection by trying to get user profile
        console.log('1. Testing basic connection...');
        try {
            const user = await account.get();
            console.log('✅ User authenticated:', user.name);
            
            // Try to get user profile (this will test database access)
            console.log('2. Testing database access...');
            try {
                const profile = await databases.getDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.collectionUsers,
                    user.$id
                );
                console.log('✅ Database and collections are working!');
                console.log('Profile:', profile);
            } catch (profileError: any) {
                console.log('❌ Database/Collection error:', profileError.message);
                if (profileError.message.includes('Database not found')) {
                    console.log('The database ID might be wrong. Check your Appwrite console.');
                } else if (profileError.message.includes('Collection not found')) {
                    console.log('The collection ID might be wrong. Check your Appwrite console.');
                }
            }
            
        } catch (authError: any) {
            console.log('❌ Authentication failed:', authError.message);
        }
        
    } catch (error: any) {
        console.error('Debug error:', error.message);
    }
}

// Make debug function available globally
if (typeof window !== 'undefined') {
    (window as any).debugAppwrite = debugAppwrite;
}

// Database and collection IDs
export const DATABASE_ID = appwriteConfig.databaseId;
export const COLLECTION_USERS = appwriteConfig.collectionUsers;
export const COLLECTION_TRANSACTIONS = appwriteConfig.collectionTransactions;
export const COLLECTION_GOALS = appwriteConfig.collectionGoals;
export const BUCKET_AVATARS = appwriteConfig.bucketAvatars;

// Types
interface UserPreferences {
    currency: string;
    theme: string;
    notifications: boolean;
}

interface TransactionData {
    title: string;
    description: string;
    amount: number;
    currency: 'USD' | 'INR';
    category: string;
    date: string;
    tags?: string[];
}

interface GoalData {
    title: string;
    description?: string;
    targetAmount: number;
    targetDate: string;
}

interface UpdateData {
    [key: string]: unknown;
}

// Auth functions
export const auth = {
    // Create account
    async createAccount(email: string, password: string, name: string) {
        try {
            const user = await account.create(ID.unique(), email, password, name);

            // Create user document in database
            try {
                await databases.createDocument(
                    DATABASE_ID,
                    COLLECTION_USERS,
                    user.$id,
                    {
                        name,
                        email,
                        createdAt: new Date().toISOString(),
                        preferences: JSON.stringify({
                            currency: 'USD',
                            theme: 'light',
                            notifications: true
                        } as UserPreferences)
                    }
                );
            } catch (dbError: any) {
                console.error('Database error during account creation:', dbError);
                if (dbError.code === 404) {
                    throw new Error('Database or collection not found. Please check your Appwrite setup. See APPWRITE_SETUP_GUIDE.md for instructions.');
                }
                throw new Error(`Failed to create user profile: ${dbError.message}`);
            }

            return user;
        } catch (error: any) {
            console.error('Account creation error:', error);
            throw error;
        }
    },

    // Login with email and password
    async login(email: string, password: string) {
        return await account.createEmailPasswordSession(email, password);
    },

    // Login with OAuth
    async loginWithOAuth(provider: OAuthProvider) {
        return await account.createOAuth2Session(provider, `${window.location.origin}/dashboard`, `${window.location.origin}/login`);
    },

    // Get current user
    async getCurrentUser() {
        try {
            return await account.get();
        } catch (error: any) {
            // Handle specific Appwrite errors
            if (error.code === 401 || error.type === 'general_unauthorized_scope') {
                // User is not authenticated, return null
                return null;
            }
            // For other errors, log and return null
            console.warn('Auth check failed:', error.message);
            return null;
        }
    },

    // Logout
    async logout() {
        return await account.deleteSession('current');
    },

    // Update user profile
    async updateProfile(name: string, preferences?: UserPreferences) {
        const user = await this.getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        return await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_USERS,
            user.$id,
            {
                name,
                ...(preferences && { preferences: JSON.stringify(preferences) })
            }
        );
    },

    // Update user preferences only
    async updatePreferences(preferences: UserPreferences) {
        const user = await this.getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        return await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_USERS,
            user.$id,
            {
                preferences: JSON.stringify(preferences)
            }
        );
    },

    // Get user profile
    async getUserProfile() {
        const user = await this.getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        try {
            return await databases.getDocument(
                DATABASE_ID,
                COLLECTION_USERS,
                user.$id
            );
        } catch (error: any) {
            console.error('Profile fetch error:', error);
            if (error.code === 404) {
                throw new Error('Database or collection not found. Please check your Appwrite setup. See APPWRITE_SETUP_GUIDE.md for instructions.');
            }
            throw new Error(`Failed to fetch user profile: ${error.message}`);
        }
    }
};

// Transaction functions
export const transactions = {
    // Create transaction
    async create(transaction: TransactionData) {
        const user = await auth.getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        try {
            return await databases.createDocument(
                DATABASE_ID,
                COLLECTION_TRANSACTIONS,
                ID.unique(),
                {
                    userId: user.$id,
                    ...transaction,
                    tags: transaction.tags ? JSON.stringify(transaction.tags) : null
                }
            );
        } catch (error: any) {
            console.error('Transaction creation failed:', error);
            if (error.code === 404) {
                throw new Error('Database not found. Please set up your Appwrite database first. See APPWRITE_SETUP_GUIDE.md for instructions.');
            }
            throw new Error(`Failed to create transaction: ${error.message}`);
        }
    },

    // Get user transactions
    async getUserTransactions(limit = 50, offset = 0) {
        const user = await auth.getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        try {
            return await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_TRANSACTIONS,
                [
                    Query.equal('userId', user.$id),
                    Query.orderDesc('date'),
                    Query.limit(limit),
                    Query.offset(offset)
                ]
            );
        } catch (error: any) {
            console.error('Failed to load transactions:', error);
            if (error.code === 404) {
                // Database not found, return empty result
                console.log('Database not found, returning empty transactions list');
                return { documents: [], total: 0 };
            }
            throw new Error(`Failed to load transactions: ${error.message}`);
        }
    },

    // Update transaction
    async update(transactionId: string, data: UpdateData) {
        return await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_TRANSACTIONS,
            transactionId,
            data
        );
    },

    // Delete transaction
    async delete(transactionId: string) {
        return await databases.deleteDocument(
            DATABASE_ID,
            COLLECTION_TRANSACTIONS,
            transactionId
        );
    }
};

// Goals functions
export const goals = {
    // Create goal
    async create(goal: GoalData) {
        const user = await auth.getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        return await databases.createDocument(
            DATABASE_ID,
            COLLECTION_GOALS,
            ID.unique(),
            {
                userId: user.$id,
                ...goal,
                currentAmount: 0,
                status: 'active',
                createdAt: new Date().toISOString()
            }
        );
    },

    // Get user goals
    async getUserGoals() {
        const user = await auth.getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        return await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_GOALS,
            [
                Query.equal('userId', user.$id),
                Query.orderDesc('createdAt')
            ]
        );
    },

    // Update goal
    async update(goalId: string, data: UpdateData) {
        return await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_GOALS,
            goalId,
            data
        );
    },

    // Delete goal
    async delete(goalId: string) {
        return await databases.deleteDocument(
            DATABASE_ID,
            COLLECTION_GOALS,
            goalId
        );
    }
};

// File upload functions
export const files = {
    // Upload avatar
    async uploadAvatar(file: File) {
        const user = await auth.getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        return await storage.createFile(
            BUCKET_AVATARS,
            ID.unique(),
            file
        );
    },

    // Get avatar URL
    getAvatarUrl(fileId: string) {
        return storage.getFileView(BUCKET_AVATARS, fileId);
    },

    // Delete avatar
    async deleteAvatar(fileId: string) {
        return await storage.deleteFile(BUCKET_AVATARS, fileId);
    }
};

// Define User type based on Appwrite's User model
export type User = {
    $id: string;
    name: string;
    email: string;
    registration: string;
    emailVerification: boolean;
    prefs: Record<string, unknown>;
};

// Re-export Models type from appwrite
export type { Models } from 'appwrite';

export default client;
