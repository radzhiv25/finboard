import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth, type User, type Models } from '@/lib/appwrite';
import { OAuthProvider } from 'appwrite';

interface AuthContextType {
    user: User | null;
    userProfile: Models.Document | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    loginWithOAuth: (provider: OAuthProvider) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (name: string, preferences?: any) => Promise<void>;
    updatePreferences: (preferences: any) => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<Models.Document | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        try {

            // Use Promise.race to add a timeout to the API call
            const currentUser = await Promise.race([
                auth.getCurrentUser(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Auth timeout')), 4000)
                )
            ]) as any;

            setUser(currentUser);

            if (currentUser) {
                try {

                    // Add timeout to profile fetch as well
                    const profile = await Promise.race([
                        auth.getUserProfile(),
                        new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Profile timeout')), 3000)
                        )
                    ]) as any;

                    setUserProfile(profile);
                } catch (error: any) {

                    // If it's a timeout, create a default profile
                    if (error.message === 'Profile timeout') {
                        const defaultProfile = {
                            name: currentUser.name || 'User',
                            preferences: JSON.stringify({
                                currency: 'INR',
                                theme: 'light',
                                notifications: true
                            })
                        } as any;
                        setUserProfile(defaultProfile);
                        return;
                    }

                    // Handle specific Appwrite errors
                    if (error.code === 401 || error.type === 'general_unauthorized_scope') {
                        // User session expired or invalid
                        setUser(null);
                        setUserProfile(null);
                    } else if (error.message.includes('Database or collection not found')) {
                        // Database doesn't exist yet, create a default profile
                        const defaultProfile = {
                            name: currentUser.name || 'User',
                            preferences: JSON.stringify({
                                currency: 'INR',
                                theme: 'light',
                                notifications: true
                            })
                        } as any;
                        setUserProfile(defaultProfile);
                    } else {
                        console.error('Failed to fetch user profile:', error);
                        // Create a default profile on any other error
                        const defaultProfile = {
                            name: currentUser.name || 'User',
                            preferences: JSON.stringify({
                                currency: 'INR',
                                theme: 'light',
                                notifications: true
                            })
                        } as any;
                        setUserProfile(defaultProfile);
                    }
                }
            } else {
                setUserProfile(null);
            }
        } catch (error: any) {

            // If it's a timeout, assume user is not authenticated
            if (error.message === 'Auth timeout') {
                setUser(null);
                setUserProfile(null);
                return;
            }

            // Handle specific Appwrite errors
            if (error.code === 401 || error.type === 'general_unauthorized_scope') {
                // User is not authenticated, this is normal
                setUser(null);
                setUserProfile(null);
            } else {
                console.error('Failed to refresh user:', error);
                setUser(null);
                setUserProfile(null);
            }
        }
    };

    useEffect(() => {
        let isMounted = true;

        const initializeAuth = async () => {
            try {
                await refreshUser();
            } catch (error) {
                console.error('Auth initialization failed:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        // Add a timeout to prevent infinite loading - increased to 5 seconds
        const timeout = setTimeout(() => {
            console.warn('Auth initialization timeout, setting loading to false');
            if (isMounted) {
                setLoading(false);
            }
        }, 5000); // 5 second timeout for better reliability

        initializeAuth();

        return () => {
            isMounted = false;
            clearTimeout(timeout);
        };
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            await auth.login(email, password);
            await refreshUser();
        } catch (error: any) {
            setLoading(false);
            // Provide more user-friendly error messages
            if (error.code === 401) {
                throw new Error('Invalid email or password');
            } else if (error.code === 429) {
                throw new Error('Too many login attempts. Please try again later.');
            } else if (error.message) {
                throw new Error(error.message);
            } else {
                throw new Error('Login failed. Please try again.');
            }
        }
    };

    const signup = async (email: string, password: string, name: string) => {
        try {
            setLoading(true);
            await auth.createAccount(email, password, name);
            await refreshUser();
        } catch (error: any) {
            setLoading(false);
            // Provide more user-friendly error messages
            if (error.code === 409) {
                throw new Error('An account with this email already exists');
            } else if (error.code === 400) {
                throw new Error('Invalid email or password format');
            } else if (error.message) {
                throw new Error(error.message);
            } else {
                throw new Error('Signup failed. Please try again.');
            }
        }
    };

    const loginWithOAuth = async (provider: OAuthProvider) => {
        try {
            setLoading(true);
            await auth.loginWithOAuth(provider);
            // Note: OAuth redirects, so we'll refresh user on page load
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await auth.logout();
            setUser(null);
            setUserProfile(null);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (name: string, preferences?: any) => {
        try {
            setLoading(true);
            await auth.updateProfile(name, preferences);
            await refreshUser();
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const updatePreferences = async (preferences: any) => {
        try {
            setLoading(true);
            await auth.updatePreferences(preferences);
            await refreshUser();
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        userProfile,
        loading,
        login,
        signup,
        loginWithOAuth,
        logout,
        updateProfile,
        updatePreferences,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
