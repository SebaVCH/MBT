// src/api/authService.ts
import { apiClient } from './apiClient';
import type { User, LoginRequest, RegisterRequest } from '../types/api';

interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const authService = {
  // Login - ENDPOINT REAL
  async login(credentials: LoginRequest): Promise<void> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
      
      // Crear usuario temporal (hasta que tengamos endpoint para obtener usuario)
      const tempUser: User = {
        id: 1, // Temporal
        name: credentials.email.split('@')[0],
        email: credentials.email,
        balance: 0
      };
      
      localStorage.setItem('user', JSON.stringify(tempUser));
    } else {
      throw new Error('No se recibió token en la respuesta');
    }
  },

  // Register - ENDPOINT REAL
  async register(userData: RegisterRequest): Promise<void> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    
    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
      
      // Crear usuario con datos del registro
      const newUser: User = {
        id: 1, // Temporal
        name: userData.name,
        email: userData.email,
        balance: 0
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      throw new Error('No se recibió token en la respuesta');
    }
  },

  // Actualizar balance después de transacciones
  async updateUserBalance(): Promise<void> {
    try {
      // Como no hay endpoint para obtener usuario, mantenemos el balance en frontend
      // En una app real, aquí haríamos una request para obtener el balance actualizado
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        // El balance se actualizará cuando hagamos deposit/withdraw exitosamente
        localStorage.setItem('user', JSON.stringify(currentUser));
      }
    } catch (error) {
      console.warn('No se pudo actualizar el balance:', error);
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  // Actualizar balance local después de transacciones
  updateLocalBalance(amount: number): void {
    const user = this.getCurrentUser();
    if (user) {
      user.balance += amount;
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
};