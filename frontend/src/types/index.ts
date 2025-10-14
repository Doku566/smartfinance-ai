// User types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  description: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionCreateInput {
  amount: number;
  description: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
}

export interface TransactionSummary {
  income: number;
  expenses: number;
  balance: number;
  count: number;
}

// Analytics types
export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

export interface CategoryData {
  [category: string]: number;
}

export interface Analytics {
  byCategory: CategoryData;
  byMonth: Record<string, { income: number; expenses: number }>;
  topCategories: [string, number][];
}

// AI types
export interface AIInsights {
  insights: string[];
  recommendations: string[];
  summary: {
    income: number;
    expenses: number;
    balance: number;
    savingsRate: string;
  } | null;
}

export interface Prediction {
  month: string;
  predictedIncome: number;
  predictedExpenses: number;
  predictedBalance: number;
  confidence: number;
}

export interface Anomaly {
  transaction: Transaction;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
}

export interface PredictionsData {
  predictions: Prediction[];
  anomalies: Anomaly[];
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp?: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}