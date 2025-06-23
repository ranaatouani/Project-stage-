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
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  GetApp as DownloadIcon,
  Description as FileIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';

function CandidatureDetailsModal({ open, onClose, candidature, onChangeStatut }) {
  if (!candidature) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'EN_ATTENTE': return 'warning';
      case 'ACCEPTEE': return 'success';
      case 'REFUSEE': return 'error';
      case 'ENTRETIEN': return 'info';
      case 'ANNULEE': return 'default';
      default: return 'default';
    }
  };

  const getStatutLabel = (statut) => {
    switch (statut) {
      case 'EN_ATTENTE': return 'En attente';
      case 'ACCEPTEE': return 'Acceptée';
      case 'REFUSEE': return 'Refusée';
      case 'ENTRETIEN': return 'Entretien programmé';
      case 'ANNULEE': return 'Annulée';
      default: return statut;
    }
  };

  const handleDownloadCV = () => {
    if (candidature.cvPath) {
      // Créer un lien de téléchargement
      const link = document.createElement('a');
      link.href = `http://localhost:8090/api/candidatures/${candidature.id}/cv`;
      link.download = candidature.cvFilename || 'CV.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getInitials = (nom, prenom) => {
    return `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase();
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
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 56,
                height: 56,
                fontSize: '1.5rem'
              }}
            >
              {getInitials(candidature.nom, candidature.prenom)}
            </Avatar>
            <Box>
              <MDTypography variant="h4" fontWeight="bold" gutterBottom>
                {candidature.prenom} {candidature.nom}
              </MDTypography>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label={getStatutLabel(candidature.statut)}
                  color={getStatutColor(candidature.statut)}
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  Candidature du {formatDate(candidature.dateCandidature)}
                </Typography>
              </Box>
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
          {/* Informations personnelles */}
          <Grid item xs={12} md={6}>
            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                Informations personnelles
              </MDTypography>
              
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  <strong>Nom complet:</strong> {candidature.prenom} {candidature.nom}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  <strong>Email:</strong> {candidature.email}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  <strong>Téléphone:</strong> {candidature.telephone}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  <strong>Date de candidature:</strong> {formatDate(candidature.dateCandidature)}
                </Typography>
              </Box>
            </MDBox>
          </Grid>

          {/* Informations sur l'offre */}
          <Grid item xs={12} md={6}>
            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                Offre de stage
              </MDTypography>
              
              <Box display="flex" alignItems="center" mb={2}>
                <WorkIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="body1">
                  <strong>Titre:</strong> {candidature.offreStage?.titre}
                </Typography>
              </Box>

              {candidature.offreStage?.entreprise && (
                <Box display="flex" alignItems="center" mb={2}>
                  <BusinessIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="body1">
                    <strong>Entreprise:</strong> {candidature.offreStage.entreprise}
                  </Typography>
                </Box>
              )}

              {candidature.offreStage?.localisation && (
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="body1">
                    <strong>Localisation:</strong> {candidature.offreStage.localisation}
                  </Typography>
                </Box>
              )}
            </MDBox>
          </Grid>

          {/* CV */}
          {candidature.cvFilename && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                Curriculum Vitae
              </MDTypography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  bgcolor: 'grey.50'
                }}
              >
                <Box display="flex" alignItems="center">
                  <FileIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body1">
                    {candidature.cvFilename}
                  </Typography>
                </Box>
                <MDButton
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadCV}
                >
                  Télécharger
                </MDButton>
              </Paper>
            </Grid>
          )}

          {/* Lettre de motivation */}
          {candidature.motivation && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                Lettre de motivation
              </MDTypography>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  bgcolor: 'grey.50',
                  maxHeight: 300,
                  overflow: 'auto'
                }}
              >
                <Typography variant="body1" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {candidature.motivation}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <MDButton
          variant="outlined"
          color="secondary"
          onClick={onClose}
        >
          Fermer
        </MDButton>
        
        {candidature.statut === 'EN_ATTENTE' && (
          <>
            <MDButton
              variant="gradient"
              color="success"
              onClick={() => onChangeStatut('ACCEPTEE')}
            >
              Accepter
            </MDButton>
            <MDButton
              variant="gradient"
              color="error"
              onClick={() => onChangeStatut('REFUSEE')}
            >
              Refuser
            </MDButton>
            <MDButton
              variant="gradient"
              color="info"
              onClick={() => onChangeStatut('ENTRETIEN')}
            >
              Programmer entretien
            </MDButton>
          </>
        )}
        
        {candidature.statut !== 'EN_ATTENTE' && (
          <MDButton
            variant="gradient"
            color="warning"
            onClick={() => onChangeStatut('EN_ATTENTE')}
          >
            Remettre en attente
          </MDButton>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default CandidatureDetailsModal;
