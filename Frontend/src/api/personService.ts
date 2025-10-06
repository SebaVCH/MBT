// src/api/personService.ts
import type { Person } from '../types/person';
import { config } from './config';
import { apiClient } from './apiClient';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockPerson: Person = {
  id: 1,
  email: 'mike@example.com',
  name: 'Mike William',
  password: 'hashed_password',
  balance: 79000
};

const mockPersonService = {
  async getCurrentPerson(): Promise<Person> {
    await delay(500);
    return mockPerson;
  },

  async getPersonById(id: number): Promise<Person> {
    await delay(300);
    return { ...mockPerson, id };
  },

  async updatePersonBalance(personID: number, newBalance: number): Promise<Person> {
    return apiClient.put<Person>(`/person/${personID}/balance`, { balance: newBalance });
  },

  async getBalance(): Promise<{ balance: number }> {
        return apiClient.get<{ balance: number }>('/person/balance');
    },

    async getIncome(): Promise<{ total_income: number }> {
        return apiClient.get<{ total_income: number }>('/person/income');
    },

    async getExpenses(): Promise<{ total_expenses: number }> {
        return apiClient.get<{ total_expenses: number }>('/person/expenses');
    },

};

const realPersonService = {

    async getBalance(): Promise<{ balance: number }> {
        return apiClient.get<{ balance: number }>('/person/balance');
    },

    async getIncome(): Promise<{ total_income: number }> {
        return apiClient.get<{ total_income: number }>('/person/income');
    },

    async getExpenses(): Promise<{ total_expenses: number }> {
        return apiClient.get<{ total_expenses: number }>('/person/expenses');
    },

  async getCurrentPerson(): Promise<Person> {
    // Probar diferentes endpoints comunes
    const endpoints = [
      '/users/me',
      '/user/me',
      '/auth/me',
      '/me',
      '/person/me'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Probando endpoint de persona: ${endpoint}`);
        const response = await apiClient.get<Person>(endpoint);
        console.log(`✅ Persona obtenida de: ${endpoint}`, response);
        return response;
      } catch (error) {
        console.log(`❌ Falló: ${endpoint}`);
      }
    }
    
    // Si ningún endpoint funciona, usar datos del localStorage
    const storedPerson = localStorage.getItem('currentPerson');
    if (storedPerson) {
      console.log("⚠️ Usando datos de localStorage para persona");
      return JSON.parse(storedPerson);
    }
    
    throw new Error('No se pudo obtener los datos de la persona');
  },

  async getPersonById(id: number): Promise<Person> {
    return apiClient.get<Person>(`/person/${id}`);
  },

    async updatePersonBalance(personID: number, newBalance: number): Promise<Person> {
    return apiClient.put<Person>(`/person/${personID}/balance`, { balance: newBalance });
  }
};


export const personService = config.useMockData ? mockPersonService : realPersonService;
