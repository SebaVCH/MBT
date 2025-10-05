// src/components/ManageCategories.tsx
import React, { useState, useEffect } from 'react';
import { transactionService } from '../api/transactionService';
import type { Category } from '../types/api';
import toast from 'react-hot-toast';

const ManageCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await transactionService.getCategories();
      setCategories(cats);
    } catch (error) {
      toast.error('Error cargando categorías');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setLoading(true);
    try {
      await transactionService.createCategory(newCategoryName.trim());
      toast.success('Categoría creada');
      setNewCategoryName('');
      await loadCategories();
    } catch (error: any) {
      toast.error(error.message || 'Error creando categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      await transactionService.deleteCategory(categoryId);
      toast.success('Categoría eliminada');
      await loadCategories();
    } catch (error: any) {
      toast.error(error.message || 'Error eliminando categoría');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Gestionar Categorías</h3>
      
      <form onSubmit={handleCreateCategory} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Nueva categoría"
          className="flex-1 p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? 'Creando...' : 'Agregar'}
        </button>
      </form>

      <div className="space-y-2">
        {categories.map(category => (
          <div key={category.id} className="flex justify-between items-center p-3 border rounded">
            <span>{category.name}</span>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              className="text-red-600 hover:text-red-800"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCategories;