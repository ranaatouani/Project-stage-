import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pause as PauseIcon
} from '@mui/icons-material';

import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';

function StageDetailsModal({ open, onClose, stage }) {
  if (!stage) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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

  const calculateProgress = () => {
    if (!stage.dateDebut || !stage.dateFin) return 0;
    
    const debut = new Date(stage.dateDebut);
    const fin = new Date(stage.dateFin);
    const maintenant = new Date();
    
    if (maintenant < debut) return 0;
    if (maintenant > fin) return 100;
    
    const totalDuration = fin - debut;
    const elapsed = maintenant - debut;
    
    return Math.round((elapsed / totalDuration) * 100);
  };

  const getDaysRemaining = () => {
    if (!stage.dateFin) return null;
    
    const fin = new Date(stage.dateFin);
    const maintenant = new Date();
    const diffTime = fin - maintenant;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const progress = calculateProgress();
  const daysRemaining = getDaysRemaining();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold">
              Détails du stage
            </MDTypography>
            <Chip 
              icon={getStatutIcon(stage.statut)}
              label={getStatutLabel(stage.statut)} 
              color={getStatutColor(stage.statut)}
              sx={{ mt: 1 }}
            />
          </MDBox>
          <IconButton onClick={onClose} size="large">
            <CloseIcon />
          </IconButton>
        </MDBox>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Informations du stagiaire */}
          <Grid item xs={12} md={6}>
            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                Informations du stagiaire
              </MDTypography>
              
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {stage.stagiaire.lastName} {stage.stagiaire.firstName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stagiaire
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <EmailIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="body1">
                  <strong>Email:</strong> {stage.stagiaire.email}
                </Typography>
              </Box>

              {stage.stagiaire.telephone && (
                <Box display="flex" alignItems="center" mb={2}>
                  <PhoneIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="body1">
                    <strong>Téléphone:</strong> {stage.stagiaire.telephone}
                  </Typography>
                </Box>
              )}
            </MDBox>
          </Grid>

          {/* Informations du stage */}
          <Grid item xs={12} md={6}>
            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                Détails du stage
              </MDTypography>

              <Box display="flex" alignItems="center" mb={2}>
                <WorkIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="body1">
                  <strong>Poste:</strong> {stage.offreStage.titre}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <BusinessIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="body1">
                  <strong>Entreprise:</strong> {stage.offreStage.entreprise}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <LocationIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="body1">
                  <strong>Localisation:</strong> {stage.offreStage.localisation}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <ScheduleIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="body1">
                  <strong>Durée:</strong> {stage.offreStage.dureeSemaines} semaines
                </Typography>
              </Box>
            </MDBox>
          </Grid>

          {/* Dates et progression */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <MDTypography variant="h6" fontWeight="medium" gutterBottom>
              Calendrier et progression
            </MDTypography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <CalendarIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Box>
                    <Typography variant="body1">
                      <strong>Début:</strong> {formatDate(stage.dateDebut)}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Fin:</strong> {formatDate(stage.dateFin)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {stage.statut === 'EN_COURS' && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        Progression
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {progress}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={progress} 
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    {daysRemaining !== null && (
                      <Typography variant="caption" color="text.secondary">
                        {daysRemaining > 0 ? `${daysRemaining} jours restants` : 'Stage terminé'}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* Description du stage */}
          {stage.offreStage.description && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                Description du stage
              </MDTypography>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  bgcolor: 'grey.50'
                }}
              >
                <Typography variant="body1" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {stage.offreStage.description}
                </Typography>
              </Paper>
            </Grid>
          )}

          {/* Commentaires admin */}
          {stage.commentaires && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                Commentaires administratifs
              </MDTypography>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  bgcolor: 'warning.light',
                  borderColor: 'warning.main'
                }}
              >
                <Typography variant="body1" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {stage.commentaires}
                </Typography>
              </Paper>
            </Grid>
          )}

          {/* Informations de candidature */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <MDTypography variant="h6" fontWeight="medium" gutterBottom>
              Informations de candidature
            </MDTypography>
            <Typography variant="body2" color="text.secondary">
              <strong>Date de candidature:</strong> {formatDate(stage.candidature?.dateCandidature)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Date de création du stage:</strong> {formatDate(stage.dateCreation)}
            </Typography>
            {stage.dateModification && (
              <Typography variant="body2" color="text.secondary">
                <strong>Dernière modification:</strong> {formatDate(stage.dateModification)}
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <MDButton
          variant="outlined"
          color="secondary"
          onClick={onClose}
        >
          Fermer
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default StageDetailsModal;
