// src/pages/Dashboard/Expense.tsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { transactionService } from '../../api/transactionService';
import { authService } from '../../api/authService';
import type { Category, PaymentMethod } from '../../types/api';
import toast from 'react-hot-toast';

const Expense: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      const [cats, pms] = await Promise.all([
        transactionService.getCategories(),
        transactionService.getPaymentMethods()
      ]);
      setCategories(cats);
      setPaymentMethods(pms);
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const numericAmount = parseFloat(amount);
      if (numericAmount <= 0) {
        toast.error('El monto debe ser mayor a 0');
        return;
      }

       if (!categoryId) {
      toast.error('Debes seleccionar una categoría');
      return;
    }

    if (!paymentMethodId) {
      toast.error('Debes seleccionar un método de pago');
      return;
    }

      // Usar el endpoint REAL de withdraw
        await transactionService.withdraw(numericAmount,
        parseInt(categoryId),
        parseInt(paymentMethodId),
        description || undefined
    );
      
      toast.success('¡Gasto registrado exitosamente!');
      
      // Actualizar balance local
      authService.updateLocalBalance(-numericAmount);
      
      // Limpiar formulario
      setAmount('');
      setDescription('');
      setCategoryId('');
      setPaymentMethodId('');
      
      // Recargar para ver cambios
      setTimeout(() => window.location.href = '/dashboard', 1000);
      
    } catch (error: any) {
      toast.error(error.message || 'Error registrando el gasto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">💸 Registrar Gasto</h1>
        
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
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Categoría</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Método de Pago</label>
            <select
              value={paymentMethodId}
              onChange={(e) => setPaymentMethodId(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Selecciona un método de pago</option>
              {paymentMethods.map(pm => (
                <option key={pm.id} value={pm.id}>{pm.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descripción</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Descripción del gasto"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Procesando...' : 'Registrar Gasto'}
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default Expense;