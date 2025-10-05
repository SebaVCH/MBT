// src/api/transactionService.ts
import { apiClient } from './apiClient';
import type { Transaction, Category, PaymentMethod } from '../types/api';

interface DepositResponse {
  message: string;
  balance: number;
}

interface TransactionResponse {
  id: number;
  personID: number;
  categoryID: number;
  paymentMethodID: number | null;
  date: string;
  amount: number;
  description: string | null;
}

export const transactionService = {

  // Depositar dinero
  async deposit(amount: number, description?: string): Promise<DepositResponse> {
    const params = new URLSearchParams();
    params.append('amount', amount.toString());
    if (description) {
      params.append('description', description);
    }
    return await apiClient.post<DepositResponse>(`/person/deposit?${params.toString()}`);
  },

  // Retirar dinero (gastos)
  async withdraw(
    amount: number,
    categoryID: number,
    paymentMethodID: number,
    description?: string
  ): Promise<TransactionResponse> {
    return await apiClient.post<TransactionResponse>('/person/withdraw', {
      amount,
      categoryID,
      paymentMethodID,
      description
    });
  },

  // Obtener transacciones (si existe el endpoint)
  async getTransactions(): Promise<Transaction[]> {
    try {
      return await apiClient.get<Transaction[]>('/transactions');
    } catch (error) {
      // Si no existe el endpoint, devolver array vacío
      return [];
    }
  },

  // Obtener categorías - ENDPOINT REAL
  async getCategories(): Promise<Category[]> {
    return await apiClient.get<Category[]>('/category/');
  },

  // Crear categoría - ENDPOINT REAL
  async createCategory(name: string): Promise<Category> {
    return await apiClient.post<Category>('/category/', { name });
  },

  // Eliminar categoría - ENDPOINT REAL
  async deleteCategory(categoryId: number): Promise<void> {
    await apiClient.delete(`/category/${categoryId}`);
  },

  // Obtener métodos de pago - ENDPOINT REAL
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return await apiClient.get<PaymentMethod[]>('/payment-method/');
  },

  // Crear método de pago - ENDPOINT REAL
  async createPaymentMethod(name: string): Promise<PaymentMethod> {
    return await apiClient.post<PaymentMethod>('/payment-method/', { name });
  },

  // Eliminar método de pago - ENDPOINT REAL
  async deletePaymentMethod(paymentMethodId: number): Promise<void> {
    await apiClient.delete(`/payment-method/${paymentMethodId}`);
  }
};