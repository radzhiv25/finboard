import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { transactions } from '@/lib/appwrite';
import { aiService } from '@/lib/openai';
import { TransactionDialog } from '@/components/TransactionDialog';
import {
    BarChart3,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Plus,
    Settings,
    LogOut,
    Wallet,
    PieChart,
    Calendar,
    Bell,
    Brain,
    Sparkles
} from 'lucide-react';

interface Transaction {
    $id: string;
    title: string;
    description: string;
    amount: number;
    currency: 'USD' | 'INR';
    category: string;
    date: string;
    tags?: string;
}

interface AIInsight {
    category: string;
    confidence: number;
    suggestion: string;
    spendingPattern?: string;
}

export function Dashboard() {
    const { user, userProfile, logout } = useAuth();
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
    const [loading, setLoading] = useState(true);
    const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);

    const generateAIInsights = useCallback(async (transactions: Transaction[]) => {
        try {
            if (transactions.length === 0) {
                setAiInsights([]);
                return;
            }

            // Check if OpenAI API key is available
            const hasOpenAIKey = import.meta.env.VITE_OPENAI_API_KEY;

            if (hasOpenAIKey) {
                const insights = await aiService.generateInsights(transactions);
                setAiInsights(insights);
            } else {
                // Fallback to mock insights if no OpenAI key
                const mockInsights: AIInsight[] = [
                    {
                        category: 'Food & Dining',
                        confidence: 0.85,
                        suggestion: 'Consider meal planning to reduce dining out expenses',
                        spendingPattern: 'High spending on weekends'
                    },
                    {
                        category: 'Transportation',
                        confidence: 0.92,
                        suggestion: 'Your transportation costs are 15% higher than last month',
                        spendingPattern: 'Consistent daily spending'
                    }
                ];
                setAiInsights(mockInsights);
            }
        } catch (error) {
            console.error('Failed to generate AI insights:', error);
            // Set empty insights on error
            setAiInsights([]);
        }
    }, []);

    const loadDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const transactionsData = await transactions.getUserTransactions(10);
            setRecentTransactions(transactionsData.documents as unknown as Transaction[]);

            // Generate AI insights based on transactions
            await generateAIInsights(transactionsData.documents as unknown as Transaction[]);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }, [generateAIInsights]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    const calculateTotals = () => {
        const incomeCategories = ['Income', 'Investment'];

        const totalIncome = recentTransactions
            .filter(t => incomeCategories.includes(t.category))
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = recentTransactions
            .filter(t => !incomeCategories.includes(t.category))
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            income: totalIncome,
            expenses: totalExpenses,
            net: totalIncome - totalExpenses
        };
    };

    const totals = calculateTotals();

    const formatCurrency = (amount: number, currency: 'USD' | 'INR' = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const handleTransactionSuccess = () => {
        // Refresh the dashboard data when a new transaction is added
        loadDashboardData();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    </div>
                    <p className="text-muted-foreground">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

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
                                onClick={() => window.location.href = '/settings'}
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={logout}>
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold mb-2">
                        Welcome back, {(userProfile as { name?: string })?.name || user?.name}!
                    </h1>
                    <p className="text-muted-foreground">
                        Here's an overview of your financial dashboard
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(totals.income)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                            <TrendingDown className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {formatCurrency(totals.expenses)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
                            <DollarSign className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${totals.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(totals.net)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This month
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Transactions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Recent Transactions</CardTitle>
                                    <CardDescription>Your latest financial activity</CardDescription>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setIsTransactionDialogOpen(true)}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentTransactions.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No transactions yet</p>
                                            <p className="text-sm">Start by adding your first transaction</p>
                                        </div>
                                    ) : (
                                        recentTransactions.map((transaction) => {
                                            const incomeCategories = ['Income', 'Investment'];
                                            const isIncome = incomeCategories.includes(transaction.category);

                                            return (
                                                <div key={transaction.$id} className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isIncome
                                                            ? 'bg-green-100 text-green-600'
                                                            : 'bg-red-100 text-red-600'
                                                            }`}>
                                                            {isIncome ? (
                                                                <TrendingUp className="h-4 w-4" />
                                                            ) : (
                                                                <TrendingDown className="h-4 w-4" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{transaction.title}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {transaction.category} • {formatDate(transaction.date)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`font-medium ${isIncome ? 'text-green-600' : 'text-red-600'
                                                            }`}>
                                                            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">{transaction.currency}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* AI Insights */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Brain className="h-5 w-5" />
                                        AI Insights
                                    </CardTitle>
                                    <CardDescription>Smart analysis of your spending patterns</CardDescription>
                                </div>
                                <Button size="sm" variant="outline">
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Refresh
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {aiInsights.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No insights yet</p>
                                            <p className="text-sm">Add some transactions to get AI-powered insights</p>
                                        </div>
                                    ) : (
                                        aiInsights.map((insight, index) => (
                                            <div key={index} className="space-y-2 p-3 bg-muted/50 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium">{insight.category}</h4>
                                                    <Badge variant="outline" className="text-xs">
                                                        {Math.round(insight.confidence * 100)}% confidence
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{insight.suggestion}</p>
                                                {insight.spendingPattern && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Pattern: {insight.spendingPattern}
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common tasks to manage your finances</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Button
                                    variant="outline"
                                    className="h-20 flex-col space-y-2"
                                    onClick={() => setIsTransactionDialogOpen(true)}
                                >
                                    <Plus className="h-6 w-6" />
                                    <span>Add Transaction</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <Brain className="h-6 w-6" />
                                    <span>AI Analysis</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <PieChart className="h-6 w-6" />
                                    <span>View Reports</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col space-y-2">
                                    <Calendar className="h-6 w-6" />
                                    <span>Schedule</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Transaction Dialog */}
            <TransactionDialog
                open={isTransactionDialogOpen}
                onOpenChange={setIsTransactionDialogOpen}
                onSuccess={handleTransactionSuccess}
            />
        </div>
    );
}
