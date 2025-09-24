// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { transactionService } from '../../api/transactionService';
import { personService } from '../../api/personService';
import type { Transaction, Person } from '../../types';

const Home: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Obtener persona actual (usar ID del usuario logueado)
      const personData = await personService.getCurrentPerson();
      setPerson(personData);

      // Obtener transacciones recientes
      const transactionsData = await transactionService.getRecentTransactions();
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular totals
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  if (loading) return <MainLayout><div>Loading...</div></MainLayout>;

  return (
    <MainLayout>
      <div>
        {/* Financial Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
            <h3 style={{ color: '#7f8c8d' }}>Current Balance</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
              ${person?.balance || 0}
            </p>
          </div>
          
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
            <h3 style={{ color: '#7f8c8d' }}>Total Income</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
              ${totalIncome}
            </p>
          </div>
          
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
            <h3 style={{ color: '#7f8c8d' }}>Total Expenses</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>
              ${totalExpenses}
            </p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
          <h3>Recent Transactions</h3>
          {transactions.length === 0 ? (
            <p>No transactions yet</p>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {transactions.map(transaction => (
                <div key={transaction.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '10px', 
                  borderBottom: '1px solid #ecf0f1',
                  color: transaction.amount > 0 ? '#27ae60' : '#e74c3c'
                }}>
                  <div>
                    <strong>Transaction #{transaction.id}</strong>
                    <p style={{ margin: 0, color: '#7f8c8d' }}>
                      Category: {transaction.categoryID} | Method: {transaction.paymentMethodID}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong>{transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}</strong>
                    <p style={{ margin: 0, color: '#7f8c8d' }}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
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