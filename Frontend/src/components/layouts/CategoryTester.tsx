// src/components/CategoryTester.tsx
import React, { useState, useEffect } from 'react';
import { categoryService } from '../../api/categoryService';
import type { CategoryResponse } from '../../types/category';

const CategoryTester: React.FC = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const categoriesData = await categoryService.getAllCategories();
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  if (loading) return <div>Cargando categorías...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h2>Lista de Categorías</h2>
      <button onClick={loadCategories}>Recargar</button>
      
      {categories.length === 0 ? (
        <p>No hay categorías</p>
      ) : (
        <ul>
          {categories.map(category => (
            <li key={category.id}>
              <strong>ID: {category.id}</strong> - {category.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryTester;