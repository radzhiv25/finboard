import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
    FileText,
    FileDown,
    Upload,
    X,
    CheckCircle,
    AlertCircle,
    AlertTriangle,
    FileSpreadsheet,
    RefreshCw
} from 'lucide-react';
import {
    generateCSV,
    parseCSV,
    generateCSVTemplate,
    downloadCSV,
    convertToAppwriteTransactions,
    type CSVImportResult
} from '@/lib/csv-utils';
import { transactions as transactionService } from '@/lib/appwrite';

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

// Category definitions
const INCOME_CATEGORIES = [
    'Salary',
    'Freelance',
    'Investment Returns',
    'Business Income',
    'Rental Income',
    'Bonus',
    'Gift',
    'Refund',
    'Other Income'
];

const EXPENSE_CATEGORIES = [
    'Food & Dining',
    'Groceries',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Subscriptions',
    'Insurance',
    'Rent/Mortgage',
    'Other Expense'
];

interface CSVManagerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    transactions: Transaction[];
    selectedCurrency: 'USD' | 'INR';
    onImportSuccess: () => void;
}

export function CSVManagerDialog({
    isOpen,
    onClose,
    transactions,
    selectedCurrency,
    onImportSuccess
}: CSVManagerDialogProps) {
    const [dragActive, setDragActive] = useState(false);
    const [importResult, setImportResult] = useState<CSVImportResult | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [selectedType, setSelectedType] = useState<'income' | 'expense'>('expense');
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    // Handle drag events
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileUpload = async (file: File) => {
        if (!file.name.toLowerCase().endsWith('.csv')) {
            setImportResult({
                success: false,
                data: [],
                errors: ['Please select a CSV file'],
                warnings: []
            });
            return;
        }

        try {
            setIsImporting(true);
            const content = await file.text();
            const result = parseCSV(content);
            setImportResult(result);
        } catch (error) {
            console.error('Failed to parse CSV:', error);
            setImportResult({
                success: false,
                data: [],
                errors: ['Failed to read file'],
                warnings: []
            });
        } finally {
            setIsImporting(false);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleImportConfirm = async () => {
        if (!importResult?.success || !importResult.data.length) return;

        try {
            setIsImporting(true);
            const appwriteTransactions = convertToAppwriteTransactions(importResult.data);

            // Import transactions one by one
            for (const transaction of appwriteTransactions) {
                await transactionService.create({
                    ...transaction,
                    tags: transaction.tags ? [transaction.tags] : undefined
                });
            }

            // Refresh data
            onImportSuccess();

            onClose();
            setImportResult(null);
        } catch (error) {
            console.error('Failed to import transactions:', error);
        } finally {
            setIsImporting(false);
        }
    };

    const handleExportCSV = async () => {
        try {
            setIsExporting(true);
            const csvContent = generateCSV(transactions);
            const filename = `expenses-${selectedCurrency}-${new Date().toISOString().split('T')[0]}.csv`;
            downloadCSV(csvContent, filename);
        } catch (error) {
            console.error('Failed to export CSV:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleDownloadTemplate = () => {
        try {
            const templateContent = generateCSVTemplate();
            downloadCSV(templateContent, 'expense-template.csv');
        } catch (error) {
            console.error('Failed to download template:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-background border rounded-lg w-full max-w-md overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">CSV Manager</h2>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                        {/* Template */}
                        <Button
                            onClick={handleDownloadTemplate}
                            variant="outline"
                            className="w-full justify-start h-12"
                        >
                            <FileText className="h-4 w-4 mr-3" />
                            <div className="text-left">
                                <div className="font-medium">Download Template</div>
                                <div className="text-xs text-muted-foreground">Get sample CSV format</div>
                            </div>
                        </Button>

                        {/* Category Selection */}
                        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                            <div className="text-sm font-medium">Quick Add Transaction</div>

                            {/* Transaction Type Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="transaction-type">Transaction Type</Label>
                                <Select value={selectedType} onValueChange={(value: 'income' | 'expense') => {
                                    setSelectedType(value);
                                    setSelectedCategory(''); // Reset category when type changes
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="income">Income</SelectItem>
                                        <SelectItem value="expense">Expense</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Category Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(selectedType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Quick Add Button */}
                            <Button
                                onClick={() => {
                                    if (selectedCategory) {
                                        // Create a quick transaction with the selected category
                                        const quickTransaction = {
                                            title: `Quick ${selectedType}`,
                                            description: '',
                                            amount: selectedType === 'income' ? 100 : -100,
                                            currency: selectedCurrency,
                                            category: selectedCategory,
                                            type: selectedType,
                                            date: new Date().toISOString().split('T')[0]
                                        };

                                        // This would need to be implemented to add the transaction
                                    }
                                }}
                                disabled={!selectedCategory}
                                className="w-full"
                                size="sm"
                            >
                                Add {selectedType === 'income' ? 'Income' : 'Expense'} Transaction
                            </Button>
                        </div>

                        {/* Upload - Drag and Drop Area */}
                        <div
                            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${dragActive
                                ? 'border-primary bg-primary/5'
                                : 'border-muted-foreground/25 hover:border-primary/50'
                                } ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => !isImporting && document.getElementById('csv-upload')?.click()}
                        >
                            <input
                                id="csv-upload"
                                type="file"
                                accept=".csv"
                                onChange={handleFileInputChange}
                                className="hidden"
                                disabled={isImporting}
                            />

                            <div className="space-y-3">
                                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                    <Upload className={`h-6 w-6 text-muted-foreground ${isImporting ? 'animate-spin' : ''}`} />
                                </div>

                                <div>
                                    <div className="font-medium text-sm">
                                        {isImporting ? 'Processing CSV...' : 'Upload CSV File'}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {isImporting ? 'Please wait...' : 'Drag & drop or click to browse'}
                                    </div>
                                </div>

                                <div className="text-xs text-muted-foreground">
                                    Supports .csv files only
                                </div>
                            </div>
                        </div>

                        {/* Export */}
                        <Button
                            onClick={handleExportCSV}
                            disabled={isExporting || transactions.length === 0}
                            variant="outline"
                            className="w-full justify-start h-12"
                        >
                            <FileDown className={`h-4 w-4 mr-3 ${isExporting ? 'animate-spin' : ''}`} />
                            <div className="text-left">
                                <div className="font-medium">
                                    {isExporting ? 'Exporting...' : 'Export CSV'}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {isExporting ? 'Please wait...' : `${transactions.length} transactions`}
                                </div>
                            </div>
                        </Button>

                        {/* Import Results */}
                        {importResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 space-y-3"
                            >
                                {importResult.success ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-green-600 text-sm">
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="font-medium">Ready to import {importResult.data.length} transactions</span>
                                        </div>

                                        {importResult.warnings.length > 0 && (
                                            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 text-yellow-800 text-sm font-medium mb-2">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    {importResult.warnings.length} warnings
                                                </div>
                                                <ul className="text-xs text-yellow-700 space-y-1">
                                                    {importResult.warnings.map((warning, index) => (
                                                        <li key={index}>• {warning}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setImportResult(null)}
                                                className="flex-1"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleImportConfirm}
                                                disabled={isImporting}
                                                size="sm"
                                                className="flex-1"
                                            >
                                                {isImporting ? (
                                                    <>
                                                        <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                                                        Importing...
                                                    </>
                                                ) : (
                                                    `Import ${importResult.data.length}`
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-red-600 text-sm">
                                            <AlertCircle className="h-4 w-4" />
                                            <span className="font-medium">Import failed</span>
                                        </div>

                                        <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                                            <div className="text-red-800 text-sm font-medium mb-2">Errors:</div>
                                            <ul className="text-xs text-red-700 space-y-1">
                                                {importResult.errors.map((error, index) => (
                                                    <li key={index}>• {error}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleDownloadTemplate}
                                                className="flex-1"
                                            >
                                                <FileText className="h-3 w-3 mr-2" />
                                                Template
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setImportResult(null)}
                                                className="flex-1"
                                            >
                                                Try Again
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
