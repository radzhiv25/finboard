import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Using simple HTML date input instead of complex calendar
import { transactions } from '@/lib/appwrite';
import { useAuth } from '@/contexts/AuthContext';
import { aiService } from '@/lib/openai';
import { Brain, Loader2, DollarSign, Calendar, FileText } from 'lucide-react';

const transactionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    amount: z.number().min(0.01, 'Amount must be greater than 0'),
    category: z.string().min(1, 'Category is required'),
    date: z.date(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    showCard?: boolean;
}

const CATEGORIES = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Groceries',
    'Income',
    'Investment',
    'Other'
];

export function TransactionForm({ onSuccess, onCancel, showCard = true }: TransactionFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [aiCategory, setAiCategory] = useState<string | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const { userProfile } = useAuth();

    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            title: '',
            description: '',
            amount: 0,
            category: '',
            date: selectedDate,
        },
    });

    // Sync selectedDate with form
    React.useEffect(() => {
        form.setValue('date', selectedDate);
    }, [selectedDate, form]);

    const predictCategory = async (title: string) => {
        if (!title || title.trim().length < 3) return;

        setAiLoading(true);
        try {
            // Check if OpenAI API key is available
            const hasOpenAIKey = import.meta.env.VITE_OPENAI_API_KEY;

            if (hasOpenAIKey) {
                const prediction = await aiService.predictCategory(title, '');
                setAiCategory(prediction.category);
                setSelectedCategory(prediction.category);
                form.setValue('category', prediction.category);
            } else {
                // Fallback to simple keyword-based prediction
                const text = title.toLowerCase();
                let predictedCategory = 'Other';

                if (text.includes('food') || text.includes('restaurant') || text.includes('dining') || text.includes('coffee') || text.includes('lunch') || text.includes('dinner')) {
                    predictedCategory = 'Food & Dining';
                } else if (text.includes('uber') || text.includes('taxi') || text.includes('gas') || text.includes('fuel') || text.includes('transport') || text.includes('bus') || text.includes('metro')) {
                    predictedCategory = 'Transportation';
                } else if (text.includes('shopping') || text.includes('store') || text.includes('amazon') || text.includes('purchase') || text.includes('buy')) {
                    predictedCategory = 'Shopping';
                } else if (text.includes('movie') || text.includes('entertainment') || text.includes('game') || text.includes('netflix') || text.includes('spotify')) {
                    predictedCategory = 'Entertainment';
                } else if (text.includes('bill') || text.includes('utility') || text.includes('electric') || text.includes('water') || text.includes('internet') || text.includes('phone')) {
                    predictedCategory = 'Bills & Utilities';
                } else if (text.includes('doctor') || text.includes('medical') || text.includes('pharmacy') || text.includes('health') || text.includes('hospital')) {
                    predictedCategory = 'Healthcare';
                } else if (text.includes('school') || text.includes('education') || text.includes('course') || text.includes('book') || text.includes('tuition')) {
                    predictedCategory = 'Education';
                } else if (text.includes('travel') || text.includes('hotel') || text.includes('flight') || text.includes('vacation') || text.includes('trip')) {
                    predictedCategory = 'Travel';
                } else if (text.includes('grocery') || text.includes('supermarket') || text.includes('market') || text.includes('grocery') || text.includes('food')) {
                    predictedCategory = 'Groceries';
                } else if (text.includes('salary') || text.includes('income') || text.includes('pay') || text.includes('wage') || text.includes('bonus')) {
                    predictedCategory = 'Income';
                } else if (text.includes('investment') || text.includes('stock') || text.includes('crypto') || text.includes('dividend') || text.includes('return')) {
                    predictedCategory = 'Investment';
                }

                setAiCategory(predictedCategory);
                setSelectedCategory(predictedCategory);
                form.setValue('category', predictedCategory);
            }
        } catch (error) {
            console.error('AI prediction failed:', error);
        } finally {
            setAiLoading(false);
        }
    };

    const onSubmit = async (data: TransactionFormValues) => {
        try {
            setIsLoading(true);

            // Get user's preferred currency from profile
            let userCurrency = 'USD';
            if (userProfile && 'preferences' in userProfile) {
                try {
                    const prefs = JSON.parse((userProfile as { preferences: string }).preferences);
                    userCurrency = prefs.currency || 'USD';
                } catch (error) {
                    console.warn('Failed to parse user preferences:', error);
                }
            }

            const transactionData = {
                title: data.title,
                description: data.description,
                amount: data.amount,
                currency: userCurrency as 'USD' | 'INR',
                date: data.date.toISOString().split('T')[0],
                category: data.category,
            };

            await transactions.create(transactionData);

            form.reset();
            setAiCategory(null);
            setSelectedCategory('');
            setSelectedDate(new Date());
            onSuccess?.();
        } catch (error: unknown) {
            console.error('Transaction creation failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create transaction';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };


    const formContent = (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Title
                </Label>
                <Input
                    id="title"
                    placeholder="e.g., Coffee at Starbucks"
                    {...form.register('title')}
                    onBlur={(e) => {
                        const title = e.target.value.trim();
                        if (title.length >= 3) {
                            predictCategory(title);
                        }
                    }}
                />
                {form.formState.errors.title && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.title.message}
                    </p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Additional details about this transaction..."
                    className="min-h-[80px]"
                    {...form.register('description')}
                />
                {form.formState.errors.description && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.description.message}
                    </p>
                )}
            </div>

            {/* Amount and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...form.register('amount', { valueAsNumber: true })}
                    />
                    {form.formState.errors.amount && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.amount.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                        value={selectedCategory}
                        onValueChange={(value) => {
                            setSelectedCategory(value);
                            form.setValue('category', value);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {form.formState.errors.category && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.category.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date
                </Label>
                <Input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => {
                        const date = new Date(e.target.value);
                        setSelectedDate(date);
                        form.setValue('date', date);
                    }}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full"
                />
                {form.formState.errors.date && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.date.message}
                    </p>
                )}
            </div>

            {/* AI Category Prediction */}
            {(aiLoading || aiCategory) && (
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        AI Suggested Category
                    </Label>
                    <div className="p-3 bg-muted/50 rounded-lg">
                        {aiLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Analyzing transaction...</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{aiCategory}</span>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedCategory(aiCategory!);
                                            form.setValue('category', aiCategory!);
                                        }}
                                    >
                                        Use This
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setAiCategory(null)}
                                    >
                                        Dismiss
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding Transaction...
                        </>
                    ) : (
                        'Add Transaction'
                    )}
                </Button>

                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );

    if (showCard) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Add Transaction
                        </CardTitle>
                        <CardDescription>
                            Record a new financial transaction with AI-powered category prediction
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {formContent}
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {formContent}
        </motion.div>
    );
}
