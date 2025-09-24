// src/pages/Income.tsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { transactionService } from '../../api/transactionService';
import { categoryService } from '../../api/categoryService';
import { paymentMethodService } from '../../api/paymentMethodService';
import type { Category, PaymentMethod } from '../../types';

const Income: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: '',
    categoryID: '',
    paymentMethodID: '',
    description: ''
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
    setLoading(true);
    
    try {
      const amount = parseFloat(formData.amount);
      const categoryID = parseInt(formData.categoryID);
      const paymentMethodID = parseInt(formData.paymentMethodID);

      await transactionService.deposit(amount, categoryID, paymentMethodID);
      
      alert('Income registered successfully!');
      setFormData({
        amount: '',
        categoryID: '',
        paymentMethodID: '',
        description: ''
      });
    } catch (error) {
      console.error('Error registering income:', error);
      alert('Error registering income');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1>💰 Register Income</h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
          <div>
            <label>Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
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
            <label>Description (Optional)</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Register Income'}
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default Income;