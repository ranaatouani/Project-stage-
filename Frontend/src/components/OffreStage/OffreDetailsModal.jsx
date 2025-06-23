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
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';

function OffreDetailsModal({ open, onClose, offre, onCandidater }) {
  if (!offre) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDuree = (semaines) => {
    if (!semaines) return 'Non défini';
    if (semaines === 1) return '1 semaine';
    return `${semaines} semaines`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      {/* En-tête */}
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <MDTypography variant="h4" fontWeight="bold" gutterBottom>
              {offre.titre}
            </MDTypography>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Chip
                label="Disponible"
                color="success"
                size="small"
                variant="outlined"
              />
              {offre.projetStage && (
                <Chip
                  label="Avec projet"
                  color="info"
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Contenu */}
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Informations principales */}
          <Grid item xs={12} md={6}>
            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                Informations générales
              </MDTypography>
              
              <Box display="flex" alignItems="center" mb={2}>
                <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  <strong>Entreprise:</strong> {offre.entreprise || 'Non spécifiée'}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  <strong>Localisation:</strong> {offre.localisation}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  <strong>Durée:</strong> {formatDuree(offre.dureeSemaines)}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  <strong>Publié le:</strong> {formatDate(offre.datePublication)}
                </Typography>
              </Box>
            </MDBox>
          </Grid>

          {/* Projet associé */}
          {offre.projetStage && (
            <Grid item xs={12} md={6}>
              <MDBox mb={3}>
                <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                  Projet associé
                </MDTypography>
                
                <Box display="flex" alignItems="center" mb={2}>
                  <AssignmentIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="body1">
                    <strong>Titre:</strong> {offre.projetStage.titre}
                  </Typography>
                </Box>

                {offre.projetStage.description && (
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {offre.projetStage.description}
                  </Typography>
                )}

                {offre.projetStage.technologies && (
                  <Box>
                    <Typography variant="body2" fontWeight="medium" gutterBottom>
                      Technologies:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {offre.projetStage.technologies}
                    </Typography>
                  </Box>
                )}
              </MDBox>
            </Grid>
          )}

          {/* Description complète */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <MDTypography variant="h6" fontWeight="medium" gutterBottom>
              Description du stage
            </MDTypography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
              {offre.description}
            </Typography>
          </Grid>

          {/* Compétences requises */}
          {offre.competencesRequises && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                Compétences requises
              </MDTypography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                {offre.competencesRequises}
              </Typography>
            </Grid>
          )}

          {/* Avantages */}
          {offre.avantages && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                Avantages
              </MDTypography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                {offre.avantages}
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3 }}>
        <MDButton
          variant="outlined"
          color="secondary"
          onClick={onClose}
        >
          Fermer
        </MDButton>
        <MDButton
          variant="gradient"
          color="success"
          onClick={() => onCandidater(offre)}
          startIcon={<WorkIcon />}
        >
          Candidater
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default OffreDetailsModal;
