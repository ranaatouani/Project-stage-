import React, { useState, useEffect } from 'react';
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
  Alert
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
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';

// Composants pour les entretiens
// import ProgrammerEntretienModal from 'components/Entretien/ProgrammerEntretienModal';

// Services
// import { entretienService } from 'services/entretienService';

function CandidatureDetailsModal({ open, onClose, candidature, onChangeStatut }) {
  const [loading, setLoading] = useState(false);

  if (!candidature) return null;

  const handleProgrammerEntretien = async () => {
    if (onChangeStatut) {
      try {
        setLoading(true);
        await onChangeStatut('ENTRETIEN');
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // const handleSaveEntretien = async (entretienData) => {
  //   setLoading(true);
  //   setError('');
  //   try {
  //     await entretienService.programmerEntretien(entretienData);
  //     await loadEntretien();
  //     setEntretienModalOpen(false);
  //     if (onChangeStatut) {
  //       await onChangeStatut('ENTRETIEN');
  //     }
  //   } catch (error) {
  //     console.error('Erreur lors de la programmation de l\'entretien:', error);
  //     setError(error.response?.data?.error || error.message || 'Erreur lors de la programmation de l\'entretien');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  const handleDownloadCV = async () => {
    if (!candidature.cvPath && !candidature.cvFilename) {
      alert('Aucun CV disponible pour cette candidature');
      return;
    }

    try {
      console.log('Tentative de téléchargement du CV pour candidature ID:', candidature.id);
      console.log('Nom du fichier:', candidature.cvFilename);
      console.log('Chemin du fichier:', candidature.cvPath);

      const token = localStorage.getItem('accessToken');
      console.log('Token présent:', !!token);

      const response = await fetch(`http://localhost:8090/api/candidatures/${candidature.id}/cv`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/octet-stream'
        }
      });

      console.log('Statut de la réponse:', response.status);
      console.log('Headers de la réponse:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur du serveur:', errorText);

        if (response.status === 404) {
          alert('CV non trouvé sur le serveur. Le fichier a peut-être été supprimé.');
        } else if (response.status === 401) {
          alert('Accès non autorisé. Veuillez vous reconnecter.');
        } else if (response.status === 403) {
          alert('Accès interdit. Vous n\'avez pas les permissions nécessaires.');
        } else {
          alert(`Erreur lors du téléchargement du CV (${response.status}): ${errorText}`);
        }
        return;
      }

      // Récupérer le blob
      const blob = await response.blob();
      console.log('Taille du blob:', blob.size, 'bytes');
      console.log('Type du blob:', blob.type);

      if (blob.size === 0) {
        alert('Le fichier CV est vide');
        return;
      }

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = candidature.cvFilename || `CV_${candidature.nom}_${candidature.prenom}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Nettoyer l'URL
      window.URL.revokeObjectURL(url);

      console.log('Téléchargement réussi');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert(`Erreur lors du téléchargement du CV: ${error.message}`);
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

          {/* Informations d'entretien */}
          {candidature.statut === 'ENTRETIEN' && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                📅 Entretien programmé
              </MDTypography>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  bgcolor: 'success.light',
                  borderColor: 'success.main',
                  borderWidth: 2
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <CalendarIcon sx={{ mr: 1, color: 'success.main', fontSize: 24 }} />
                  <Typography variant="h6" color="success.main" fontWeight="bold">
                    Entretien programmé
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  ✅ Un entretien a été programmé pour cette candidature.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Le candidat a reçu une notification avec les détails de l'entretien.
                </Typography>
              </Paper>
            </Grid>
          )}

          {/* CV */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <MDTypography variant="h6" fontWeight="medium" gutterBottom>
              Curriculum Vitae
            </MDTypography>
            {candidature.cvFilename ? (
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
                  <Box>
                    <Typography variant="body1">
                      {candidature.cvFilename}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Fichier disponible
                    </Typography>
                  </Box>
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
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  textAlign: 'center',
                  bgcolor: 'grey.50'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Aucun CV n'a été téléchargé avec cette candidature
                </Typography>
              </Paper>
            )}
          </Grid>

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
              onClick={handleProgrammerEntretien}
              disabled={loading}
            >
              {loading ? 'Programmation...' : 'Programmer entretien'}
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

      {/* Modal de programmation d'entretien - Temporairement désactivé */}
      {/* <ProgrammerEntretienModal
        open={entretienModalOpen}
        onClose={() => setEntretienModalOpen(false)}
        candidature={candidature}
        onSave={handleSaveEntretien}
      /> */}
    </Dialog>
  );
}

export default CandidatureDetailsModal;
