import React, { useState } from 'react';
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

function CandidatureDetailsModalFinal({ open, onClose, candidature, onChangeStatut }) {
  const [loading, setLoading] = useState(false);
  const [showProgrammationForm, setShowProgrammationForm] = useState(false);
  const [entretienData, setEntretienData] = useState({
    dateEntretien: '',
    lieu: '',
    typeEntretien: 'PRESENTIEL',
    lienVisio: '',
    commentaires: ''
  });
  const [error, setError] = useState('');

  if (!candidature) return null;

  // Initialiser la date avec demain à 10h00
  React.useEffect(() => {
    if (showProgrammationForm && !entretienData.dateEntretien) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      const isoString = tomorrow.toISOString().slice(0, 16);
      setEntretienData(prev => ({ ...prev, dateEntretien: isoString }));
    }
  }, [showProgrammationForm]);

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
    setShowProgrammationForm(true);
  };

  const handleSaveProgrammation = async () => {
    if (!entretienData.dateEntretien) {
      setError('La date et l\'heure sont obligatoires');
      return;
    }

    if (!entretienData.lieu.trim()) {
      setError('Le lieu est obligatoire');
      return;
    }

    if (entretienData.typeEntretien === 'VISIOCONFERENCE' && !entretienData.lienVisio.trim()) {
      setError('Le lien de visioconférence est obligatoire pour ce type d\'entretien');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Simuler la programmation d'entretien
      console.log('Programmation entretien:', entretienData);
      
      // Changer le statut
      if (onChangeStatut) {
        await onChangeStatut('ENTRETIEN');
      }
      
      // Fermer le formulaire
      setShowProgrammationForm(false);
      
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la programmation de l\'entretien');
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

  const handleInputChange = (field, value) => {
    setEntretienData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold">
              {showProgrammationForm ? 'Programmer un entretien' : 'Détails de la candidature'}
            </MDTypography>
            {!showProgrammationForm && (
              <Chip 
                label={getStatutLabel(candidature.statut)} 
                color={getStatutColor(candidature.statut)}
                sx={{ mt: 1 }}
              />
            )}
          </MDBox>
          <IconButton onClick={onClose} size="large">
            <CloseIcon />
          </IconButton>
        </MDBox>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!showProgrammationForm ? (
          // Affichage des détails de candidature
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

            {/* CV et autres sections... */}
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
              </Grid>
            )}
          </Grid>
        ) : (
          // Formulaire de programmation d'entretien
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Programmation d'un entretien pour <strong>{candidature.nom} {candidature.prenom}</strong> 
                pour l'offre "<strong>{candidature.offreStage?.titre}</strong>"
              </Typography>
            </Grid>

            {/* Date et heure */}
            <Grid item xs={12} md={6}>
              <input
                type="datetime-local"
                value={entretienData.dateEntretien}
                onChange={(e) => handleInputChange('dateEntretien', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Date et heure de l'entretien
              </Typography>
            </Grid>

            {/* Type d'entretien */}
            <Grid item xs={12} md={6}>
              <select
                value={entretienData.typeEntretien}
                onChange={(e) => handleInputChange('typeEntretien', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              >
                <option value="PRESENTIEL">Présentiel</option>
                <option value="VISIOCONFERENCE">Visioconférence</option>
                <option value="TELEPHONIQUE">Téléphonique</option>
              </select>
              <Typography variant="caption" color="text.secondary">
                Type d'entretien
              </Typography>
            </Grid>

            {/* Lieu */}
            <Grid item xs={12}>
              <input
                type="text"
                value={entretienData.lieu}
                onChange={(e) => handleInputChange('lieu', e.target.value)}
                placeholder="Lieu de l'entretien"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Lieu de l'entretien (obligatoire)
              </Typography>
            </Grid>

            {/* Lien visio */}
            {entretienData.typeEntretien === 'VISIOCONFERENCE' && (
              <Grid item xs={12}>
                <input
                  type="url"
                  value={entretienData.lienVisio}
                  onChange={(e) => handleInputChange('lienVisio', e.target.value)}
                  placeholder="Lien de visioconférence"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  Lien de visioconférence (obligatoire)
                </Typography>
              </Grid>
            )}

            {/* Commentaires */}
            <Grid item xs={12}>
              <textarea
                value={entretienData.commentaires}
                onChange={(e) => handleInputChange('commentaires', e.target.value)}
                placeholder="Commentaires ou instructions particulières"
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px',
                  resize: 'vertical'
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Commentaires (optionnel)
              </Typography>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, gap: 1 }}>
        {!showProgrammationForm ? (
          <>
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
          </>
        ) : (
          <>
            <MDButton
              variant="outlined"
              color="secondary"
              onClick={() => setShowProgrammationForm(false)}
              disabled={loading}
            >
              Annuler
            </MDButton>
            <MDButton
              variant="gradient"
              color="info"
              onClick={handleSaveProgrammation}
              disabled={loading}
            >
              {loading ? 'Programmation...' : 'Programmer l\'entretien'}
            </MDButton>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default CandidatureDetailsModalFinal;
