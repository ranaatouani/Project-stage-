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
  CircularProgress
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  VideoCall as VideoIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Services
import { entretienService } from 'services/entretienService';

function CalendrierEntretiens() {
  const [entretiens, setEntretiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEntretiens();
  }, []);

  const loadEntretiens = async () => {
    try {
      setLoading(true);
      const data = await entretienService.getMesEntretiensAVenir();
      setEntretiens(data);
    } catch (err) {
      setError('Erreur lors du chargement des entretiens');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'VISIOCONFERENCE':
        return <VideoIcon />;
      case 'TELEPHONIQUE':
        return <PhoneIcon />;
      default:
        return <BusinessIcon />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'VISIOCONFERENCE':
        return 'info';
      case 'TELEPHONIQUE':
        return 'warning';
      default:
        return 'success';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'VISIOCONFERENCE':
        return 'Visioconférence';
      case 'TELEPHONIQUE':
        return 'Téléphonique';
      default:
        return 'Présentiel';
    }
  };

  const isToday = (dateString) => {
    const today = new Date();
    const entretienDate = new Date(dateString);
    return today.toDateString() === entretienDate.toDateString();
  };

  const isTomorrow = (dateString) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const entretienDate = new Date(dateString);
    return tomorrow.toDateString() === entretienDate.toDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <MDBox display="flex" alignItems="center" mb={3}>
          <CalendarIcon sx={{ mr: 1, color: 'info.main' }} />
          <MDTypography variant="h5" fontWeight="bold">
            Mes entretiens programmés
          </MDTypography>
        </MDBox>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {entretiens.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: 'grey.50'
            }}
          >
            <CalendarIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucun entretien programmé
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vos futurs entretiens apparaîtront ici
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {entretiens.map((entretien) => (
              <Grid item xs={12} key={entretien.id}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderLeft: 4,
                    borderLeftColor: isToday(entretien.dateEntretien) 
                      ? 'error.main' 
                      : isTomorrow(entretien.dateEntretien) 
                      ? 'warning.main' 
                      : 'info.main',
                    bgcolor: isToday(entretien.dateEntretien) 
                      ? 'error.light' 
                      : isTomorrow(entretien.dateEntretien) 
                      ? 'warning.light' 
                      : 'background.paper'
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    {/* Date et heure */}
                    <Grid item xs={12} md={4}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1" fontWeight="bold">
                          {formatDate(entretien.dateEntretien)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1">
                          {formatTime(entretien.dateEntretien)}
                        </Typography>
                        {isToday(entretien.dateEntretien) && (
                          <Chip 
                            label="Aujourd'hui" 
                            color="error" 
                            size="small" 
                            sx={{ ml: 1 }} 
                          />
                        )}
                        {isTomorrow(entretien.dateEntretien) && (
                          <Chip 
                            label="Demain" 
                            color="warning" 
                            size="small" 
                            sx={{ ml: 1 }} 
                          />
                        )}
                      </Box>
                    </Grid>

                    {/* Offre */}
                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" gutterBottom>
                        {entretien.candidature?.offreStage?.titre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {entretien.candidature?.offreStage?.entreprise}
                      </Typography>
                    </Grid>

                    {/* Type et lieu */}
                    <Grid item xs={12} md={4}>
                      <Box display="flex" alignItems="center" mb={1}>
                        {getTypeIcon(entretien.typeEntretien)}
                        <Chip
                          label={getTypeLabel(entretien.typeEntretien)}
                          color={getTypeColor(entretien.typeEntretien)}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      <Box display="flex" alignItems="center">
                        <LocationIcon sx={{ mr: 1, color: 'info.main' }} />
                        <Typography variant="body2">
                          {entretien.lieu}
                        </Typography>
                      </Box>
                      {entretien.lienVisio && (
                        <Box mt={1}>
                          <Typography variant="body2">
                            <strong>Lien:</strong>{' '}
                            <a 
                              href={entretien.lienVisio} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ color: 'inherit' }}
                            >
                              Rejoindre la réunion
                            </a>
                          </Typography>
                        </Box>
                      )}
                    </Grid>

                    {/* Commentaires */}
                    {entretien.commentaires && (
                      <Grid item xs={12}>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2,
                            bgcolor: 'grey.50',
                            mt: 1
                          }}
                        >
                          <Typography variant="body2">
                            <strong>Instructions:</strong> {entretien.commentaires}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}

export default CalendrierEntretiens;
