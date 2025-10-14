import { useState, useEffect } from 'react';
import { getAIInsights } from '../services/api';
import toast from 'react-hot-toast';

interface AIInsightsData {
  insights: string[];
  recommendations: string[];
  summary: {
    income: number;
    expenses: number;
    balance: number;
    savingsRate: string;
  } | null;
}

export const useAIInsights = () => {
  const [insights, setInsights] = useState<AIInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAIInsights();
      setInsights(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to load AI insights';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const refetch = () => {
    fetchInsights();
  };

  return {
    insights,
    loading,
    error,
    refetch
  };
};