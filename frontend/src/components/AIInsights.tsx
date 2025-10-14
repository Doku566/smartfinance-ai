import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Send, Sparkles } from 'lucide-react';
import { getAIInsights, getPredictions, chatWithAI } from '../services/api';
import toast from 'react-hot-toast';

const AIInsights: React.FC = () => {
  const [insights, setInsights] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const [insightsData, predictionsData] = await Promise.all([
        getAIInsights(),
        getPredictions()
      ]);
      
      setInsights(insightsData.data);
      setPredictions(predictionsData.data);
    } catch (error) {
      toast.error('Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await chatWithAI(chatInput);
      const aiMessage = { role: 'ai', content: response.data.response };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to get AI response');
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Insights */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">AI-Powered Insights</h2>
        </div>

        {insights?.insights && insights.insights.length > 0 ? (
          <div className="space-y-4">
            {insights.insights.map((insight: string, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Add more transactions to receive personalized insights
          </p>
        )}

        {insights?.summary && (
          <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Income</p>
              <p className="text-lg font-semibold text-green-600">
                ${insights.summary.income.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expenses</p>
              <p className="text-lg font-semibold text-red-600">
                ${insights.summary.expenses.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Balance</p>
              <p className="text-lg font-semibold text-indigo-600">
                ${insights.summary.balance.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Savings Rate</p>
              <p className="text-lg font-semibold text-blue-600">
                {insights.summary.savingsRate}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {insights?.recommendations && insights.recommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Recommendations</h2>
          </div>

          <div className="space-y-3">
            {insights.recommendations.map((rec: string, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Predictions */}
      {predictions?.predictions && predictions.predictions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Future Predictions</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Month</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Income</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Expenses</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Balance</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {predictions.predictions.map((pred: any, index: number) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-700">{pred.month}</td>
                    <td className="py-3 px-4 text-sm text-green-600 text-right font-medium">
                      ${pred.predictedIncome.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-red-600 text-right font-medium">
                      ${pred.predictedExpenses.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-indigo-600 text-right font-medium">
                      ${pred.predictedBalance.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-right">
                      {pred.confidence.toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Anomalies */}
      {predictions?.anomalies && predictions.anomalies.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Unusual Spending Detected</h2>
          </div>

          <div className="space-y-3">
            {predictions.anomalies.map((anomaly: any, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-700 font-medium">{anomaly.message}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Severity: <span className={`font-semibold ${
                      anomaly.severity === 'HIGH' ? 'text-red-600' : 'text-yellow-600'
                    }`}>{anomaly.severity}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Chat */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center space-x-3 p-6 bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="bg-white p-2 rounded-lg">
            <Brain className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-white">Chat with AI Assistant</h2>
        </div>

        <div className="p-6">
          <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
            {chatMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Ask me anything about your finances!</p>
                <p className="text-sm mt-2">Try: "How can I save more money?" or "What's my biggest expense?"</p>
              </div>
            ) : (
              chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChat()}
              placeholder="Ask me anything about your finances..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
              disabled={chatLoading}
            />
            <button
              onClick={handleChat}
              disabled={chatLoading || !chatInput.trim()}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;