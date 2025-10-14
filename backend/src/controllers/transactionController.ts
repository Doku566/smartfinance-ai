import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { generateFinancialInsights, chatWithAI } from '../services/aiService';
import { predictFutureSpending, getSpendingAnomalies } from '../services/mlPredictionService';

export const getInsights = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    
    const insights = await generateFinancialInsights(userId);
    
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate insights'
    });
  }
};

export const getPredictions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    
    const predictions = await predictFutureSpending(userId);
    const anomalies = await getSpendingAnomalies(userId);
    
    res.json({
      success: true,
      data: {
        predictions,
        anomalies
      }
    });
  } catch (error) {
    console.error('Get predictions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate predictions'
    });
  }
};

export const chat = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }

    const response = await chatWithAI(userId, question);
    
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat'
    });
  }
};