import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import {
    BarChart3,
    DollarSign,
    PieChart,
    Settings,
    Shield,
    Brain,
    Wallet,
    ArrowLeft,
    CheckCircle,
    AlertTriangle,
    Zap,
    Database,
    Lock
} from 'lucide-react';

export function About() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                                <Wallet className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold">FinBoard</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                            >
                                <Link to="/">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Home
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">About FinBoard</h1>
                        <p className="text-xl text-muted-foreground mb-6">
                            Your intelligent personal finance companion powered by AI
                        </p>
                        <Badge variant="outline" className="text-sm">
                            <Brain className="h-4 w-4 mr-2" />
                            AI-Powered Financial Management
                        </Badge>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        <Card>
                            <CardHeader>
                                <BarChart3 className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Smart Dashboard</CardTitle>
                                <CardDescription>
                                    Real-time financial overview with intelligent insights
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Income & Expense Tracking
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Net Worth Calculation
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Multi-Currency Support
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <DollarSign className="h-8 w-8 text-green-600 mb-2" />
                                <CardTitle>Transaction Management</CardTitle>
                                <CardDescription>
                                    Easy expense tracking and income recording
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Quick Transaction Entry
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Category Management
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Date & Tag Organization
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Brain className="h-8 w-8 text-purple-600 mb-2" />
                                <CardTitle>AI Insights</CardTitle>
                                <CardDescription>
                                    Intelligent analysis of your spending patterns
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Spending Pattern Analysis
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Personalized Recommendations
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Trend Predictions
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <PieChart className="h-8 w-8 text-blue-600 mb-2" />
                                <CardTitle>Visual Reports</CardTitle>
                                <CardDescription>
                                    Comprehensive financial reporting and analytics
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Interactive Charts
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Category Breakdowns
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Export Capabilities
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Settings className="h-8 w-8 text-gray-600 mb-2" />
                                <CardTitle>Customizable Settings</CardTitle>
                                <CardDescription>
                                    Personalize your financial management experience
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Currency Preferences
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Theme Customization
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Notification Settings
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Shield className="h-8 w-8 text-orange-600 mb-2" />
                                <CardTitle>Secure & Private</CardTitle>
                                <CardDescription>
                                    Your financial data is protected with enterprise-grade security
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        End-to-End Encryption
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Secure Authentication
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Privacy-First Design
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* AI Usage Limits Section */}
                    <Card className="mb-12 border-orange-200 bg-orange-50/50">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-6 w-6 text-orange-600" />
                                <CardTitle className="text-orange-800">AI Usage Limits</CardTitle>
                            </div>
                            <CardDescription className="text-orange-700">
                                Important information about AI features and usage restrictions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-white rounded-lg p-4 border border-orange-200">
                                <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                                    <Zap className="h-4 w-4" />
                                    Free Tier Limitations
                                </h4>
                                <ul className="space-y-2 text-sm text-orange-700">
                                    <li>• AI insights are limited to basic analysis due to free API key restrictions</li>
                                    <li>• Advanced AI features may have usage quotas per month</li>
                                    <li>• Some AI-powered recommendations may be simplified</li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-lg p-4 border border-orange-200">
                                <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                                    <Database className="h-4 w-4" />
                                    Data Processing
                                </h4>
                                <ul className="space-y-2 text-sm text-orange-700">
                                    <li>• Financial data is processed locally when possible</li>
                                    <li>• AI analysis is performed using secure, encrypted connections</li>
                                    <li>• No personal financial data is stored by third-party AI services</li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-lg p-4 border border-orange-200">
                                <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    Privacy & Security
                                </h4>
                                <ul className="space-y-2 text-sm text-orange-700">
                                    <li>• All AI processing respects your privacy and data protection</li>
                                    <li>• Financial transactions are anonymized before AI analysis</li>
                                    <li>• You can disable AI features at any time in settings</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Technology Stack */}
                    <Card className="mb-12">
                        <CardHeader>
                            <CardTitle>Technology Stack</CardTitle>
                            <CardDescription>
                                Built with modern technologies for reliability and performance
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-3">Frontend</h4>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li>• React 18 with TypeScript</li>
                                        <li>• Tailwind CSS for styling</li>
                                        <li>• Framer Motion for animations</li>
                                        <li>• Lucide React for icons</li>
                                        <li>• React Router for navigation</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-3">Backend & Services</h4>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li>• Appwrite for authentication & database</li>
                                        <li>• OpenAI API for AI insights</li>
                                        <li>• Vite for build tooling</li>
                                        <li>• Appwrite Sites for deployment</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Call to Action */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
                        <p className="text-muted-foreground mb-6">
                            Join thousands of users who are taking control of their finances with FinBoard
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" asChild>
                                <Link to="/signup">
                                    Create Free Account
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link to="/login">
                                    Sign In
                                </Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
}
