import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, Save, DollarSign, BarChart3, Bell, LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserPreferences {
    currency: 'USD' | 'INR';
    theme: 'light' | 'dark';
    notifications: boolean;
}

export function Settings() {
    const { userProfile, updatePreferences, logout } = useAuth();
    const navigate = useNavigate();
    const [preferences, setPreferences] = useState<UserPreferences>({
        currency: 'INR',
        theme: 'light',
        notifications: true,
    });
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (userProfile && 'preferences' in userProfile) {
            try {
                const parsed = JSON.parse((userProfile as { preferences: string }).preferences);
                setPreferences({
                    currency: parsed.currency || 'INR',
                    theme: parsed.theme || 'light',
                    notifications: parsed.notifications !== false,
                });
            } catch (error) {
                console.error('Failed to parse user preferences:', error);
            }
        }
    }, [userProfile]);

    const handleSave = async () => {
        try {
            setLoading(true);
            await updatePreferences(preferences);
            setSaved(true);
            setTimeout(() => setSaved(false), 1000);
            // Use replace to avoid back button issues
            navigate('/dashboard', { replace: true });
        } catch (error) {
            console.error('Failed to save preferences:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                <BarChart3 className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold">FinBoard</span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm">
                                <Bell className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                            >
                                <Link to="/settings">
                                    <SettingsIcon className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={logout}>
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Settings</h1>
                    <p className="text-muted-foreground mb-8">
                        Manage your account preferences and application settings
                    </p>

                    <div className="space-y-6">
                        {/* Currency Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Currency Preferences
                                </CardTitle>
                                <CardDescription>
                                    Set your default currency for transactions and displays
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Default Currency</Label>
                                    <Select
                                        value={preferences.currency}
                                        onValueChange={(value: 'USD' | 'INR') =>
                                            setPreferences(prev => ({ ...prev, currency: value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                                            <SelectItem value="INR">INR (₹) - Indian Rupee</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Theme Settings - Commented out for now */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle>Appearance</CardTitle>
                                <CardDescription>
                                    Customize the look and feel of your application
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="theme">Theme</Label>
                                    <Select
                                        value={preferences.theme}
                                        onValueChange={(value: 'light' | 'dark') =>
                                            setPreferences(prev => ({ ...prev, theme: value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select theme" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">Light</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card> */}

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className="min-w-[120px]"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                                        Saving...
                                    </>
                                ) : saved ? (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Saved!
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
