// src/components/layouts/Sidebar.tsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../api/authService';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Inicio', icon: '🏠' },
    { path: '/income', label: 'Ingresos', icon: '💰' },
    { path: '/expense', label: 'Gastos', icon: '💸' },
    { path: '/categories', label: 'Categorias', icon: '📄'},
    { path: '/paymentMethods', label: 'Métodos de Pago', icon: '💳' },
    { path: '/ai-tips', label: 'Asistente IA', icon: '🤖' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-gray-800 text-white fixed h-full">
      <div className="p-6">
        {/* Logo y nombre de usuario */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h3 className="font-semibold">{user?.name || 'Usuario'}</h3>
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>

        {/* Menú de navegación */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Botón de cerrar sesión */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 mt-8 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <span>🚪</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;