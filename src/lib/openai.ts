import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Only for client-side usage
});

export interface CategoryPrediction {
    category: string;
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
     * Predict category for a transaction based on title and description
     */
    async predictCategory(title: string, description: string): Promise<CategoryPrediction> {
        try {
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

            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
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
    async generateInsights(transactions: any[]): Promise<SpendingInsight[]> {
        try {
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

            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
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

            const parsed = JSON.parse(response);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error('OpenAI insights generation failed:', error);
            return [];
        }
    }
};

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
