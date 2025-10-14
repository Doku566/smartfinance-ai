import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Predefined categories
const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Housing',
  'Income',
  'Investments',
  'Other'
];

// Simple keyword-based categorization (fallback)
const keywordCategories: { [key: string]: string[] } = {
  'Food & Dining': ['restaurant', 'food', 'cafe', 'lunch', 'dinner', 'breakfast', 'pizza', 'burger', 'starbucks', 'mcdonalds'],
  'Transportation': ['uber', 'lyft', 'gas', 'fuel', 'parking', 'transit', 'metro', 'taxi', 'car'],
  'Shopping': ['amazon', 'walmart', 'target', 'store', 'shopping', 'mall', 'clothing', 'nike'],
  'Entertainment': ['netflix', 'spotify', 'movie', 'concert', 'game', 'steam', 'playstation'],
  'Bills & Utilities': ['electric', 'water', 'internet', 'phone', 'bill', 'utility', 'insurance'],
  'Healthcare': ['doctor', 'hospital', 'pharmacy', 'medicine', 'dental', 'health'],
  'Education': ['tuition', 'school', 'course', 'book', 'university', 'college'],
  'Travel': ['hotel', 'flight', 'airbnb', 'booking', 'vacation', 'trip'],
  'Housing': ['rent', 'mortgage', 'apartment', 'maintenance', 'repair']
};

export const categorizeTransaction = async (description: string): Promise<string> => {
  try {
    const lowerDesc = description.toLowerCase();

    // First try keyword matching (fast and free)
    for (const [category, keywords] of Object.entries(keywordCategories)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        return category;
      }
    }

    // If no keyword match and OpenAI is configured, use AI
    if (process.env.OPENAI_API_KEY) {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Categorize the transaction into ONE of these categories: ${CATEGORIES.join(', ')}. Reply with ONLY the category name.`
          },
          {
            role: "user",
            content: `Transaction: ${description}`
          }
        ],
        temperature: 0.3,
        max_tokens: 20
      });

      const category = completion.choices[0].message.content?.trim();
      
      if (category && CATEGORIES.includes(category)) {
        return category;
      }
    }

    // Default fallback
    return 'Other';
  } catch (error) {
    console.error('Categorization error:', error);
    return 'Other';
  }
};