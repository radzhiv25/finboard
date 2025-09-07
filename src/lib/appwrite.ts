import { Client, Account, Databases, Storage, ID, Query, OAuthProvider } from 'appwrite';

// Appwrite configuration
const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '68bd87cf003939f9cf46');

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and collection IDs
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'finboard-db';
export const COLLECTION_USERS = import.meta.env.VITE_APPWRITE_COLLECTION_USERS || 'users';
export const COLLECTION_TRANSACTIONS = import.meta.env.VITE_APPWRITE_COLLECTION_TRANSACTIONS || 'transactions';
export const COLLECTION_GOALS = import.meta.env.VITE_APPWRITE_COLLECTION_GOALS || 'goals';
export const BUCKET_AVATARS = import.meta.env.VITE_APPWRITE_BUCKET_AVATARS || 'avatars';

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
    },

    // Get user transactions
    async getUserTransactions(limit = 50, offset = 0) {
        const user = await auth.getCurrentUser();
        if (!user) throw new Error('User not authenticated');

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
