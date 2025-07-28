import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  Paper,
  Grid
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Description as FileIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';

// Services
import authService from 'services/authService';

function CandidatureModal({ open, onClose, offre, onSubmit }) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    motivation: ''
  });
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userInfoLoaded, setUserInfoLoaded] = useState(false);

  // Charger les informations de l'utilisateur connecté quand le modal s'ouvre
  React.useEffect(() => {
    const loadUserInfo = async () => {
      if (open && !userInfoLoaded) {
        try {
          const userInfo = await authService.getCurrentUserInfo();
          console.log('Informations utilisateur chargées:', userInfo);

          setFormData(prev => ({
            ...prev,
            nom: userInfo.lastName || '',
            prenom: userInfo.firstName || '',
            email: userInfo.email || ''
          }));

          setUserInfoLoaded(true);
        } catch (error) {
          console.error('Erreur lors du chargement des informations utilisateur:', error);
          // En cas d'erreur, on continue avec les champs vides
        }
      }
    };

    loadUserInfo();
  }, [open, userInfoLoaded]);

  // Réinitialiser l'état quand le modal se ferme
  React.useEffect(() => {
    if (!open) {
      setUserInfoLoaded(false);
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        motivation: ''
      });
      setCvFile(null);
      setError('');
      setSuccess('');
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Seuls les fichiers PDF et Word sont acceptés');
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Le fichier ne doit pas dépasser 5MB');
        return;
      }
      
      setCvFile(file);
      setError('');
    }
  };

  const handleRemoveFile = () => {
    setCvFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone) {
      setError('Veuillez remplir tous les champs obligatoires');
      setLoading(false);
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez saisir un email valide');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('offreStageId', offre.id);
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('prenom', formData.prenom);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('telephone', formData.telephone);
      formDataToSend.append('motivation', formData.motivation);
      
      if (cvFile) {
        formDataToSend.append('cv', cvFile);
      }

      await onSubmit(formDataToSend);
      
      setSuccess('Candidature soumise avec succès !');
      
      // Réinitialiser seulement les champs non personnels après 2 secondes
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          telephone: '',
          motivation: ''
        }));
        setCvFile(null);
        setSuccess('');
        onClose();
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Erreur lors de la soumission de la candidature');
    } finally {
      setLoading(false);
    }
  };

  if (!offre) return null;

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
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h5" fontWeight="bold">
            Candidater pour: {offre.titre}
          </MDTypography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Contenu */}
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {userInfoLoaded && (
          <Alert severity="info" sx={{ mb: 2 }}>
            ✅ Vos informations personnelles ont été automatiquement pré-remplies depuis votre profil.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Informations personnelles */}
            <Grid item xs={12}>
              <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                Informations personnelles
              </MDTypography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <MDInput
                fullWidth
                label={userInfoLoaded ? "Nom * (pré-rempli)" : "Nom *"}
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
                sx={userInfoLoaded && formData.nom ? {
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    '& fieldset': { borderColor: 'success.main' }
                  }
                } : {}}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <MDInput
                fullWidth
                label={userInfoLoaded ? "Prénom * (pré-rempli)" : "Prénom *"}
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                required
                sx={userInfoLoaded && formData.prenom ? {
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    '& fieldset': { borderColor: 'success.main' }
                  }
                } : {}}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <MDInput
                fullWidth
                type="email"
                label={userInfoLoaded ? "Email * (pré-rempli)" : "Email *"}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                sx={userInfoLoaded && formData.email ? {
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    '& fieldset': { borderColor: 'success.main' }
                  }
                } : {}}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <MDInput
                fullWidth
                label="Téléphone *"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                required
              />
            </Grid>

            {/* CV Upload */}
            <Grid item xs={12}>
              <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                Curriculum Vitae
              </MDTypography>
              
              {!cvFile ? (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    border: '2px dashed #ccc',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'action.hover'
                    }
                  }}
                  onClick={() => document.getElementById('cv-upload').click()}
                >
                  <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" gutterBottom>
                    Cliquez pour télécharger votre CV
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Formats acceptés: PDF, Word (max 5MB)
                  </Typography>
                  <input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </Paper>
              ) : (
                <Paper
                  variant="outlined"
                  sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Box display="flex" alignItems="center">
                    <FileIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      {cvFile.name}
                    </Typography>
                  </Box>
                  <IconButton onClick={handleRemoveFile} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              )}
            </Grid>

            {/* Lettre de motivation */}
            <Grid item xs={12}>
              <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                Lettre de motivation
              </MDTypography>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Expliquez votre motivation pour ce stage..."
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="Décrivez votre intérêt pour ce poste, vos compétences pertinentes et ce que vous espérez apprendre..."
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3 }}>
        <MDButton
          variant="outlined"
          color="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Annuler
        </MDButton>
        <MDButton
          variant="gradient"
          color="success"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Envoi en cours...' : 'Envoyer ma candidature'}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default CandidatureModal;
