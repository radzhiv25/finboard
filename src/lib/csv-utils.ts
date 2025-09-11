// Transaction interface - matches the one used in Reports component
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

export interface CSVTransaction {
    title: string;
    description?: string;
    amount: number;
    currency: 'USD' | 'INR';
    date: string; // YYYY-MM-DD format
    category: string;
    type: 'income' | 'expense';
}

export interface CSVImportResult {
    success: boolean;
    data: CSVTransaction[];
    errors: string[];
    warnings: string[];
}

// CSV Template structure
export const CSV_TEMPLATE_HEADERS = [
    'title',
    'description',
    'amount',
    'currency',
    'date',
    'type'
] as const;

export const CSV_TEMPLATE_SAMPLE = [
    {
        title: 'Coffee Shop',
        description: 'Morning coffee',
        amount: 5.50,
        currency: 'USD',
        date: '2024-01-15',
        type: 'expense'
    },
    {
        title: 'Grocery Shopping',
        description: 'Weekly groceries',
        amount: 85.00,
        currency: 'USD',
        date: '2024-01-14',
        type: 'expense'
    },
    {
        title: 'Salary',
        description: 'Monthly salary',
        amount: 5000.00,
        currency: 'USD',
        date: '2024-01-01',
        type: 'income'
    },
    {
        title: 'Uber Ride',
        description: 'Airport pickup',
        amount: 25.00,
        currency: 'USD',
        date: '2024-01-13',
        type: 'expense'
    }
];

// Generate CSV content from transactions
export function generateCSV(transactions: Transaction[]): string {
    const headers = CSV_TEMPLATE_HEADERS.join(',');
    const rows = transactions.map(transaction => {
        const row = [
            `"${transaction.title.replace(/"/g, '""')}"`,
            `"${(transaction.description || '').replace(/"/g, '""')}"`,
            transaction.amount,
            transaction.currency,
            transaction.date,
            transaction.type
        ];
        return row.join(',');
    });

    return [headers, ...rows].join('\n');
}

// Parse CSV content to transactions
export function parseCSV(csvContent: string): CSVImportResult {
    const result: CSVImportResult = {
        success: true,
        data: [],
        errors: [],
        warnings: []
    };

    try {
        const lines = csvContent.split('\n').filter(line => line.trim());

        if (lines.length === 0) {
            result.errors.push('CSV file is empty');
            result.success = false;
            return result;
        }

        // Parse header
        const headerLine = lines[0];
        const headers = parseCSVLine(headerLine);

        // Validate headers
        const requiredHeaders = ['title', 'amount', 'currency', 'date', 'type'];
        const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));

        if (missingHeaders.length > 0) {
            result.errors.push(`Missing required headers: ${missingHeaders.join(', ')}`);
            result.success = false;
            return result;
        }

        // Parse data rows
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            try {
                const values = parseCSVLine(line);
                const transaction = parseTransactionRow(headers, values, i + 1);

                if (transaction) {
                    result.data.push(transaction);
                }
            } catch (error) {
                result.errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Invalid data'}`);
            }
        }

        // Validate data
        if (result.data.length === 0) {
            result.errors.push('No valid transaction data found');
            result.success = false;
        }

        // Check for duplicates
        const duplicates = findDuplicates(result.data);
        if (duplicates.length > 0) {
            result.warnings.push(`Found ${duplicates.length} potential duplicate transactions`);
        }

    } catch (error) {
        result.errors.push(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
        result.success = false;
    }

    return result;
}

// Parse a single CSV line handling quoted values
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                // Escaped quote
                current += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
}

// Parse a single transaction row
function parseTransactionRow(headers: string[], values: string[], _rowNumber: number): CSVTransaction | null {
    const getValue = (header: string): string => {
        const index = headers.indexOf(header);
        return index >= 0 ? values[index] : '';
    };

    const title = getValue('title').trim();
    const description = getValue('description').trim();
    const amountStr = getValue('amount').trim();
    const currency = getValue('currency').trim().toUpperCase() as 'USD' | 'INR';
    const date = getValue('date').trim();
    const category = getValue('category').trim();
    const type = getValue('type').trim().toLowerCase() as 'income' | 'expense';

    // Validate required fields
    if (!title) {
        throw new Error('Title is required');
    }

    if (!amountStr) {
        throw new Error('Amount is required');
    }

    if (!currency || !['USD', 'INR'].includes(currency)) {
        throw new Error('Currency must be USD or INR');
    }

    if (!date) {
        throw new Error('Date is required');
    }

    if (!type || !['income', 'expense'].includes(type)) {
        throw new Error('Type must be "income" or "expense"');
    }

    // Provide default category based on type if not provided
    const defaultCategory = type === 'income' ? 'Other Income' : 'Other Expense';
    const finalCategory = category || defaultCategory;

    // Parse amount
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
        throw new Error('Amount must be a positive number');
    }

    // Validate date format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        throw new Error('Date must be in YYYY-MM-DD format');
    }

    return {
        title,
        description: description || undefined,
        amount,
        currency,
        date,
        category: finalCategory,
        type
    };
}

// Find potential duplicate transactions
function findDuplicates(transactions: CSVTransaction[]): number[] {
    const seen = new Set<string>();
    const duplicates: number[] = [];

    transactions.forEach((transaction, index) => {
        const key = `${transaction.title}-${transaction.amount}-${transaction.date}`;
        if (seen.has(key)) {
            duplicates.push(index + 1);
        } else {
            seen.add(key);
        }
    });

    return duplicates;
}

// Generate CSV template content
export function generateCSVTemplate(): string {
    const headers = CSV_TEMPLATE_HEADERS.join(',');
    const sampleRows = CSV_TEMPLATE_SAMPLE.map(sample => {
        const row = [
            `"${sample.title}"`,
            `"${sample.description}"`,
            sample.amount,
            sample.currency,
            sample.date,
            sample.type
        ];
        return row.join(',');
    });

    return [headers, ...sampleRows].join('\n');
}

// Download CSV file
export function downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

// Convert CSV transactions to Appwrite transactions
export function convertToAppwriteTransactions(csvTransactions: CSVTransaction[]): Omit<Transaction, '$id' | '$createdAt' | '$updatedAt' | 'userId'>[] {
    return csvTransactions.map(transaction => ({
        title: transaction.title,
        description: transaction.description || '',
        amount: transaction.type === 'income' ? Math.abs(transaction.amount) : -Math.abs(transaction.amount),
        currency: transaction.currency,
        date: transaction.date,
        category: transaction.category,
        type: transaction.type
    }));
}
