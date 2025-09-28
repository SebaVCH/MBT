
import type { Transaction, TransactionCreate } from '../types/transaction';
import { config } from './config';
import { apiClient } from './apiClient';

// Datos mock temporalmente
const mockTransactions: Transaction[] = [
  {
    id: 1,
    personID: 1,
    categoryID: 1,
    paymentMethodID: 1,
    date: '2024-01-15T10:30:00',
    amount: 1000
  },
  {
    id: 2,
    personID: 1,
    categoryID: 2,
    paymentMethodID: 2,
    date: '2024-01-14T14:20:00',
    amount: -250
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Servicio mock
const mockTransactionService = {
  async getTransactionsByPerson(personID: number): Promise<Transaction[]> {
    await delay(800);
    return mockTransactions.filter(t => t.personID === personID);
  },

  async getRecentTransactions(limit: number = 5): Promise<Transaction[]> {
    await delay(600);
    return mockTransactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  },

  async createTransaction(transactionData: TransactionCreate): Promise<Transaction> {
    await delay(500);
    
    const newTransaction: Transaction = {
      id: Math.max(0, ...mockTransactions.map(t => t.id)) + 1,
      date: transactionData.date || new Date().toISOString(),
      ...transactionData
    };
    
    mockTransactions.push(newTransaction);
    return newTransaction;
  },

  async getTransactionById(id: number): Promise<Transaction> {
    await delay(300);
    const transaction = mockTransactions.find(t => t.id === id);
    if (!transaction) throw new Error('Transaction not found');
    return transaction;
  }
};

// Servicio real (AJUSTAR CUANDO VEA LOS ENDPOINTS REALES)
const realTransactionService = {
  async getTransactionsByPerson(personID: number): Promise<Transaction[]> {
    // Probable endpoint: GET /person/{id}/transactions
    return apiClient.get<Transaction[]>(`/person/${personID}/transactions`);
  },

  async getRecentTransactions(limit: number = 5): Promise<Transaction[]> {
    // Probable endpoint: GET /transactions/recent
    return apiClient.get<Transaction[]>(`/transactions/recent?limit=${limit}`);
  },

  async createTransaction(transactionData: TransactionCreate): Promise<Transaction> {
    // Probable endpoint: POST /transactions
    return apiClient.post<Transaction>('/transactions', transactionData);
  },

  async getTransactionById(id: number): Promise<Transaction> {
    // Probable endpoint: GET /transactions/{id}
    return apiClient.get<Transaction>(`/transactions/${id}`);
  }
};

export const transactionService = config.useMockData ? mockTransactionService : realTransactionService;