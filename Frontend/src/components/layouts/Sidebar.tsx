// src/components/Layout/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/income', label: 'Income', icon: '💰' },
    { path: '/expense', label: 'Expense', icon: '💸' },
    { path: '/categories', label: 'Categories', icon: '📁' },
  ];

  return (
    <div style={{
      width: '250px',
      background: '#2c3e50',
      color: 'white',
      height: '100vh',
      padding: '20px',
      position: 'fixed'
    }}>
      <h2 style={{ marginBottom: '30px' }}>💼 Expense Tracker</h2>
      
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {menuItems.map(item => (
            <li key={item.path} style={{ marginBottom: '10px' }}>
              <Link
                to={item.path}
                style={{
                  display: 'block',
                  padding: '10px 15px',
                  color: location.pathname === item.path ? '#2c3e50' : 'white',
                  background: location.pathname === item.path ? '#ecf0f1' : 'transparent',
                  textDecoration: 'none',
                  borderRadius: '5px',
                  transition: 'all 0.3s'
                }}
              >
                <span style={{ marginRight: '10px' }}>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
          
          {/* Logout */}
          <li style={{ marginTop: '30px' }}>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
              style={{
                width: '100%',
                padding: '10px 15px',
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              🚪 Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;