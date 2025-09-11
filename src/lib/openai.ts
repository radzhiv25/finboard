import OpenAI from 'openai';
import { openaiConfig } from './env';

// Initialize OpenAI client only if API key is available
let openai: OpenAI | null = null;

const getOpenAIClient = () => {
    if (!openai && openaiConfig.apiKey) {
        openai = new OpenAI({
            apiKey: openaiConfig.apiKey,
            dangerouslyAllowBrowser: true // Only for client-side usage
        });
    }
    return openai;
};

export interface CategoryPrediction {
    category: string;
    confidence: number;
    reasoning: string;
}

export interface CategoryAndTypePrediction {
    category: string;
    type: 'income' | 'expense';
    confidence: number;
    reasoning: string;
}

export interface SpendingInsight {
    category: string;
    confidence: number;
    suggestion: string;
    spendingPattern?: string;
    trend?: 'increasing' | 'decreasing' | 'stable';
}

export const aiService = {
    /**
     * Predict both category and type for a transaction based on title and description
     */
    async predictCategoryAndType(title: string, description: string): Promise<CategoryAndTypePrediction> {
        try {
            const client = getOpenAIClient();
            if (!client) {
                console.warn('OpenAI API key not available, using fallback category prediction');
                return {
                    category: 'Other Expense',
                    type: 'expense',
                    confidence: 0.5,
                    reasoning: 'AI prediction unavailable - no API key provided'
                };
            }

            const prompt = `
        Analyze this financial transaction and predict both the transaction type (income or expense) and the most appropriate category.
        
        Transaction Title: "${title}"
        Description: "${description}"
        
        Please respond with a JSON object containing:
        - type: Either "income" or "expense"
        - category: The most appropriate category from the relevant list below:
        
        For INCOME transactions, choose from: Salary, Freelance, Investment Returns, Business Income, Rental Income, Bonus, Gift, Refund, Other Income
        
        For EXPENSE transactions, choose from: Food & Dining, Groceries, Transportation, Entertainment, Shopping, Bills & Utilities, Healthcare, Education, Travel, Subscriptions, Insurance, Rent/Mortgage, Other Expense
        
        - confidence: A number between 0 and 1 representing your confidence in this prediction
        - reasoning: A brief explanation of why you chose this type and category
        
        Example response:
        {
          "type": "expense",
          "category": "Food & Dining",
          "confidence": 0.95,
          "reasoning": "The title mentions 'Coffee at Starbucks' which clearly indicates a food and beverage purchase, making it an expense"
        }
      `;

            const completion = await client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are a financial AI assistant that categorizes transactions and determines if they are income or expenses. Always respond with valid JSON only."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 200
            });

            const response = completion.choices[0]?.message?.content;
            if (!response) {
                throw new Error('No response from OpenAI');
            }

            const parsed = JSON.parse(response);
            return {
                category: parsed.category || 'Other Expense',
                type: parsed.type || 'expense',
                confidence: Math.min(Math.max(parsed.confidence || 0.5, 0), 1),
                reasoning: parsed.reasoning || 'No reasoning provided'
            };
        } catch (error) {
            console.error('OpenAI category and type prediction failed:', error);
            // Fallback to simple keyword matching
            return fallbackCategoryAndTypePrediction(title, description);
        }
    },

    /**
     * Predict category for a transaction based on title and description
     */
    async predictCategory(title: string, description: string): Promise<CategoryPrediction> {
        try {
            const client = getOpenAIClient();
            if (!client) {
                console.warn('OpenAI API key not available, using fallback category prediction');
                return {
                    category: 'Other',
                    confidence: 0.5,
                    reasoning: 'AI prediction unavailable - no API key provided'
                };
            }

            const prompt = `
        Analyze this financial transaction and predict the most appropriate category.
        
        Transaction Title: "${title}"
        Description: "${description}"
        
        Please respond with a JSON object containing:
        - category: The most appropriate category from this list: Food & Dining, Transportation, Shopping, Entertainment, Bills & Utilities, Healthcare, Education, Travel, Groceries, Income, Investment, Other
        - confidence: A number between 0 and 1 representing your confidence in this prediction
        - reasoning: A brief explanation of why you chose this category
        
        Example response:
        {
          "category": "Food & Dining",
          "confidence": 0.95,
          "reasoning": "The title mentions 'Coffee at Starbucks' which clearly indicates a food and beverage purchase"
        }
      `;

            const completion = await client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are a financial AI assistant that categorizes transactions. Always respond with valid JSON only."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 200
            });

            const response = completion.choices[0]?.message?.content;
            if (!response) {
                throw new Error('No response from OpenAI');
            }

            const parsed = JSON.parse(response);
            return {
                category: parsed.category || 'Other',
                confidence: Math.min(Math.max(parsed.confidence || 0.5, 0), 1),
                reasoning: parsed.reasoning || 'No reasoning provided'
            };
        } catch (error) {
            console.error('OpenAI category prediction failed:', error);
            // Fallback to simple keyword matching
            return fallbackCategoryPrediction(title, description);
        }
    },

    /**
     * Generate spending insights based on transaction history
     */
    async generateInsights(transactions: Array<{
        title: string;
        description: string;
        amount: number;
        category: string;
        date: string;
        currency?: string;
        type?: string;
    }>): Promise<SpendingInsight[]> {
        try {
            const client = getOpenAIClient();
            if (!client) {
                console.warn('OpenAI API key not available, using fallback insights');
                return [
                    {
                        category: 'General',
                        confidence: 0.5,
                        suggestion: 'AI insights unavailable - no API key provided. Consider adding your OpenAI API key for personalized insights.',
                        spendingPattern: 'Unable to analyze',
                        trend: 'stable'
                    }
                ];
            }

            if (transactions.length === 0) {
                return [];
            }

            const prompt = `
        Analyze these financial transactions and provide insights about spending patterns and suggestions for improvement.
        
        Transactions:
        ${transactions.map(t =>
                `- ${t.title}: ${t.description} (${t.amount} ${t.currency}, ${t.category}, ${t.type})`
            ).join('\n')}
        
        Please respond with a JSON array of insights, each containing:
        - category: The spending category this insight relates to
        - confidence: A number between 0 and 1 representing your confidence
        - suggestion: A helpful suggestion for this category
        - spendingPattern: Optional description of the spending pattern observed
        - trend: Optional trend indicator (increasing, decreasing, stable)
        
        Example response:
        [
          {
            "category": "Food & Dining",
            "confidence": 0.85,
            "suggestion": "Consider meal planning to reduce dining out expenses",
            "spendingPattern": "High spending on weekends",
            "trend": "increasing"
          }
        ]
      `;

            const completion = await client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are a financial AI advisor that analyzes spending patterns and provides actionable insights. Always respond with valid JSON only."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.4,
                max_tokens: 500
            });

            const response = completion.choices[0]?.message?.content;
            if (!response) {
                throw new Error('No response from OpenAI');
            }

            // Extract JSON from markdown code blocks if present
            let jsonString = response.trim();
            if (jsonString.startsWith('```json')) {
                jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            } else if (jsonString.startsWith('```')) {
                jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
            }

            const parsed = JSON.parse(jsonString);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error('OpenAI insights generation failed:', error);
            return [];
        }
    }
};

/**
 * Fallback category and type prediction using simple keyword matching
 */
function fallbackCategoryAndTypePrediction(title: string, description: string): CategoryAndTypePrediction {
    const text = `${title} ${description}`.toLowerCase();

    // Income keywords
    const incomeKeywords = {
        'Salary': ['salary', 'pay', 'wage', 'paycheck', 'monthly pay'],
        'Freelance': ['freelance', 'contract', 'consulting', 'gig'],
        'Investment Returns': ['dividend', 'interest', 'investment return', 'capital gain'],
        'Business Income': ['business', 'sales', 'revenue', 'profit'],
        'Rental Income': ['rental', 'rent', 'property income'],
        'Bonus': ['bonus', 'incentive', 'commission'],
        'Gift': ['gift', 'present', 'donation received'],
        'Refund': ['refund', 'return', 'reimbursement'],
        'Other Income': ['income', 'payment received', 'money received']
    };

    // Expense keywords
    const expenseKeywords = {
        'Food & Dining': ['food', 'restaurant', 'dining', 'coffee', 'cafe', 'starbucks', 'mcdonalds', 'pizza', 'lunch', 'dinner', 'breakfast'],
        'Groceries': ['grocery', 'supermarket', 'market', 'produce', 'meat', 'vegetables', 'grocery store'],
        'Transportation': ['uber', 'lyft', 'taxi', 'gas', 'fuel', 'parking', 'metro', 'bus', 'train', 'flight', 'airline', 'transport'],
        'Entertainment': ['movie', 'cinema', 'netflix', 'spotify', 'game', 'entertainment', 'concert', 'theater'],
        'Shopping': ['shopping', 'store', 'amazon', 'walmart', 'target', 'clothing', 'shoes', 'electronics', 'purchase', 'buy'],
        'Bills & Utilities': ['bill', 'utility', 'electric', 'water', 'internet', 'phone', 'cable', 'electricity'],
        'Healthcare': ['doctor', 'medical', 'pharmacy', 'hospital', 'clinic', 'medicine', 'health', 'dental'],
        'Education': ['school', 'education', 'course', 'university', 'college', 'book', 'tuition', 'learning'],
        'Travel': ['travel', 'hotel', 'flight', 'vacation', 'trip', 'booking', 'airbnb'],
        'Subscriptions': ['subscription', 'monthly', 'yearly', 'premium', 'membership'],
        'Insurance': ['insurance', 'premium', 'coverage'],
        'Rent/Mortgage': ['rent', 'mortgage', 'housing', 'apartment'],
        'Other Expense': ['expense', 'cost', 'charge', 'fee']
    };

    // Check for income first
    for (const [category, keywords] of Object.entries(incomeKeywords)) {
        const matches = keywords.filter(keyword => text.includes(keyword)).length;
        if (matches > 0) {
            return {
                category,
                type: 'income',
                confidence: Math.min(0.8, matches * 0.3),
                reasoning: `Matched ${matches} keyword(s) related to income category: ${category}`
            };
        }
    }

    // Check for expenses
    let bestCategory = 'Other Expense';
    let maxMatches = 0;

    for (const [category, keywords] of Object.entries(expenseKeywords)) {
        const matches = keywords.filter(keyword => text.includes(keyword)).length;
        if (matches > maxMatches) {
            maxMatches = matches;
            bestCategory = category;
        }
    }

    return {
        category: bestCategory,
        type: 'expense',
        confidence: maxMatches > 0 ? Math.min(0.7, maxMatches * 0.2) : 0.3,
        reasoning: maxMatches > 0
            ? `Matched ${maxMatches} keyword(s) related to expense category: ${bestCategory}`
            : 'No specific keywords found, defaulting to Other Expense'
    };
}

/**
 * Fallback category prediction using simple keyword matching
 */
function fallbackCategoryPrediction(title: string, description: string): CategoryPrediction {
    const text = `${title} ${description}`.toLowerCase();

    const categoryKeywords = {
        'Food & Dining': ['food', 'restaurant', 'dining', 'coffee', 'cafe', 'starbucks', 'mcdonalds', 'pizza', 'lunch', 'dinner', 'breakfast'],
        'Transportation': ['uber', 'lyft', 'taxi', 'gas', 'fuel', 'parking', 'metro', 'bus', 'train', 'flight', 'airline'],
        'Shopping': ['shopping', 'store', 'amazon', 'walmart', 'target', 'clothing', 'shoes', 'electronics'],
        'Entertainment': ['movie', 'cinema', 'netflix', 'spotify', 'game', 'entertainment', 'concert', 'theater'],
        'Bills & Utilities': ['bill', 'utility', 'electric', 'water', 'internet', 'phone', 'cable', 'rent', 'mortgage'],
        'Healthcare': ['doctor', 'medical', 'pharmacy', 'hospital', 'clinic', 'medicine', 'health', 'dental'],
        'Education': ['school', 'education', 'course', 'university', 'college', 'book', 'tuition', 'learning'],
        'Travel': ['travel', 'hotel', 'flight', 'vacation', 'trip', 'booking', 'airbnb'],
        'Groceries': ['grocery', 'supermarket', 'market', 'food', 'produce', 'meat', 'vegetables'],
        'Income': ['salary', 'wage', 'bonus', 'income', 'paycheck', 'freelance', 'payment'],
        'Investment': ['investment', 'stock', 'bond', 'mutual fund', 'retirement', '401k', 'savings']
    };

    let bestCategory = 'Other';
    let maxMatches = 0;

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        const matches = keywords.filter(keyword => text.includes(keyword)).length;
        if (matches > maxMatches) {
            maxMatches = matches;
            bestCategory = category;
        }
    }

    return {
        category: bestCategory,
        confidence: maxMatches > 0 ? Math.min(0.7, maxMatches * 0.2) : 0.3,
        reasoning: maxMatches > 0
            ? `Matched ${maxMatches} keyword(s) related to ${bestCategory}`
            : 'No specific keywords found, defaulting to Other'
    };
}
