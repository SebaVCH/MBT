// src/pages/Dashboard/Home.tsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { transactionService } from '../../api/transactionService';
import { authService } from '../../api/authService';
import type { Transaction, User } from '../../types/api';
import { personService } from '../../api/personService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const sortedTransactions = transactions.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const currentTransactions = sortedTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
  try {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    const userTransactions = await transactionService.getTransactions();
    setTransactions(userTransactions);

    // Fetch new summary data
    const balanceRes = await personService.getBalance();
    setBalance(balanceRes.balance);

    const incomeRes = await personService.getIncome();
    setIncome(incomeRes.total_income);

    const expensesRes = await personService.getExpenses();
    setExpenses(expensesRes.total_expenses);
  } catch (error) {
    console.error('Error loading dashboard:', error);
  } finally {
    setLoading(false);
  }
};

  // Datos para el gráfico de barras (Ingresos vs Gastos)
  const barChartData = {
    labels: ['Ingresos', 'Gastos'],
    datasets: [
      {
        label: 'Monto ($)',
        data: [income, expenses],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)', // Azul para ingresos
          'rgba(255, 99, 132, 0.8)', // Rojo para gastos
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Ingresos vs Gastos',
      },
    },
  };

  // Datos para el gráfico de doughnut (Balance)
  const doughnutChartData = {
    labels: ['Ingresos', 'Gastos', 'Balance Actual'],
    datasets: [
      {
        data: [income, expenses, balance],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',  // Azul - Ingresos
          'rgba(255, 99, 132, 0.8)',  // Rojo - Gastos
          'rgba(75, 192, 192, 0.8)',  // Verde - Balance
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Distribución Financiera',
      },
    },
  };

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
              ${balance.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-gray-600 mb-2">Total Ingresos</h3>
            <p className="text-3xl font-bold text-blue-600">
              ${income.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-gray-600 mb-2">Total Gastos</h3>
            <p className="text-3xl font-bold text-red-600">
              ${expenses.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </div>

        {/* Transacciones Recientes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Transacciones Recientes</h3>
          {transactions.length === 0 ? (
            <p className="text-gray-500">No hay transacciones recientes</p>
          ) : (
            <>
              <div className="space-y-3">
                {currentTransactions.map(transaction => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">{transaction.description || 'Sin descripción'}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.categoryName || 'Sin categoría'} • {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`font-bold ${
                      transaction.categoryName?.toLowerCase() === 'ingreso' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.categoryName?.toLowerCase() === 'ingreso' ? '+' : '-'}${transaction.amount}
                    </span>
                  </div>
                ))}
              </div>

              {/* Controles de paginación */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="text-gray-600">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;