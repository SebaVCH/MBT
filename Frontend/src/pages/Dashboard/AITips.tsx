import React, { useEffect, useState } from 'react';
import { aiService, type AITipsResponse } from '../../api/aiService';
import MainLayout from '../../components/layouts/MainLayout';

const AITips: React.FC = () => {
  const [tipsData, setTipsData] = useState<AITipsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const data = await aiService.getFinancialTips();
      setTipsData(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los tips financieros. Por favor, intenta nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Analizando tus transacciones...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            🤖 Asistente Financiero IA
          </h1>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          <button
            onClick={fetchTips}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Reintentar
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            🤖 Asistente Financiero IA
          </h1>
          <button
            onClick={fetchTips}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>🔄</span>
            <span>Actualizar Tips</span>
          </button>
        </div>

        {tipsData && (
          <>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-4xl">🤖</span>
                <h2 className="text-2xl font-semibold">Consejos Personalizados</h2>
              </div>
              <p className="text-sm opacity-90">
                Basado en tu historial de transacciones
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {tipsData.tips}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  📅 Generado el: {new Date(tipsData.generated_at).toLocaleString('es-ES')}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Tip del sistema</h3>
                  <p className="text-blue-800 text-sm">
                    Estos consejos se actualizan automáticamente basándose en tus últimas transacciones.
                    Revisa regularmente para obtener recomendaciones actualizadas.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default AITips;
