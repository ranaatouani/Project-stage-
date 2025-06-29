import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pause as PauseIcon
} from '@mui/icons-material';

import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';

function ChangerStatutStageModal({ open, onClose, stage, onSave }) {
  const [nouveauStatut, setNouveauStatut] = useState('');
  const [commentaires, setCommentaires] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (stage && open) {
      setNouveauStatut(stage.statut || '');
      setCommentaires(stage.commentaires || '');
      setError('');
    }
  }, [stage, open]);

  const handleSave = async () => {
    if (!nouveauStatut) {
      setError('Veuillez sélectionner un statut');
      return;
    }

    if (nouveauStatut === 'ANNULE' && !commentaires.trim()) {
      setError('Un commentaire est obligatoire pour annuler un stage');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await onSave(nouveauStatut, commentaires);
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Erreur lors du changement de statut');
    } finally {
      setLoading(false);
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'EN_COURS': return <WorkIcon color="info" />;
      case 'TERMINE': return <CheckCircleIcon color="success" />;
      case 'ANNULE': return <CancelIcon color="error" />;
      case 'SUSPENDU': return <PauseIcon color="warning" />;
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

  if (!stage) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold">
              Changer le statut du stage
            </MDTypography>
            <MDTypography variant="body2" color="text">
              {stage.offreStage?.titre} - {stage.stagiaire?.lastName} {stage.stagiaire?.firstName}
            </MDTypography>
          </MDBox>
          <IconButton onClick={onClose} size="large">
            <CloseIcon />
          </IconButton>
        </MDBox>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Statut actuel */}
        <Box mb={3}>
          <MDTypography variant="h6" gutterBottom>
            Statut actuel
          </MDTypography>
          <Box display="flex" alignItems="center">
            {getStatutIcon(stage.statut)}
            <Typography variant="body1" sx={{ ml: 1 }}>
              {getStatutLabel(stage.statut)}
            </Typography>
          </Box>
        </Box>

        {/* Nouveau statut */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Nouveau statut</InputLabel>
          <Select
            value={nouveauStatut}
            onChange={(e) => setNouveauStatut(e.target.value)}
            label="Nouveau statut"
          >
            <MenuItem value="EN_COURS">
              <Box display="flex" alignItems="center">
                <WorkIcon color="info" sx={{ mr: 1 }} />
                En cours
              </Box>
            </MenuItem>
            <MenuItem value="TERMINE">
              <Box display="flex" alignItems="center">
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                Terminé
              </Box>
            </MenuItem>
            <MenuItem value="SUSPENDU">
              <Box display="flex" alignItems="center">
                <PauseIcon color="warning" sx={{ mr: 1 }} />
                Suspendu
              </Box>
            </MenuItem>
            <MenuItem value="ANNULE">
              <Box display="flex" alignItems="center">
                <CancelIcon color="error" sx={{ mr: 1 }} />
                Annulé
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        {/* Commentaires */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Commentaires"
          value={commentaires}
          onChange={(e) => setCommentaires(e.target.value)}
          placeholder={
            nouveauStatut === 'ANNULE' 
              ? "Motif d'annulation (obligatoire)"
              : nouveauStatut === 'SUSPENDU'
              ? "Motif de suspension"
              : "Commentaires optionnels"
          }
          helperText={
            nouveauStatut === 'ANNULE' 
              ? "Un commentaire est obligatoire pour annuler un stage"
              : "Commentaires visibles par le stagiaire"
          }
          required={nouveauStatut === 'ANNULE'}
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
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
          color={nouveauStatut === 'ANNULE' ? 'error' : 'info'}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Sauvegarde...' : 'Changer le statut'}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default ChangerStatutStageModal;
