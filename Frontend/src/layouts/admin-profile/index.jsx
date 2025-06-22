import React, { useState, useEffect } from 'react';
import { Card, Grid, TextField, Button, Alert, Avatar, Box } from '@mui/material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import authService from 'services/authService';

function AdminProfile() {
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: ''
  });
  const [originalInfo, setOriginalInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Charger les informations de l'utilisateur au montage du composant
  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    console.log('📥 Chargement des informations utilisateur...');
    try {
      const userData = await authService.getCurrentUser();
      console.log('✅ Données utilisateur chargées:', userData);
      setUserInfo(userData);
      setOriginalInfo(userData);
    } catch (error) {
      console.error('💥 Erreur chargement:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des informations' });
    }
  };

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    console.log('🔄 Début de la sauvegarde...');
    console.log('📝 Données complètes:', userInfo);

    // Préparer seulement les champs modifiables (sans l'id)
    const profileData = {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      username: userInfo.username
    };
    console.log('📝 Données à envoyer:', profileData);

    setLoading(true);
    try {
      const responseData = await authService.updateProfile(profileData);
      console.log('✅ Succès - Données reçues:', responseData);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès!' });
      setOriginalInfo(userInfo);
      setIsEditing(false);
    } catch (error) {
      console.error('💥 Erreur complète:', error);
      setMessage({ type: 'error', text: error.message || 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false);
      console.log('🏁 Fin de la sauvegarde');
    }
  };

  const handleCancel = () => {
    setUserInfo(originalInfo);
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const getInitials = () => {
    return `${userInfo.firstName?.charAt(0) || ''}${userInfo.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Mon Profil Administrateur
                </MDTypography>
              </MDBox>
              
              <MDBox pt={3} pb={2} px={3}>
                {message.text && (
                  <Alert 
                    severity={message.type} 
                    sx={{ mb: 2 }}
                    onClose={() => setMessage({ type: '', text: '' })}
                  >
                    {message.text}
                  </Alert>
                )}

                <Grid container spacing={3}>
                  {/* Avatar et informations de base */}
                  <Grid item xs={12} md={4}>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                      <Avatar
                        sx={{ 
                          width: 120, 
                          height: 120, 
                          fontSize: '2rem',
                          bgcolor: 'info.main',
                          mb: 2
                        }}
                      >
                        {getInitials()}
                      </Avatar>
                      <MDTypography variant="h5" fontWeight="medium">
                        {userInfo.firstName} {userInfo.lastName}
                      </MDTypography>
                      <MDTypography variant="body2" color="text" textAlign="center">
                        Administrateur
                      </MDTypography>
                    </Box>
                  </Grid>

                  {/* Formulaire d'édition */}
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Prénom"
                          value={userInfo.firstName || ''}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          disabled={!isEditing}
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Nom"
                          value={userInfo.lastName || ''}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          disabled={!isEditing}
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={userInfo.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          variant="outlined"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Nom d'utilisateur"
                          value={userInfo.username || ''}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          disabled={!isEditing}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>

                    {/* Boutons d'action */}
                    <Box mt={4} display="flex" gap={2}>
                      {!isEditing ? (
                        <MDButton
                          variant="gradient"
                          color="info"
                          onClick={() => setIsEditing(true)}
                        >
                          Modifier le profil
                        </MDButton>
                      ) : (
                        <>
                          <MDButton
                            variant="gradient"
                            color="success"
                            onClick={handleSave}
                            disabled={loading}
                          >
                            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                          </MDButton>
                          <MDButton
                            variant="outlined"
                            color="secondary"
                            onClick={handleCancel}
                            disabled={loading}
                          >
                            Annuler
                          </MDButton>
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default AdminProfile;
