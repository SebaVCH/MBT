import { apiClient } from './apiClient';
import type { PaymentMethod, PaymentMethodCreate } from '../types/api';

export const paymentMethodService = {
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return await apiClient.get<PaymentMethod[]>('/payment-method/');
  },

  async createPaymentMethod(paymentMethodData: PaymentMethodCreate): Promise<PaymentMethod> {
    return await apiClient.post<PaymentMethod>('/payment-method/', paymentMethodData);
  },

  async deletePaymentMethod(id: number): Promise<void> {
    await apiClient.delete(`/payment-method/${id}`);
  }
};