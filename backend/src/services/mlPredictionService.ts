import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Prediction {
  month: string;
  predictedIncome: number;
  predictedExpenses: number;
  predictedBalance: number;
  confidence: number;
}

export const predictFutureSpending = async (userId: string): Promise<Prediction[]> => {
  try {
    // Get historical data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: sixMonthsAgo }
      },
      orderBy: { date: 'asc' }
    });

    if (transactions.length < 10) {
      // Not enough data for prediction
      return [];
    }

    // Group by month
    const monthlyData = transactions.reduce((acc: any, t) => {
      const month = t.date.toISOString().substring(0, 7);
      if (!acc[month]) {
        acc[month] = { income: 0, expenses: 0 };
      }
      if (t.type === 'INCOME') {
        acc[month].income += t.amount;
      } else {
        acc[month].expenses += t.amount;
      }
      return acc;
    }, {});

    const months = Object.keys(monthlyData).sort();
    
    // Simple linear regression for trend
    const incomeValues = months.map(m => monthlyData[m].income);
    const expenseValues = months.map(m => monthlyData[m].expenses);

    const avgIncome = incomeValues.reduce((a, b) => a + b, 0) / incomeValues.length;
    const avgExpenses = expenseValues.reduce((a, b) => a + b, 0) / expenseValues.length;

    // Calculate trend (simple moving average)
    const incomeTrend = calculateTrend(incomeValues);
    const expenseTrend = calculateTrend(expenseValues);

    // Predict next 3 months
    const predictions: Prediction[] = [];
    const lastMonth = new Date(months[months.length - 1] + '-01');

    for (let i = 1; i <= 3; i++) {
      const futureMonth = new Date(lastMonth);
      futureMonth.setMonth(futureMonth.getMonth() + i);
      const monthStr = futureMonth.toISOString().substring(0, 7);

      const predictedIncome = avgIncome + (incomeTrend * i);
      const predictedExpenses = avgExpenses + (expenseTrend * i);

      predictions.push({
        month: monthStr,
        predictedIncome: Math.max(0, predictedIncome),
        predictedExpenses: Math.max(0, predictedExpenses),
        predictedBalance: predictedIncome - predictedExpenses,
        confidence: calculateConfidence(incomeValues, expenseValues, i)
      });
    }

    return predictions;
  } catch (error) {
    console.error('Prediction error:', error);
    return [];
  }
};

function calculateTrend(values: number[]): number {
  if (values.length < 2) return 0;

  // Simple linear regression slope
  const n = values.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  
  const sumX = indices.reduce((a, b) => a + b, 0);
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0);
  const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  return slope;
}

function calculateConfidence(income: number[], expenses: number[], monthsAhead: number): number {
  // Confidence decreases with prediction distance and data variance
  const baseConfidence = 85;
  const timeDecay = monthsAhead * 5; // -5% per month
  const varianceDecay = calculateVariance(income) + calculateVariance(expenses);
  
  return Math.max(40, Math.min(95, baseConfidence - timeDecay - varianceDecay));
}

function calculateVariance(values: number[]): number {
  if (values.length < 2) return 0;
  
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  // Normalize to 0-10 range
  return Math.min(10, (stdDev / avg) * 100);
}

export const getSpendingAnomalies = async (userId: string) => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: 'EXPENSE',
        date: { gte: oneMonthAgo }
      }
    });

    if (transactions.length < 5) return [];

    // Calculate average and standard deviation
    const amounts = transactions.map(t => t.amount);
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);

    // Find anomalies (transactions > 2 standard deviations from mean)
    const anomalies = transactions.filter(t => 
      Math.abs(t.amount - avg) > 2 * stdDev
    );

    return anomalies.map(t => ({
      transaction: t,
      severity: t.amount > avg + 2 * stdDev ? 'HIGH' : 'MEDIUM',
      message: `Unusual ${t.category} expense of $${t.amount.toFixed(2)}`
    }));
  } catch (error) {
    console.error('Anomaly detection error:', error);
    return [];
  }
};