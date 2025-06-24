import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert
} from '@mui/material';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { fr } from 'date-fns/locale';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';

function ProgrammerEntretienModal({ open, onClose, candidature, onSave }) {
  const [formData, setFormData] = useState({
    dateEntretien: '',
    lieu: '',
    typeEntretien: 'PRESENTIEL',
    lienVisio: '',
    commentaires: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.dateEntretien) {
      setError('La date et l\'heure sont obligatoires');
      return;
    }

    if (!formData.lieu.trim()) {
      setError('Le lieu est obligatoire');
      return;
    }

    if (formData.typeEntretien === 'VISIOCONFERENCE' && !formData.lienVisio.trim()) {
      setError('Le lien de visioconférence est obligatoire pour ce type d\'entretien');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const entretienData = {
        candidatureId: candidature.id,
        dateEntretien: new Date(formData.dateEntretien).toISOString(),
        lieu: formData.lieu,
        typeEntretien: formData.typeEntretien,
        lienVisio: formData.lienVisio || null,
        commentaires: formData.commentaires || null
      };

      await onSave(entretienData);
      handleClose();
    } catch (err) {
      setError(err.message || 'Erreur lors de la programmation de l\'entretien');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      dateEntretien: '',
      lieu: '',
      typeEntretien: 'PRESENTIEL',
      lienVisio: '',
      commentaires: ''
    });
    setError('');
    onClose();
  };

  if (!candidature) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <MDTypography variant="h5" fontWeight="bold">
          Programmer un entretien
        </MDTypography>
        <MDTypography variant="body2" color="text" sx={{ mt: 1 }}>
          Candidature de {candidature.nom} {candidature.prenom} pour "{candidature.offreStage?.titre}"
        </MDTypography>
      </DialogTitle>

      <DialogContent>
        <MDBox sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Date et heure */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date et heure de l'entretien"
                type="datetime-local"
                value={formData.dateEntretien}
                onChange={(e) => handleChange('dateEntretien', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>

            {/* Type d'entretien */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type d'entretien</InputLabel>
                <Select
                  value={formData.typeEntretien}
                  label="Type d'entretien"
                  onChange={(e) => handleChange('typeEntretien', e.target.value)}
                >
                  <MenuItem value="PRESENTIEL">Présentiel</MenuItem>
                  <MenuItem value="VISIOCONFERENCE">Visioconférence</MenuItem>
                  <MenuItem value="TELEPHONIQUE">Téléphonique</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Lieu */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lieu de l'entretien"
                value={formData.lieu}
                onChange={(e) => handleChange('lieu', e.target.value)}
                placeholder={
                  formData.typeEntretien === 'PRESENTIEL' 
                    ? "Ex: Bureau 201, 123 Rue de la Paix, Paris"
                    : formData.typeEntretien === 'VISIOCONFERENCE'
                    ? "Ex: Salle de réunion virtuelle"
                    : "Ex: Entretien téléphonique"
                }
                required
              />
            </Grid>

            {/* Lien visio (si applicable) */}
            {formData.typeEntretien === 'VISIOCONFERENCE' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Lien de visioconférence"
                  value={formData.lienVisio}
                  onChange={(e) => handleChange('lienVisio', e.target.value)}
                  placeholder="Ex: https://meet.google.com/abc-defg-hij"
                  required
                />
              </Grid>
            )}

            {/* Commentaires */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Commentaires (optionnel)"
                value={formData.commentaires}
                onChange={(e) => handleChange('commentaires', e.target.value)}
                placeholder="Instructions particulières, documents à apporter, etc."
              />
            </Grid>
          </Grid>
        </MDBox>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <MDButton
          variant="outlined"
          color="secondary"
          onClick={handleClose}
          disabled={loading}
        >
          Annuler
        </MDButton>
        <MDButton
          variant="gradient"
          color="info"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Programmation...' : 'Programmer l\'entretien'}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default ProgrammerEntretienModal;
