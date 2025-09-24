
import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { transactionService } from '../../api/transactionService';
import { categoryService } from '../../api/categoryService';
import { paymentMethodService } from '../../api/paymentMethodService';
import type { Category, PaymentMethod, TransactionCreate } from '../../types';

//Similar a Income pero con amount negativo
//(Solo cambiaría el título y la lógica del amount a negativo)
const Expense: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [formData, setFormData] = useState({
    amount: '',
    categoryID: '',
    paymentMethodID: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      const [cats, pms] = await Promise.all([
        categoryService.getAllCategories(),
        paymentMethodService.getAllPaymentMethods()
      ]);
      setCategories(cats);
      setPaymentMethods(pms);
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const transactionData: TransactionCreate = {
        personID: 1, // Obtener del usuario logueado
        categoryID: parseInt(formData.categoryID),
        paymentMethodID: parseInt(formData.paymentMethodID),
        amount: Math.abs(parseFloat(formData.amount)), // Asegurar positivo
        date: formData.date
      };

      await transactionService.createTransaction(transactionData);
      alert('Income registered successfully!');
      setFormData({
        amount: '',
        categoryID: '',
        paymentMethodID: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error creating income:', error);
      alert('Error registering income');
    }
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1>Register Income</h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
          <div>
            <label>Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
            />
          </div>

          <div>
            <label>Category</label>
            <select
              value={formData.categoryID}
              onChange={(e) => setFormData({...formData, categoryID: e.target.value})}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Payment Method</label>
            <select
              value={formData.paymentMethodID}
              onChange={(e) => setFormData({...formData, paymentMethodID: e.target.value})}
              required
            >
              <option value="">Select a payment method</option>
              {paymentMethods.map(pm => (
                <option key={pm.id} value={pm.id}>{pm.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>

          <button type="submit">Register Income</button>
        </form>
      </div>
    </MainLayout>
  );
};

export default Expense;