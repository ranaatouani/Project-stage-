import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Button,
  Divider
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Work,
  LocationOn,
  Business,
  CalendarToday,
  Refresh
} from '@mui/icons-material';

import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

import { candidatureService } from '../../services/candidatureService';

function MesCandidatures() {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCandidatures();
  }, []);

  const loadCandidatures = async () => {
    try {
      setLoading(true);
      const data = await candidatureService.getMesCandidatures();
      setCandidatures(data);
      setError('');
    } catch (error) {
      console.error('Erreur lors du chargement des candidatures:', error);
      setError('Erreur lors du chargement de vos candidatures');
    } finally {
      setLoading(false);
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'ACCEPTEE':
        return <CheckCircle color="success" />;
      case 'REFUSEE':
        return <Cancel color="error" />;
      case 'EN_ATTENTE':
        return <HourglassEmpty color="warning" />;
      default:
        return <HourglassEmpty color="info" />;
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'ACCEPTEE':
        return 'success';
      case 'REFUSEE':
        return 'error';
      case 'EN_ATTENTE':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getStatutText = (statut) => {
    switch (statut) {
      case 'ACCEPTEE':
        return 'Acceptée';
      case 'REFUSEE':
        return 'Refusée';
      case 'EN_ATTENTE':
        return 'En attente';
      default:
        return 'En cours';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MDBox>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <MDTypography variant="h5" fontWeight="bold">
          Mes Candidatures ({candidatures.length})
        </MDTypography>
        <MDButton
          variant="outlined"
          color="info"
          size="small"
          onClick={loadCandidatures}
          startIcon={<Refresh />}
        >
          Actualiser
        </MDButton>
      </MDBox>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {candidatures.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <Work sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Aucune candidature pour le moment
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Explorez les offres de stage disponibles et postulez !
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {candidatures.map((candidature) => (
            <Grid item xs={12} md={6} lg={4} key={candidature.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Statut */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Chip
                      icon={getStatutIcon(candidature.statut)}
                      label={getStatutText(candidature.statut)}
                      color={getStatutColor(candidature.statut)}
                      size="small"
                    />
                    <Typography variant="caption" color="textSecondary">
                      {formatDate(candidature.dateCandidature)}
                    </Typography>
                  </Box>

                  {/* Titre de l'offre */}
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {candidature.offreStage.titre}
                  </Typography>

                  {/* Informations de l'offre */}
                  <Box mb={2}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Business sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="textSecondary">
                        {candidature.offreStage.entreprise}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center" mb={1}>
                      <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="textSecondary">
                        {candidature.offreStage.localisation}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center">
                      <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="textSecondary">
                        {candidature.offreStage.dureeSemaines} semaines
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Description courte */}
                  <Typography variant="body2" color="textSecondary" sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {candidature.offreStage.description}
                  </Typography>

                  {/* Message selon le statut */}
                  {candidature.statut === 'ACCEPTEE' && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        🎉 Félicitations ! Votre candidature a été acceptée.
                      </Typography>
                    </Alert>
                  )}

                  {candidature.statut === 'REFUSEE' && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Votre candidature n'a pas été retenue cette fois-ci. Continuez à postuler !
                      </Typography>
                    </Alert>
                  )}

                  {candidature.statut === 'EN_ATTENTE' && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Votre candidature est en cours d'examen. Vous recevrez une notification dès qu'il y aura du nouveau.
                      </Typography>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </MDBox>
  );
}

export default MesCandidatures;
