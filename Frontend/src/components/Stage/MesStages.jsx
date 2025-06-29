import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import {
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pause as PauseIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Services
import { stageService } from 'services/stageService';

function MesStages() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStages();
  }, []);

  const loadStages = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Chargement des stages...');
      const data = await stageService.getMesStages();
      console.log('Stages reçus:', data);
      setStages(data);
    } catch (err) {
      console.error('Erreur détaillée:', err);
      console.error('Response:', err.response);
      setError(`Erreur lors du chargement de vos stages: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'EN_COURS': return 'info';
      case 'TERMINE': return 'success';
      case 'ANNULE': return 'error';
      case 'SUSPENDU': return 'warning';
      default: return 'default';
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'EN_COURS': return <WorkIcon />;
      case 'TERMINE': return <CheckCircleIcon />;
      case 'ANNULE': return <CancelIcon />;
      case 'SUSPENDU': return <PauseIcon />;
      default: return <WorkIcon />;
    }
  };

  const getStatutLabel = (statut) => {
    switch (statut) {
      case 'EN_COURS': return 'En cours';
      case 'TERMINE': return 'Terminé';
      case 'ANNULE': return 'Annulé';
      case 'SUSPENDU': return 'Suspendu';
      default: return statut;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateProgress = (dateDebut, dateFin) => {
    if (!dateDebut || !dateFin) return 0;
    
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const maintenant = new Date();
    
    if (maintenant < debut) return 0;
    if (maintenant > fin) return 100;
    
    const totalDuration = fin - debut;
    const elapsed = maintenant - debut;
    
    return Math.round((elapsed / totalDuration) * 100);
  };

  const getDaysRemaining = (dateFin) => {
    if (!dateFin) return null;
    
    const fin = new Date(dateFin);
    const maintenant = new Date();
    const diffTime = fin - maintenant;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  if (loading) {
    return (
      <MDBox display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </MDBox>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (stages.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <WorkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <MDTypography variant="h5" color="text.secondary" gutterBottom>
          Aucun stage en cours
        </MDTypography>
        <MDTypography variant="body2" color="text.secondary">
          Vous n'avez pas encore de stage assigné. Continuez à postuler aux offres !
        </MDTypography>
      </Paper>
    );
  }

  return (
    <MDBox>
      <MDBox mb={3}>
        <MDTypography variant="h5" fontWeight="bold" gutterBottom>
          Mes Stages
        </MDTypography>
        <MDTypography variant="body2" color="text">
          Suivez l'avancement de vos stages
        </MDTypography>
      </MDBox>

      <Grid container spacing={3}>
        {stages.map((stage) => {
          const progress = calculateProgress(stage.dateDebut, stage.dateFin);
          const daysRemaining = getDaysRemaining(stage.dateFin);
          
          return (
            <Grid item xs={12} md={6} lg={4} key={stage.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  border: stage.statut === 'EN_COURS' ? '2px solid' : '1px solid',
                  borderColor: stage.statut === 'EN_COURS' ? 'info.main' : 'divider'
                }}
              >
                <CardContent>
                  {/* En-tête avec statut */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Chip
                      icon={getStatutIcon(stage.statut)}
                      label={getStatutLabel(stage.statut)}
                      color={getStatutColor(stage.statut)}
                      size="small"
                    />
                    {stage.statut === 'EN_COURS' && daysRemaining !== null && (
                      <Typography variant="caption" color="text.secondary">
                        {daysRemaining > 0 ? `${daysRemaining} jours restants` : 'Terminé'}
                      </Typography>
                    )}
                  </Box>

                  {/* Titre du stage */}
                  <MDTypography variant="h6" fontWeight="bold" gutterBottom>
                    {stage.offreStage.titre}
                  </MDTypography>

                  {/* Entreprise */}
                  <Box display="flex" alignItems="center" mb={2}>
                    <BusinessIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2">
                      {stage.offreStage.entreprise}
                    </Typography>
                  </Box>

                  {/* Localisation */}
                  {stage.offreStage.localisation && (
                    <Box display="flex" alignItems="center" mb={2}>
                      <LocationIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2">
                        {stage.offreStage.localisation}
                      </Typography>
                    </Box>
                  )}

                  {/* Dates */}
                  <Box display="flex" alignItems="center" mb={2}>
                    <CalendarIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2">
                        Du {formatDate(stage.dateDebut)}
                      </Typography>
                      <Typography variant="body2">
                        Au {formatDate(stage.dateFin)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Durée */}
                  <Box display="flex" alignItems="center" mb={3}>
                    <ScheduleIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2">
                      {stage.offreStage.dureeSemaines} semaines
                    </Typography>
                  </Box>

                  {/* Barre de progression pour les stages en cours */}
                  {stage.statut === 'EN_COURS' && (
                    <Box mb={2}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="caption" color="text.secondary">
                          Progression
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {progress}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  )}

                  {/* Description */}
                  {stage.offreStage.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {stage.offreStage.description}
                    </Typography>
                  )}

                  {/* Commentaires admin */}
                  {stage.commentaires && (
                    <Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">
                        Note de l'administration :
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {stage.commentaires}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </MDBox>
  );
}

export default MesStages;
