import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';

function ProtectedRoute({ children, requireAdmin = false }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setLoading(false);
        return;
      }

      // Vérifier le token et récupérer les informations utilisateur
      const response = await axios.get('http://localhost:8090/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data) {
        setIsAuthenticated(true);
        setUserRole(response.data.role);
        setIsAdmin(response.data.role === 'Admin');
      }

    } catch (err) {
      console.error('Erreur d\'authentification:', err);
      setError('Session expirée');
      // Nettoyer les tokens invalides
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Vérification de l'authentification...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        textAlign="center"
        p={3}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Accès refusé
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          Seuls les administrateurs peuvent gérer les offres de stage.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error && `Erreur: ${error}`}
        </Typography>
      </Box>
    );
  }

  return children;
}

export default ProtectedRoute;
