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
  LocationOn as LocationIcon
} from '@mui/icons-material';

import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';

// Composants pour les entretiens
import ProgrammerEntretienModal from 'components/Entretien/ProgrammerEntretienModal';

// Services
import { entretienService } from 'services/entretienService';

function CandidatureDetailsModalSimple({ open, onClose, candidature, onChangeStatut }) {
  const [loading, setLoading] = useState(false);
  const [entretienModalOpen, setEntretienModalOpen] = useState(false);
  const [entretienExistant, setEntretienExistant] = useState(null);
  const [error, setError] = useState('');

  if (!candidature) return null;

  // Charger l'entretien existant si la candidature a le statut ENTRETIEN
  useEffect(() => {
    if (candidature && candidature.statut === 'ENTRETIEN' && candidature.id) {
      loadEntretien();
    }
  }, [candidature?.id, candidature?.statut]);

  const loadEntretien = async () => {
    try {
      const entretien = await entretienService.getEntretienByCandidature(candidature.id);
      setEntretienExistant(entretien);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'entretien:', error);
      setEntretienExistant(null);
    }
  };

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
      default: return 'default';
    }
  };

  const getStatutLabel = (statut) => {
    switch (statut) {
      case 'EN_ATTENTE': return 'En attente';
      case 'ACCEPTEE': return 'Acceptée';
      case 'REFUSEE': return 'Refusée';
      case 'ENTRETIEN': return 'Entretien';
      default: return statut;
    }
  };

  const handleProgrammerEntretien = () => {
    setEntretienModalOpen(true);
  };

  const handleSaveEntretien = async (entretienData) => {
    setLoading(true);
    setError('');
    try {
      await entretienService.programmerEntretien(entretienData);
      // Recharger l'entretien et fermer le modal
      await loadEntretien();
      setEntretienModalOpen(false);
      // Mettre à jour le statut de la candidature
      if (onChangeStatut) {
        await onChangeStatut('ENTRETIEN');
      }
    } catch (error) {
      console.error('Erreur lors de la programmation de l\'entretien:', error);
      setError(error.response?.data?.error || error.message || 'Erreur lors de la programmation de l\'entretien');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCV = () => {
    if (candidature.cvFilename) {
      const link = document.createElement('a');
      link.href = `http://localhost:8090/api/candidatures/${candidature.id}/cv`;
      link.download = candidature.cvFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold">
              Détails de la candidature
            </MDTypography>
            <Chip 
              label={getStatutLabel(candidature.statut)} 
              color={getStatutColor(candidature.statut)}
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
          {/* Informations du candidat */}
          <Grid item xs={12} md={6}>
            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                Informations du candidat
              </MDTypography>
              
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {candidature.nom} {candidature.prenom}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Candidat
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <EmailIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="body1">
                  <strong>Email:</strong> {candidature.email}
                </Typography>
              </Box>

              {candidature.telephone && (
                <Box display="flex" alignItems="center" mb={2}>
                  <PhoneIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="body1">
                    <strong>Téléphone:</strong> {candidature.telephone}
                  </Typography>
                </Box>
              )}

              <Box display="flex" alignItems="center" mb={2}>
                <CalendarIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="body1">
                  <strong>Date de candidature:</strong> {formatDate(candidature.dateCandidature)}
                </Typography>
              </Box>
            </MDBox>
          </Grid>

          {/* Informations de l'offre */}
          <Grid item xs={12} md={6}>
            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                Offre de stage
              </MDTypography>

              {candidature.offreStage?.titre && (
                <Box display="flex" alignItems="center" mb={2}>
                  <WorkIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="body1">
                    <strong>Titre:</strong> {candidature.offreStage.titre}
                  </Typography>
                </Box>
              )}

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
              {entretienExistant ? (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    bgcolor: 'info.light',
                    borderColor: 'info.main',
                    borderWidth: 2
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <CalendarIcon sx={{ mr: 1, color: 'info.main' }} />
                        <Typography variant="body2">
                          <strong>Date:</strong> {formatDate(entretienExistant.dateEntretien)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <WorkIcon sx={{ mr: 1, color: 'info.main' }} />
                        <Typography variant="body2">
                          <strong>Type:</strong> {entretienExistant.typeEntretien?.replace('_', ' ')}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <LocationIcon sx={{ mr: 1, color: 'info.main' }} />
                        <Typography variant="body2">
                          <strong>Lieu:</strong> {entretienExistant.lieu}
                        </Typography>
                      </Box>
                    </Grid>
                    {entretienExistant.lienVisio && (
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Lien:</strong>
                          <a href={entretienExistant.lienVisio} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8 }}>
                            {entretienExistant.lienVisio}
                          </a>
                        </Typography>
                      </Grid>
                    )}
                    {entretienExistant.commentaires && (
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Commentaires:</strong> {entretienExistant.commentaires}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              ) : (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    bgcolor: 'warning.light',
                    borderColor: 'warning.main',
                    borderWidth: 2
                  }}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <CalendarIcon sx={{ mr: 1, color: 'warning.main', fontSize: 24 }} />
                    <Typography variant="h6" color="warning.main" fontWeight="bold">
                      Entretien en cours de programmation
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    ⏳ Les détails de l'entretien sont en cours de programmation.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cliquez sur "Programmer entretien" pour définir la date, l'heure et le lieu.
                  </Typography>
                </Paper>
              )}
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
                  onClick={handleDownloadCV}
                  startIcon={<DownloadIcon />}
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
        {error && (
          <Alert severity="error" sx={{ mr: 'auto' }}>
            {error}
          </Alert>
        )}

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

        {candidature.statut === 'ENTRETIEN' && !entretienExistant && (
          <MDButton
            variant="gradient"
            color="info"
            onClick={handleProgrammerEntretien}
            disabled={loading}
          >
            {loading ? 'Programmation...' : 'Programmer entretien'}
          </MDButton>
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

      {/* Modal de programmation d'entretien */}
      <ProgrammerEntretienModal
        open={entretienModalOpen}
        onClose={() => setEntretienModalOpen(false)}
        candidature={candidature}
        onSave={handleSaveEntretien}
      />
    </Dialog>
  );
}

export default CandidatureDetailsModalSimple;
