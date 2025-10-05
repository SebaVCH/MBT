// src/types/api.ts
export interface User {
  id: number;
  email: string;
  name: string;
  balance: number;
}

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Category {
  id: number;
  name: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
}

// Requests
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface DepositRequest {
  amount: number;
}

export interface WithdrawRequest {
  amount: number;
}