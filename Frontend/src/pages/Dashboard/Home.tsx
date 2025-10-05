// src/pages/Dashboard/Home.tsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { transactionService } from '../../api/transactionService';
import { authService } from '../../api/authService';
import type { Transaction, User } from '../../types/api';

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);

      const userTransactions = await transactionService.getTransactions();
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return <MainLayout><div>Cargando...</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="p-6">
        {/* Resumen Financiero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-gray-600 mb-2">Balance Actual</h3>
            <p className="text-3xl font-bold text-green-600">
              ${user?.balance?.toLocaleString() || 0}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-gray-600 mb-2">Total Ingresos</h3>
            <p className="text-3xl font-bold text-blue-600">
              ${totalIncome.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-gray-600 mb-2">Total Gastos</h3>
            <p className="text-3xl font-bold text-red-600">
              ${totalExpenses.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Transacciones Recientes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Transacciones Recientes</h3>
          {transactions.length === 0 ? (
            <p className="text-gray-500">No hay transacciones recientes</p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map(transaction => (
                <div key={transaction.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;