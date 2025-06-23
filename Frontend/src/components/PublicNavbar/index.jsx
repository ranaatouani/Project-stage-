import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from '@mui/material';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import UserProfileMenu from 'components/UserProfileMenu';
import useAuth from 'hooks/useAuth';

function PublicNavbar() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isClient } = useAuth();

  const handleLogin = () => {
    navigate('/auth/sign-in');
  };

  const handleRegister = () => {
    navigate('/auth/sign-up');
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleDashboard = () => {
    if (isAdmin) {
      navigate('/dashboard');
    } else if (isClient) {
      navigate('/client/accueil');
    }
  };

  return (
    <AppBar position="static" color="transparent" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar>
          {/* Logo et titre */}
          <MDBox 
            display="flex" 
            alignItems="center" 
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={handleHome}
          >
            <MDTypography variant="h5" fontWeight="bold" color="primary">
              🎓 Plateforme de Stages
            </MDTypography>
          </MDBox>

          {/* Navigation */}
          <MDBox display="flex" alignItems="center" gap={2}>
            {isAuthenticated ? (
              <>
                {/* Utilisateur connecté */}
                <MDButton
                  variant="text"
                  color="info"
                  onClick={handleDashboard}
                >
                  {isAdmin ? 'Dashboard Admin' : 'Mon Espace'}
                </MDButton>
                <UserProfileMenu />
              </>
            ) : (
              <>
                {/* Utilisateur non connecté */}
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleLogin}
                >
                  Connexion
                </Button>
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={handleRegister}
                >
                  S'inscrire
                </MDButton>
              </>
            )}
          </MDBox>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default PublicNavbar;
