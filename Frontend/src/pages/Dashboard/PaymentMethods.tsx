import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { paymentMethodService } from '../../api/paymentMethodService';
import type { PaymentMethod, PaymentMethodCreate } from '../../types/api';

const PaymentMethods: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PaymentMethodCreate>({ name: '' });

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const data = await paymentMethodService.getPaymentMethods();
      setPaymentMethods(data);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      alert('Error al cargar los métodos de pago');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const newPaymentMethod = await paymentMethodService.createPaymentMethod(formData);
      setPaymentMethods(prev => [...prev, newPaymentMethod]);
      setFormData({ name: '' });
      alert('Método de pago creado exitosamente');
    } catch (error) {
      console.error('Error creating payment method:', error);
      alert('Error al crear el método de pago');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este método de pago?')) return;

    try {
      await paymentMethodService.deletePaymentMethod(id);
      setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
      alert('Método de pago eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting payment method:', error);
      alert('Error al eliminar el método de pago');
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Gestión de Métodos de Pago</h1>
          
          {/* Formulario para crear método de pago */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Crear Nuevo Método de Pago</h2>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="Nombre del método de pago"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Crear Método
              </button>
            </form>
          </div>

          {/* Lista de métodos de pago */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Tus Métodos de Pago</h2>
            {loading ? (
              <p>Cargando métodos de pago...</p>
            ) : paymentMethods.length === 0 ? (
              <p className="text-gray-500">No hay métodos de pago creados</p>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map(method => (
                  <div
                    key={method.id}
                    className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
                  >
                    <span className="font-medium">{method.name}</span>
                      {method.personID !== 0 && (<button
                      onClick={() => handleDelete(method.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                    >
                      Eliminar
                    </button>)}
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

export default PaymentMethods;