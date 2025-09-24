// src/api/categoryService.ts
import { apiClient } from './apiClient';
import type { CategoryResponse, CategoryCreate } from '../types/category';

export const categoryService = {
  // GET /category/
  async getAllCategories(): Promise<CategoryResponse[]> {
    return apiClient.get<CategoryResponse[]>('/category/');
  },

  // POST /category/
  async createCategory(categoryData: CategoryCreate): Promise<CategoryResponse> {
    return apiClient.post<CategoryResponse>('/category/', categoryData);
  },
  
  // DELETE /category/{id}
  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete<void>(`/category/${id}`);
  },
};