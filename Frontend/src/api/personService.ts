// src/api/personService.ts
import type { Person } from '../types/person';
import { config } from './config';
import { apiClient } from './apiClient';

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
    await delay(400);
    mockPerson.balance = newBalance;
    return mockPerson;
  }
};

const realPersonService = {
  async getCurrentPerson(): Promise<Person> {
    return apiClient.get<Person>('/person/current');
  },

  async getPersonById(id: number): Promise<Person> {
    return apiClient.get<Person>(`/person/${id}`);
  },

  async updatePersonBalance(personID: number, newBalance: number): Promise<Person> {
    return apiClient.put<Person>(`/person/${personID}/balance`, { balance: newBalance });
  }
};

export const personService = config.useMockData ? mockPersonService : realPersonService;

function delay(arg0: number) {
    throw new Error('Function not implemented.');
}
