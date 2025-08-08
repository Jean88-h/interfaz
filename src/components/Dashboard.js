import React, { useState } from 'react';
import Menu from './Menu';
import { Outlet } from 'react-router-dom';
import SessionTokens from './SessionTokens';
import { FaUserCircle, FaBars, FaTimes, FaKey, FaBell, FaHome } from 'react-icons/fa';
import TokenRefresher from './TokenRefresher'; // Importar el componente
import '../styles/Dashboard.css';

const Dashboard = () => {
  const username = localStorage.getItem('username') || 'Usuario';
  const [showTokens, setShowTokens] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  
  const toggleTokens = () => setShowTokens(prev => !prev);
  const toggleMenu = () => setIsMenuCollapsed(prev => !prev);
  
  return (
    <div className="dashboard-container">
      {/* Menú lateral con nuevo diseño */}
      <div className={`sidebar ${isMenuCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-circle">
              <FaHome className="logo-icon" />
            </div>
            {!isMenuCollapsed && (
              <div className="app-title">
                <h2>Mi Biblioteca</h2>
              </div>
            )}
          </div>
          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuCollapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>
        
        <Menu 
          username={username} 
          onToggleTokens={toggleTokens} 
          isCollapsed={isMenuCollapsed}
        />
        
        {!isMenuCollapsed && (
          <div className="sidebar-footer">
            <button className="token-btn" onClick={toggleTokens}>
              <FaKey className="token-icon" />
              <span>Tokens de Sesión</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Contenido principal */}
      <div className={`dashboard-content ${isMenuCollapsed ? 'expanded' : ''}`}>
        <div className="content-header">
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Inicio</span>
          </div>
          <div className="header-actions">
            <div className="notification-badge">
              <FaBell className="notification-icon" />
              <span className="notification-count">3</span>
            </div>
            <div className="user-badge">
              <FaUserCircle className="avatar-icon-sm" />
              <span>{username}</span>
            </div>
          </div>
        </div>
        
        <div className="content-container">
          {/* Agregamos el componente TokenRefresher aquí */}
          <TokenRefresher />
          {showTokens ? <SessionTokens /> : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;