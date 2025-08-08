import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Verifica si hay token guardado para inicializar estado
    return !!localStorage.getItem('token');
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, setIsAuthenticated, logout };
};
