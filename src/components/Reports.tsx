import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { transactions } from '@/lib/appwrite';
import { useAuth } from '@/contexts/AuthContext';
import { CSVManagerDialog } from '@/components/CSVManagerDialog';
import {
    BarChart3,
    TrendingUp,
    DollarSign,
    ArrowLeft,
    Filter,
    RefreshCw,
    Activity,
    Target,
    FileSpreadsheet
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface Transaction {
    $id: string;
    title: string;
    description: string;
    amount: number;
    currency: 'USD' | 'INR';
    category: string;
    type: 'income' | 'expense';
    date: string;
    tags?: string;
}

interface CategoryData {
    category: string;
    amount: number;
    count: number;
    percentage: number;
}

interface MonthlyData {
    month: string;
    expenses: number;
    income: number;
}

interface ChartData {
    name: string;
    value: number;
    color: string;
}

interface WeeklyData {
    week: string;
    expenses: number;
    income: number;
}

const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00',
    '#ff00ff', '#00ffff', '#ffff00', '#ff0000', '#0000ff'
];

export function Reports() {
    const { userProfile } = useAuth();
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
    const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
    const [pieChartData, setPieChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('3months');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [chartType, setChartType] = useState<'monthly' | 'weekly'>('monthly');
    const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'INR'>(() => {
        // Check localStorage first, then user preferences, default to INR
        const stored = localStorage.getItem('finboard-currency');
        if (stored === 'USD' || stored === 'INR') {
            return stored;
        }
        return 'INR'; // Default to INR
    });

    // CSV-related state
    const [showCSVDialog, setShowCSVDialog] = useState(false);

    const loadReportsData = useCallback(async () => {
        try {
            setLoading(true);

            // Add timeout to prevent hanging
            const transactionsData = await Promise.race([
                transactions.getUserTransactions(100), // Get more transactions for reports
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Reports timeout')), 8000)
                )
            ]) as { documents: Transaction[] };

            const allTransactionsData = transactionsData.documents as unknown as Transaction[];

            // Filter transactions by selected currency
            const filteredTransactions = allTransactionsData.filter(transaction =>
                transaction.currency === selectedCurrency
            );

            setAllTransactions(filteredTransactions);

            // Process category data - expenses only
            const categoryMap = new Map<string, { amount: number; count: number }>();

            filteredTransactions.forEach(transaction => {
                const amount = Math.abs(transaction.amount); // Always positive for expenses

                if (categoryMap.has(transaction.category)) {
                    const existing = categoryMap.get(transaction.category)!;
                    categoryMap.set(transaction.category, {
                        amount: existing.amount + amount,
                        count: existing.count + 1
                    });
                } else {
                    categoryMap.set(transaction.category, {
                        amount: amount,
                        count: 1
                    });
                }
            });

            const totalAmount = Array.from(categoryMap.values()).reduce((sum, data) => sum + data.amount, 0);
            const categoryDataArray = Array.from(categoryMap.entries()).map(([category, data]) => ({
                category,
                amount: data.amount,
                count: data.count,
                percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0
            })).sort((a, b) => b.amount - a.amount);

            setCategoryData(categoryDataArray);

            // Process monthly data - income and expenses
            const monthlyMap = new Map<string, { expenses: number; income: number }>();

            filteredTransactions.forEach(transaction => {
                const date = new Date(transaction.date);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

                if (monthlyMap.has(monthKey)) {
                    const existing = monthlyMap.get(monthKey)!;
                    if (transaction.type === 'income') {
                        existing.income += Math.abs(transaction.amount);
                    } else {
                        existing.expenses += Math.abs(transaction.amount);
                    }
                } else {
                    if (transaction.type === 'income') {
                        monthlyMap.set(monthKey, {
                            expenses: 0,
                            income: Math.abs(transaction.amount)
                        });
                    } else {
                        monthlyMap.set(monthKey, {
                            expenses: Math.abs(transaction.amount),
                            income: 0
                        });
                    }
                }
            });

            const monthlyDataArray = Array.from(monthlyMap.entries())
                .map(([month, data]) => ({
                    month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    expenses: data.expenses,
                    income: data.income
                }))
                .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
                .slice(-6); // Last 6 months

            setMonthlyData(monthlyDataArray);

            // Process weekly data - income and expenses
            const weeklyMap = new Map<string, { expenses: number; income: number }>();

            filteredTransactions.forEach(transaction => {
                const date = new Date(transaction.date);
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
                const weekKey = weekStart.toISOString().split('T')[0];

                if (weeklyMap.has(weekKey)) {
                    const existing = weeklyMap.get(weekKey)!;
                    if (transaction.type === 'income') {
                        existing.income += Math.abs(transaction.amount);
                    } else {
                        existing.expenses += Math.abs(transaction.amount);
                    }
                } else {
                    if (transaction.type === 'income') {
                        weeklyMap.set(weekKey, {
                            expenses: 0,
                            income: Math.abs(transaction.amount)
                        });
                    } else {
                        weeklyMap.set(weekKey, {
                            expenses: Math.abs(transaction.amount),
                            income: 0
                        });
                    }
                }
            });

            const weeklyDataArray = Array.from(weeklyMap.entries())
                .map(([week, data]) => ({
                    week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    expenses: data.expenses,
                    income: data.income
                }))
                .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime())
                .slice(-8); // Last 8 weeks

            setWeeklyData(weeklyDataArray);

            // Process bar chart data
            const barData = categoryDataArray.slice(0, 8).map((cat, index) => ({
                name: cat.category,
                value: cat.amount,
                color: COLORS[index % COLORS.length]
            }));

            setPieChartData(barData);

        } catch (error) {
            console.error('Failed to load reports data:', error);
            // Set empty state on error
            setAllTransactions([]);
            setCategoryData([]);
            setMonthlyData([]);
            setWeeklyData([]);
            setPieChartData([]);
        } finally {
            setLoading(false);
        }
    }, [selectedCurrency]);

    useEffect(() => {
        loadReportsData();
    }, [loadReportsData]);

    const formatCurrency = (amount: number, currency: 'USD' | 'INR' = selectedCurrency) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const getCurrency = () => {
        if (userProfile && 'preferences' in userProfile) {
            try {
                const prefs = JSON.parse((userProfile as { preferences: string }).preferences);
                return prefs.currency || 'INR';
            } catch (error) {
                console.warn('Failed to parse user preferences:', error);
            }
        }
        return 'INR';
    };

    const userCurrency = getCurrency();

    // Handle currency change and persist it
    const handleCurrencyChange = (currency: 'USD' | 'INR') => {
        setSelectedCurrency(currency);
        localStorage.setItem('finboard-currency', currency);
    };

    // CSV handling functions
    const handleCSVSuccess = async () => {
        await loadReportsData();
    };

    // Set initial currency from user preferences (but prioritize localStorage)
    useEffect(() => {
        if (userCurrency && (userCurrency === 'USD' || userCurrency === 'INR')) {
            // Only update if localStorage doesn't have a preference
            if (!localStorage.getItem('finboard-currency')) {
                setSelectedCurrency(userCurrency);
                localStorage.setItem('finboard-currency', userCurrency);
            }
        }
    }, [userCurrency]);

    const filteredCategoryData = selectedCategory === 'all'
        ? categoryData
        : categoryData.filter(cat => cat.category === selectedCategory);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    </div>
                    <p className="text-muted-foreground">Loading reports...</p>
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
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" asChild>
                                <Link to="/dashboard">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Dashboard
                                </Link>
                            </Button>
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                <BarChart3 className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold">Financial Reports</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
                                <SelectTrigger className="w-20 h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="INR">INR</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowCSVDialog(true)}
                            >
                                <FileSpreadsheet className="h-4 w-4 mr-2" />
                                CSV Manager
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={loadReportsData}
                                disabled={loading}
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filters
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Currency</label>
                                    <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                            <SelectItem value="INR">INR (₹)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Time Range</label>
                                    <Select value={timeRange} onValueChange={setTimeRange}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1month">Last Month</SelectItem>
                                            <SelectItem value="3months">Last 3 Months</SelectItem>
                                            <SelectItem value="6months">Last 6 Months</SelectItem>
                                            <SelectItem value="1year">Last Year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {categoryData.map((cat) => (
                                                <SelectItem key={cat.category} value={cat.category}>
                                                    {cat.category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Bar Chart - Category Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="h-fit">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <BarChart3 className="h-4 w-4" />
                                    Categories
                                </CardTitle>
                                <CardDescription className="text-sm">Spending by category</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pieChartData.length === 0 ? (
                                    <div className="text-center py-6 text-muted-foreground">
                                        <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No data</p>
                                    </div>
                                ) : (
                                    <div className="h-48">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={pieChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                                                <XAxis
                                                    dataKey="name"
                                                    fontSize={12}
                                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                                />
                                                <YAxis
                                                    fontSize={12}
                                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                                />
                                                <Tooltip
                                                    formatter={(value) => formatCurrency(Number(value), selectedCurrency)}
                                                    contentStyle={{
                                                        backgroundColor: 'hsl(var(--popover))',
                                                        border: '1px solid hsl(var(--border))',
                                                        borderRadius: '6px',
                                                        fontSize: '12px'
                                                    }}
                                                />
                                                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Line Chart - Financial Trends */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="h-fit">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    Trends
                                </CardTitle>
                                <CardDescription className="text-sm">Income and expense trends over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {monthlyData.length === 0 ? (
                                    <div className="text-center py-6 text-muted-foreground">
                                        <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No data</p>
                                    </div>
                                ) : (
                                    <div className="h-48">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={monthlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                                                <XAxis
                                                    dataKey="month"
                                                    fontSize={12}
                                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                                />
                                                <YAxis
                                                    fontSize={12}
                                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                                />
                                                <Tooltip
                                                    formatter={(value) => formatCurrency(Number(value), selectedCurrency)}
                                                    contentStyle={{
                                                        backgroundColor: 'hsl(var(--popover))',
                                                        border: '1px solid hsl(var(--border))',
                                                        borderRadius: '6px',
                                                        fontSize: '12px'
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="income"
                                                    stroke="#000000"
                                                    strokeWidth={2}
                                                    dot={{ fill: '#000000', strokeWidth: 2, r: 4 }}
                                                    name="Income"
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="expenses"
                                                    stroke="#ff0000"
                                                    strokeWidth={2}
                                                    dot={{ fill: '#ff0000', strokeWidth: 2, r: 4 }}
                                                    name="Expenses"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Mini Summary Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="h-full">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    Summary
                                </CardTitle>
                                <CardDescription className="text-sm">Quick overview</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 mt-auto flex flex-col justify-end">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Total Expenses</span>
                                        <span className="text-sm font-medium text-red-600">
                                            {formatCurrency(
                                                categoryData.reduce((sum, cat) => sum + cat.amount, 0),
                                                selectedCurrency
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Average Expense</span>
                                        <span className="text-sm font-medium text-orange-600">
                                            {formatCurrency(
                                                categoryData.length > 0 ? categoryData.reduce((sum, cat) => sum + cat.amount, 0) / categoryData.length : 0,
                                                selectedCurrency
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t">
                                        <span className="text-sm font-medium">Categories</span>
                                        <span className="text-sm font-bold text-primary">
                                            {categoryData.length}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Time-based Charts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Activity className="h-4 w-4" />
                                        Performance
                                    </CardTitle>
                                    <CardDescription className="text-sm">Financial trends over time</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select value={chartType} onValueChange={(value: 'monthly' | 'weekly') => setChartType(value)}>
                                        <SelectTrigger className="w-28 h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {chartType === 'monthly' ? (
                                monthlyData.length === 0 ? (
                                    <div className="text-center py-6 text-muted-foreground">
                                        <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No monthly data</p>
                                    </div>
                                ) : (
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                                                <XAxis
                                                    dataKey="month"
                                                    fontSize={12}
                                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                                />
                                                <YAxis
                                                    fontSize={12}
                                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                                />
                                                <Tooltip
                                                    formatter={(value) => formatCurrency(Number(value), selectedCurrency)}
                                                    contentStyle={{
                                                        backgroundColor: 'hsl(var(--popover))',
                                                        border: '1px solid hsl(var(--border))',
                                                        borderRadius: '6px',
                                                        fontSize: '12px'
                                                    }}
                                                />
                                                <Bar dataKey="expenses" fill="hsl(var(--chart-1))" name="Expenses" radius={[2, 2, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )
                            ) : (
                                weeklyData.length === 0 ? (
                                    <div className="text-center py-6 text-muted-foreground">
                                        <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No weekly data</p>
                                    </div>
                                ) : (
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={weeklyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                                                <XAxis
                                                    dataKey="week"
                                                    fontSize={12}
                                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                                />
                                                <YAxis
                                                    fontSize={12}
                                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                                />
                                                <Tooltip
                                                    formatter={(value) => formatCurrency(Number(value), selectedCurrency)}
                                                    contentStyle={{
                                                        backgroundColor: 'hsl(var(--popover))',
                                                        border: '1px solid hsl(var(--border))',
                                                        borderRadius: '6px',
                                                        fontSize: '12px'
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="income"
                                                    stroke="#000000"
                                                    strokeWidth={2}
                                                    dot={{ fill: '#000000', strokeWidth: 2, r: 3 }}
                                                    name="Income"
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="expenses"
                                                    stroke="#ff0000"
                                                    strokeWidth={2}
                                                    dot={{ fill: '#ff0000', strokeWidth: 2, r: 3 }}
                                                    name="Expenses"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Category Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                Category Analysis
                            </CardTitle>
                            <CardDescription className="text-sm">Detailed breakdown by category</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {filteredCategoryData.length === 0 ? (
                                    <div className="text-center py-6 text-muted-foreground">
                                        <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No data available</p>
                                    </div>
                                ) : (
                                    filteredCategoryData.map((category) => (
                                        <div key={category.category} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">{category.category}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">
                                                        {category.count} txns
                                                    </span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {category.percentage.toFixed(1)}%
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-1.5">
                                                <div
                                                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                                                    style={{ width: `${category.percentage}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">
                                                    {formatCurrency(Math.abs(category.amount), selectedCurrency)}
                                                </span>
                                                <span className={category.amount >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                                    {category.amount >= 0 ? '+' : ''}{formatCurrency(category.amount, selectedCurrency)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Summary Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Summary Statistics</CardTitle>
                            <CardDescription>Key financial metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-600">
                                        {formatCurrency(
                                            categoryData.reduce((sum, cat) => sum + cat.amount, 0),
                                            selectedCurrency
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {formatCurrency(
                                            categoryData.length > 0 ? categoryData.reduce((sum, cat) => sum + cat.amount, 0) / categoryData.length : 0,
                                            selectedCurrency
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">Average Expense</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">
                                        {categoryData.length}
                                    </div>
                                    <p className="text-sm text-muted-foreground">Categories</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">
                                        {allTransactions.length}
                                    </div>
                                    <p className="text-sm text-muted-foreground">Total Transactions</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* CSV Manager Dialog */}
            <CSVManagerDialog
                isOpen={showCSVDialog}
                onClose={() => setShowCSVDialog(false)}
                transactions={allTransactions}
                selectedCurrency={selectedCurrency}
                onImportSuccess={handleCSVSuccess}
            />
        </div>
    );
}
