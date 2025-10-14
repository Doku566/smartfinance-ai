import React, { useState } from 'react';
import { Trash2, Edit, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { deleteTransaction } from '../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface TransactionListProps {
  transactions: any[];
  onUpdate: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onUpdate }) => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        toast.success('Transaction deleted');
        onUpdate();
      } catch (error) {
        toast.error('Failed to delete transaction');
      }
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter.toUpperCase();
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Transactions</h2>
          
          <div className="flex space-x-2">
            {['all', 'income', 'expense'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No transactions found</p>
            <p className="text-sm mt-2">Click "Add Transaction" to get started</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Description</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Type</th>
                <th className="text-right py-3 px-6 text-sm font-semibold text-gray-700">Amount</th>
                <th className="text-center py-3 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-6 text-sm text-gray-700">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                    {transaction.description}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {transaction.type === 'INCOME' ? (
                        <>
                          <ArrowUpCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">Income</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownCircle className="w-5 h-5 text-red-600" />
                          <span className="text-sm text-red-600 font-medium">Expense</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className={`py-4 px-6 text-right text-sm font-semibold ${
                    transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'INCOME' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionList;