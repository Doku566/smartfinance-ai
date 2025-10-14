// Transaction model types (Prisma generates these automatically)
// This file is for additional Transaction-related types and interfaces

export interface TransactionCreateInput {
  amount: number;
  description: string;
  date: Date | string;
  type: 'INCOME' | 'EXPENSE';
  category?: string;
}

export interface TransactionUpdateInput {
  amount?: number;
  description?: string;
  date?: Date | string;
  type?: 'INCOME' | 'EXPENSE';
  category?: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  type?: 'INCOME' | 'EXPENSE';
}

export interface TransactionSummary {
  income: number;
  expenses: number;
  balance: number;
  count: number;
}

export interface TransactionAnalytics {
  byCategory: Record<string, number>;
  byMonth: Record<string, {
    income: number;
    expenses: number;
  }>;
  topCategories: [string, number][];
}