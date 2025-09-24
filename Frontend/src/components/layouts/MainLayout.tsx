// src/components/Layout/MainLayout.tsx
import React from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ 
        marginLeft: '250px', 
        padding: '20px', 
        width: 'calc(100% - 250px)',
        background: '#ecf0f1',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <header style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, color: '#2c3e50' }}>Mike William</h1>
              <p style={{ margin: 0, color: '#7f8c8d' }}>Decisional</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, color: '#7f8c8d' }}>Current Balance</p>
              <h2 style={{ margin: 0, color: '#27ae60' }}>$79,000</h2>
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