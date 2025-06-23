import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:8090/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      // Token invalide, nettoyer le localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  const isAdmin = () => {
    return user?.role === 'Admin';
  };

  const isClient = () => {
    return user?.role === 'Client';
  };

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin: isAdmin(),
    isClient: isClient(),
    logout,
    checkAuthStatus
  };
};

export default useAuth;
