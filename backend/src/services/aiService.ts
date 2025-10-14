import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const prisma = new PrismaClient();

export const generateFinancialInsights = async (userId: string) => {
  try {
    // Get user's recent transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 50
    });

    if (transactions.length === 0) {
      return {
        insights: ['Start by adding your transactions to get personalized insights!'],
        recommendations: []
      };
    }

    // Prepare data for AI analysis
    const income = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryBreakdown = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc: any, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const topCategories = Object.entries(categoryBreakdown)
      .sort(([, a]: any, [, b]: any) => b - a)
      .slice(0, 5);

    // Create prompt for GPT
    const prompt = `You are a financial advisor analyzing someone's spending patterns. Here's their data:

Total Income: $${income.toFixed(2)}
Total Expenses: $${expenses.toFixed(2)}
Balance: $${(income - expenses).toFixed(2)}

Top Spending Categories:
${topCategories.map(([cat, amount]) => `- ${cat}: $${amount}`).join('\n')}

Provide 3-4 specific, actionable insights and recommendations. Be concise, friendly, and practical. Focus on:
1. Spending patterns and anomalies
2. Savings opportunities
3. Budget recommendations
4. Financial health tips

Format as JSON with two arrays: "insights" and "recommendations". Each should be a short sentence or two.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful financial advisor providing personalized insights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;
    const parsed = JSON.parse(response || '{"insights":[],"recommendations":[]}');

    // Save insights to database
    for (const insight of parsed.insights) {
      await prisma.aIInsight.create({
        data: {
          userId,
          insight,
          type: 'SPENDING_ALERT',
          priority: 'MEDIUM'
        }
      });
    }

    return {
      insights: parsed.insights,
      recommendations: parsed.recommendations,
      summary: {
        income,
        expenses,
        balance: income - expenses,
        savingsRate: income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0
      }
    };
  } catch (error) {
    console.error('AI Service Error:', error);
    return {
      insights: ['Unable to generate insights at the moment. Please try again later.'],
      recommendations: [],
      summary: null
    };
  }
};

export const chatWithAI = async (userId: string, question: string) => {
  try {
    // Get user's context
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30
    });

    const context = `User has ${transactions.length} recent transactions. 
Total income: $${transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0)}
Total expenses: $${transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0)}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a helpful financial advisor. User context: ${context}. Provide concise, actionable advice.`
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.8,
      max_tokens: 300
    });

    return {
      response: completion.choices[0].message.content,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Chat AI Error:', error);
    return {
      response: 'I apologize, but I am unable to respond at the moment. Please try again later.',
      timestamp: new Date()
    };
  }
};