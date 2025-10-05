import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { categoryService } from '../../api/categoryService';
import type { Category, CategoryCreate } from '../../types/api';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CategoryCreate>({ name: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      alert('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const newCategory = await categoryService.createCategory(formData);
      setCategories(prev => [...prev, newCategory]);
      setFormData({ name: '' });
      alert('Categoría creada exitosamente');
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Error al crear la categoría');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return;

    try {
      await categoryService.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      alert('Categoría eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error al eliminar la categoría');
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Gestión de Categorías</h1>
          
          {/* Formulario para crear categoría */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Crear Nueva Categoría</h2>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="Nombre de la categoría"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear Categoría
              </button>
            </form>
          </div>

          {/* Lista de categorías */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Tus Categorías</h2>
            {loading ? (
              <p>Cargando categorías...</p>
            ) : categories.length === 0 ? (
              <p className="text-gray-500">No hay categorías creadas</p>
            ) : (
              <div className="space-y-3">
                {categories.map(category => (
                  <div
                    key={category.id}
                    className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
                  >
                    <span className="font-medium">{category.name}</span>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Categories;