// src/pages/Dashboard/Income.tsx
import React, { useState } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { transactionService } from '../../api/transactionService';
import { authService } from '../../api/authService';
import toast from 'react-hot-toast';

const Income: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const numericAmount = parseFloat(amount);
    if (numericAmount <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }

    // Registrar el ingreso usando el endpoint real
    await transactionService.deposit(numericAmount, description || undefined);
    
    toast.success('¡Ingreso registrado exitosamente!');
    
    // Actualizar balance local
    authService.updateLocalBalance(numericAmount);
    
    // Limpiar formulario
    setAmount('');
    setDescription('');
    
    // Recargar para ver cambios
    setTimeout(() => window.location.href = '/dashboard', 1000);
    
  } catch (error: any) {
    toast.error(error.message || 'Error registrando el ingreso');
  } finally {
    setLoading(false);
  }
};

  return (
    <MainLayout>
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">💰 Registrar Ingreso</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Monto ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descripción (Opcional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción del ingreso"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Procesando...' : 'Registrar Ingreso'}
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default Income;