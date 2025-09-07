import { useAuth } from '@/contexts/AuthContext';

export function DebugAuth() {
    const { user, loading, userProfile, refreshUser } = useAuth();

    const handleForceRefresh = () => {
        console.log('Force refreshing auth...');
        refreshUser();
    };

    return (
        <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg text-xs z-50 max-w-xs">
            <div>Loading: {loading ? 'true' : 'false'}</div>
            <div>User: {user ? 'logged in' : 'not logged in'}</div>
            <div>Profile: {userProfile ? 'loaded' : 'not loaded'}</div>
            <div>Path: {window.location.pathname}</div>
            <button
                onClick={handleForceRefresh}
                className="mt-2 px-2 py-1 bg-blue-600 text-white rounded text-xs"
            >
                Force Refresh
            </button>
        </div>
    );
}
