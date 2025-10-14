import { useState, useEffect } from 'react';
import { getTransactions } from '../services/api';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
}

interface TransactionSummary {
  income: number;
  expenses: number;
  balance: number;
  count: number;
}

export const useTransactions = (filters?: any) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTransactions(filters);
      setTransactions(data.transactions);
      setSummary(data.summary);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to load transactions';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [JSON.stringify(filters)]);

  const refetch = () => {
    fetchTransactions();
  };

  return {
    transactions,
    summary,
    loading,
    error,
    refetch
  };
};