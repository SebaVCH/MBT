import type { PaymentMethod, PaymentMethodCreate } from '../types/paymentMethod';
import { config } from './config';
import { apiClient } from './apiClient';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Datos mock
const mockPaymentMethods: PaymentMethod[] = [
  { id: 1, name: 'Cash', personID: 1 },
  { id: 2, name: 'Credit Card', personID: 1 },
  { id: 3, name: 'Debit Card', personID: 1 },
  { id: 4, name: 'Bank Transfer', personID: 1 }
];

const mockPaymentMethodService = {
  async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    await delay(600);
    return [...mockPaymentMethods];
  },

  async getPaymentMethodsByPerson(personID: number): Promise<PaymentMethod[]> {
    await delay(500);
    return mockPaymentMethods.filter(pm => pm.personID === personID);
  },

  async createPaymentMethod(paymentMethodData: PaymentMethodCreate): Promise<PaymentMethod> {
    await delay(500);
    const newPM: PaymentMethod = {
      id: Math.max(0, ...mockPaymentMethods.map(pm => pm.id)) + 1,
      ...paymentMethodData
    };
    mockPaymentMethods.push(newPM);
    return newPM;
  },

  async deletePaymentMethod(id: number): Promise<void> {
    await delay(400);
    const index = mockPaymentMethods.findIndex(pm => pm.id === id);
    if (index > -1) {
      mockPaymentMethods.splice(index, 1);
    }
  }
};

// Servicio real CORREGIDO
const realPaymentMethodService = {
  async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    return apiClient.get<PaymentMethod[]>('/payment-method/');
  },

  async getPaymentMethodsByPerson(personID: number): Promise<PaymentMethod[]> {
    const allMethods = await apiClient.get<PaymentMethod[]>('/payment-method/');
    return allMethods.filter(pm => pm.personID === personID);
  },

  async createPaymentMethod(paymentMethodData: PaymentMethodCreate): Promise<PaymentMethod> {
    return apiClient.post<PaymentMethod>('/payment-method/', paymentMethodData);
  },

  async deletePaymentMethod(id: number): Promise<void> {
    // Usar delete<void>() para indicar que no retorna datos
    await apiClient.delete<void>(`/payment-method/${id}`);
  }
};

export const paymentMethodService = config.useMockData ? mockPaymentMethodService : realPaymentMethodService;