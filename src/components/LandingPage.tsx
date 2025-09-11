import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
// import { ContactForm } from "@/components/ContactForm"
import {
    ArrowRight,
    BarChart3,
    Zap,
    TrendingUp,
    DollarSign,
    PieChart,
    Settings,
    Brain,
    Bell,
    Sparkles,
    Plus
} from "lucide-react"

interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
}

export function LandingPage() {

    // State for demo transactions
    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        const saved = localStorage.getItem('finboard-demo-transactions');
        return saved ? JSON.parse(saved) : [
            { id: 1, title: 'Salary', amount: 25000, type: 'income', category: 'Income' },
            { id: 2, title: 'Freelance Work', amount: 8500, type: 'income', category: 'Income' },
            { id: 3, title: 'Groceries', amount: 3200, type: 'expense', category: 'Food' },
            { id: 4, title: 'Transport', amount: 1500, type: 'expense', category: 'Transportation' },
            { id: 5, title: 'Coffee', amount: 90, type: 'expense', category: 'Food' },
            { id: 6, title: 'Netflix', amount: 199, type: 'expense', category: 'Entertainment' },
            { id: 7, title: 'Rent', amount: 12000, type: 'expense', category: 'Housing' },
            { id: 8, title: 'Uber', amount: 350, type: 'expense', category: 'Transportation' },
            { id: 9, title: 'Restaurant', amount: 450, type: 'expense', category: 'Food' },
            { id: 10, title: 'Gym Membership', amount: 800, type: 'expense', category: 'Health' },
            { id: 11, title: 'Investment Return', amount: 1200, type: 'income', category: 'Investment' },
            { id: 12, title: 'Phone Bill', amount: 299, type: 'expense', category: 'Utilities' }
        ];
    });

    const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Food'
    });

    // Save to localStorage whenever transactions change
    useEffect(() => {
        localStorage.setItem('finboard-demo-transactions', JSON.stringify(transactions));
    }, [transactions]);

    // Calculate totals
    const totalIncome = transactions
        .filter((t: Transaction) => t.type === 'income')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter((t: Transaction) => t.type === 'expense')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

    const netWorth = totalIncome - totalExpenses;

    const handleAddTransaction = () => {
        if (newTransaction.title && newTransaction.amount) {
            const transaction: Transaction = {
                id: Date.now(),
                title: newTransaction.title,
                amount: parseFloat(newTransaction.amount),
                type: newTransaction.type as 'income' | 'expense',
                category: newTransaction.category
            };
            setTransactions([transaction, ...transactions]);
            setNewTransaction({ title: '', amount: '', type: 'expense', category: 'Food' });
            setIsTransactionDialogOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <Badge variant="secondary" className="mb-4">
                            <Zap className="h-3 w-3 mr-1" />
                            New: AI-Powered Analytics
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Take Control of Your
                            <span className="text-primary"> Financial Future</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            FinBoard is the all-in-one financial dashboard that helps you track expenses,
                            analyze spending patterns, and make smarter money decisions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="text-lg px-8"
                                asChild
                            >
                                <Link to="/signup">
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="text-lg px-8"
                                asChild
                            >
                                <Link to="/login">
                                    Sign In
                                </Link>
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            No credit card required • Freemium
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section - Bento Layout */}
            <section id="features" className="py-20 bg-muted/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to manage your finances</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Powerful features designed to give you complete control over your financial life
                        </p>
                    </div>

                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {/* Dashboard - Large Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-2 lg:row-span-2"
                        >
                            <Card className="h-full border border-dashed hover:shadow-lg transition-all duration-300">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                                                <BarChart3 className="h-4 w-4 text-primary-foreground" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">Smart Dashboard</CardTitle>
                                                <Badge variant="secondary" className="text-xs mt-0.5">
                                                    <Sparkles className="h-2 w-2 mr-1" />
                                                    AI-Powered
                                                </Badge>
                                            </div>
                                        </div>
                                        <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" className="">
                                                    Add
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Add Transaction</DialogTitle>
                                                    <DialogDescription>
                                                        Add a new transaction to see how FinBoard works
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="title">Title</Label>
                                                        <Input
                                                            id="title"
                                                            placeholder="e.g., Coffee, Salary, Rent"
                                                            value={newTransaction.title}
                                                            onChange={(e) => setNewTransaction({ ...newTransaction, title: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="amount">Amount (₹)</Label>
                                                        <Input
                                                            id="amount"
                                                            type="number"
                                                            placeholder="0"
                                                            value={newTransaction.amount}
                                                            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="type">Type</Label>
                                                            <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value })}>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="income">Income</SelectItem>
                                                                    <SelectItem value="expense">Expense</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="category">Category</Label>
                                                            <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Income">Income</SelectItem>
                                                                    <SelectItem value="Food">Food</SelectItem>
                                                                    <SelectItem value="Transportation">Transportation</SelectItem>
                                                                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                                                                    <SelectItem value="Housing">Housing</SelectItem>
                                                                    <SelectItem value="Health">Health</SelectItem>
                                                                    <SelectItem value="Utilities">Utilities</SelectItem>
                                                                    <SelectItem value="Investment">Investment</SelectItem>
                                                                    <SelectItem value="Others">Others</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <Button onClick={handleAddTransaction} className="w-full">
                                                        Add Transaction
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                </div>
                                    <CardDescription className="text-base">
                                        Your central command center for all financial insights
                                </CardDescription>
                            </CardHeader>
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        {/* Main Financial Metrics */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-background/50 rounded-lg p-2 hover:bg-background/70 transition-colors">
                                                <div className="text-xl font-bold text-green-600">
                                                    ₹{totalIncome.toLocaleString()}
                                                </div>
                                                <div className="text-xs text-muted-foreground">Total Income</div>
                                                <div className="text-xs text-green-600">{transactions.filter(t => t.type === 'income').length} transactions</div>
                                            </div>
                                            <div className="bg-background/50 rounded-lg p-2 hover:bg-background/70 transition-colors">
                                                <div className="text-xl font-bold text-red-600">
                                                    ₹{totalExpenses.toLocaleString()}
                                                </div>
                                                <div className="text-xs text-muted-foreground">Total Expenses</div>
                                                <div className="text-xs text-red-600">{transactions.filter(t => t.type === 'expense').length} transactions</div>
                                            </div>
                                        </div>

                                        {/* Net Worth */}
                                        <div className="bg-background/50 rounded-lg p-2 hover:bg-background/70 transition-colors">
                                            <div className={`text-xl font-bold ${netWorth >= 0 ? 'text-primary' : 'text-red-600'}`}>
                                                ₹{netWorth.toLocaleString()}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Net Worth</div>
                                            <div className="text-xs text-muted-foreground">
                                                {netWorth >= 0 ? 'Positive balance' : 'Negative balance'}
                                            </div>
                                        </div>

                                        {/* Quick Stats */}
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="text-center p-1.5 bg-muted/30 rounded">
                                                <div className="text-sm font-semibold text-primary">{transactions.length}</div>
                                                <div className="text-xs text-muted-foreground">Total</div>
                                            </div>
                                            <div className="text-center p-1.5 bg-muted/30 rounded">
                                                <div className="text-sm font-semibold text-green-600">
                                                    {transactions.filter(t => t.type === 'income').length}
                                                </div>
                                                <div className="text-xs text-muted-foreground">Income</div>
                                            </div>
                                            <div className="text-center p-1.5 bg-muted/30 rounded">
                                                <div className="text-sm font-semibold text-red-600">
                                                    {transactions.filter(t => t.type === 'expense').length}
                                                </div>
                                                <div className="text-xs text-muted-foreground">Expenses</div>
                                            </div>
                                        </div>

                                        {/* Interactive Demo Message */}
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 rounded p-2">
                                            <TrendingUp className="h-3 w-3 text-primary" />
                                            <span>Interactive Demo - Try adding transactions!</span>
                                        </div>

                                        {/* Quick Insights Card */}
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 mt-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                                <span className="text-xs font-medium text-blue-800">Quick Insights</span>
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-blue-700">Avg. Daily Spend</span>
                                                    <span className="font-medium text-blue-800">₹{Math.round(totalExpenses / 30).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-blue-700">Savings Rate</span>
                                                    <span className="font-medium text-blue-800">{Math.round((netWorth / totalIncome) * 100)}%</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-blue-700">Top Category</span>
                                                    <span className="font-medium text-blue-800">Food</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                        </Card>
                        </motion.div>

                        {/* Transactions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="h-full hover:shadow-md transition-all duration-300">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <DollarSign className="h-4 w-4 text-green-600" />
                                        <CardTitle className="text-base">Transactions</CardTitle>
                                </div>
                                    <CardDescription className="text-xs">
                                        Track every expense and income
                                </CardDescription>
                            </CardHeader>
                                <CardContent className="">
                                    <div className="h-full overflow-y-auto space-y-1.5 pr-1">
                                        {transactions.slice(0, 6).map((transaction: Transaction) => (
                                            <div key={transaction.id} className="flex items-center justify-between hover:bg-muted/50 rounded p-1.5 transition-colors">
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                    <div className="min-w-0 flex-1">
                                                        <span className="text-xs font-medium truncate block">{transaction.title}</span>
                                                        <span className="text-xs text-muted-foreground">{transaction.category}</span>
                                                    </div>
                                                </div>
                                                <span className={`text-xs font-medium flex-shrink-0 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                        {transactions.length > 6 && (
                                            <div className="text-xs text-muted-foreground text-center pt-1 bg-muted/30 rounded p-1.5">
                                                +{transactions.length - 6} more transactions
                                            </div>
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
                            <Card className="h-full bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Brain className="h-4 w-4 text-purple-600" />
                                        <CardTitle className="text-base">AI Insights</CardTitle>
                                </div>
                                    <CardDescription className="text-xs">
                                        Smart analysis of your spending
                                </CardDescription>
                            </CardHeader>
                                <CardContent className="p-4">
                                    <div className="space-y-2">
                                        <div className="bg-white/70 rounded p-2 hover:bg-white/90 transition-colors">
                                            <div className="text-xs font-medium text-purple-800">Food & Dining</div>
                                            <div className="text-xs text-purple-600">85% confidence</div>
                                            <div className="text-xs text-muted-foreground">Consider meal planning</div>
                                        </div>
                                        <div className="bg-white/70 rounded p-2 hover:bg-white/90 transition-colors">
                                            <div className="text-xs font-medium text-purple-800">Transportation</div>
                                            <div className="text-xs text-purple-600">92% confidence</div>
                                            <div className="text-xs text-muted-foreground">15% higher than last month</div>
                                        </div>
                                    </div>

                                    {/* AI Feature Highlight */}
                                    <div className="mt-3 bg-purple-50 border border-purple-200 rounded-lg p-2">
                                        <div className="flex items-center gap-2 text-xs">
                                            <Brain className="h-3 w-3 text-purple-600" />
                                            <span className="text-purple-800 font-medium">AI Learning</span>
                                        </div>
                                        <div className="text-xs text-purple-700 mt-1">
                                            Gets smarter with more data
                                        </div>
                                </div>
                                </CardContent>
                        </Card>
                        </motion.div>

                        {/* Reports */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="h-full hover:shadow-md hover:scale-105 transition-all duration-300">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <PieChart className="h-4 w-4 text-blue-600" />
                                        <CardTitle className="text-base">Reports</CardTitle>
                                </div>
                                    <CardDescription className="text-xs">
                                        Visual financial analytics
                                </CardDescription>
                            </CardHeader>
                                <CardContent className="">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between hover:bg-muted/50 rounded p-1.5 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span className="text-xs">Food</span>
                                            </div>
                                            <span className="text-xs font-medium">35%</span>
                                        </div>
                                        <div className="flex items-center justify-between hover:bg-muted/50 rounded p-1.5 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-xs">Transport</span>
                                            </div>
                                            <span className="text-xs font-medium">25%</span>
                                        </div>
                                        <div className="flex items-center justify-between hover:bg-muted/50 rounded p-1.5 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                <span className="text-xs">Entertainment</span>
                                            </div>
                                            <span className="text-xs font-medium">20%</span>
                                        </div>
                                        <div className="flex items-center justify-between hover:bg-muted/50 rounded p-1.5 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                                <span className="text-xs">Others</span>
                                            </div>
                                            <span className="text-xs font-medium">20%</span>
                                        </div>
                                    </div>

                                </CardContent>
                        </Card>
                        </motion.div>

                        {/* Settings */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Card className="h-full hover:shadow-md hover:scale-105 transition-all duration-300">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Settings className="h-4 w-4 text-gray-600" />
                                        <CardTitle className="text-base">Settings</CardTitle>
                                </div>
                                    <CardDescription className="text-xs">
                                        Customize your experience
                                </CardDescription>
                            </CardHeader>
                                <CardContent className="">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between hover:bg-muted/50 rounded p-1.5 transition-colors">
                                            <span className="text-xs">Currency</span>
                                            <Badge variant="outline" className="text-xs px-2 py-0.5">INR</Badge>
                                        </div>
                                        <div className="flex items-center justify-between hover:bg-muted/50 rounded p-1.5 transition-colors">
                                            <span className="text-xs">Theme</span>
                                            <Badge variant="outline" className="text-xs px-2 py-0.5">Light</Badge>
                                        </div>
                                        <div className="flex items-center justify-between hover:bg-muted/50 rounded p-1.5 transition-colors">
                                            <span className="text-xs">Notifications</span>
                                            <Bell className="h-3 w-3 text-green-600" />
                                        </div>
                                    </div>
                                </CardContent>
                        </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="max-w-4xl mx-auto">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl mb-4">Ready to transform your financial life?</CardTitle>
                            <CardDescription className="text-lg">
                                Join thousands of users who are already taking control of their finances with FinBoard.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                                <Button
                                    size="lg"
                                    className="text-lg px-8"
                                    asChild
                                >
                                    <Link to="/signup">
                                        Get Started Free
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="text-lg px-8"
                                    asChild
                                >
                                    <Link to="/login">
                                        Sign In
                                    </Link>
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                By signing up, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Contact Form Section */}
            {/* <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Have questions about FinBoard? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>
                    <ContactForm />
                </div>
            </section> */}

            <Footer />
        </div>
    )
}
