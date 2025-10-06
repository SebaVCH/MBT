// src/components/layouts/MainLayout.tsx
import React, {useEffect, useState} from 'react';
import Sidebar from './Sidebar';
import { authService } from '../../api/authService';
import {personService} from "../../api/personService.ts";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const user = authService.getCurrentUser();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const balanceRes = await personService.getBalance();
      setBalance(balanceRes.balance);
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-64 flex-1 p-6">
        {/* Header */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {user?.name || 'Usuario'}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Balance Actual</p>
              <h2 className="text-3xl font-bold text-green-600">
                ${balance.toLocaleString() || '0'}
              </h2>
            </div>
          </div>
        </header>

        {/* Contenido principal */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;