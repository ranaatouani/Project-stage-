import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { candidatureService } from 'services/candidatureService';

function AccepterAvecProjetModal({ open, onClose, candidature, onSuccess }) {
  console.log('AccepterAvecProjetModal rendu avec props:', { open, candidature: candidature?.id, onClose: !!onClose, onSuccess: !!onSuccess });
  const [formData, setFormData] = useState({
    candidatureId: '',
    titreProjet: '',
    descriptionProjet: '',
    technologiesUtilisees: '',
    objectifs: '',
    competencesRequises: '',
    livrablesAttendus: '',
    dateDebut: '',
    dateFin: '',
    commentaires: ''
  });

  // Mettre à jour l'ID de candidature quand elle change
  React.useEffect(() => {
    if (candidature?.id) {
      console.log('Candidature reçue dans le modal:', candidature);
      setFormData(prev => ({
        ...prev,
        candidatureId: candidature.id
      }));
    }
  }, [candidature]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataToSend = {
        ...formData,
        candidatureId: candidature.id
      };

      await candidatureService.accepterCandidatureAvecProjet(dataToSend);
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        candidatureId: '',
        titreProjet: '',
        descriptionProjet: '',
        technologiesUtilisees: '',
        objectifs: '',
        competencesRequises: '',
        livrablesAttendus: '',
        dateDebut: '',
        dateFin: '',
        commentaires: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'acceptation de la candidature');
    } finally {
      setLoading(false);
    }
  };

  if (!candidature && open) {
    console.log('Modal fermé: pas de candidature mais open=true');
    return null;
  }

  if (!open) {
    console.log('Modal fermé: open=false');
  } else {
    console.log('Modal ouvert avec candidature:', candidature);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <AssignmentIcon color="primary" />
          <Typography variant="h6">
            Accepter la candidature et assigner un projet
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Informations du candidat */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <PersonIcon color="primary" />
            <Typography variant="h6">Candidat</Typography>
          </Box>
          <Typography variant="body1">
            <strong>{candidature.nom} {candidature.prenom}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {candidature.email} • {candidature.telephone}
          </Typography>
          <Box mt={1}>
            <Chip 
              icon={<WorkIcon />}
              label={candidature.offreStage?.titre || 'Offre de stage'}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon color="primary" />
            Détails du projet à assigner
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="titreProjet"
                label="Titre du projet"
                value={formData.titreProjet}
                onChange={handleChange}
                fullWidth
                required
                placeholder="Ex: Développement d'une application web de gestion"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="descriptionProjet"
                label="Description du projet"
                value={formData.descriptionProjet}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={4}
                placeholder="Décrivez en détail le projet que le stagiaire devra réaliser..."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="technologiesUtilisees"
                label="Technologies utilisées"
                value={formData.technologiesUtilisees}
                onChange={handleChange}
                fullWidth
                placeholder="Ex: React, Node.js, MongoDB, Docker"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="competencesRequises"
                label="Compétences requises"
                value={formData.competencesRequises}
                onChange={handleChange}
                fullWidth
                placeholder="Ex: JavaScript, Base de données, API REST"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="objectifs"
                label="Objectifs du projet"
                value={formData.objectifs}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Quels sont les objectifs pédagogiques et techniques de ce projet ?"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="livrablesAttendus"
                label="Livrables attendus"
                value={formData.livrablesAttendus}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Ex: Application fonctionnelle, documentation technique, rapport de stage..."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="dateDebut"
                label="Date de début"
                type="date"
                value={formData.dateDebut}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="dateFin"
                label="Date de fin"
                type="date"
                value={formData.dateFin}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="commentaires"
                label="Commentaires additionnels"
                value={formData.commentaires}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                placeholder="Commentaires ou instructions particulières..."
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.titreProjet || !formData.descriptionProjet}
          startIcon={<AssignmentIcon />}
        >
          {loading ? 'Traitement...' : 'Accepter et Assigner le Projet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AccepterAvecProjetModal;
