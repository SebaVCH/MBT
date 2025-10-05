import { apiClient } from './apiClient';
import type { Category, CategoryCreate } from '../types/api';

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    return await apiClient.get<Category[]>('/category/');
  },

  async createCategory(categoryData: CategoryCreate): Promise<Category> {
    return await apiClient.post<Category>('/category/', categoryData);
  },

  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`/category/${id}`);
  }
};