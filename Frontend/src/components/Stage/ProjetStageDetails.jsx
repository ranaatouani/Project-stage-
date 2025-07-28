import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Code as CodeIcon,
  GpsFixed as TargetIcon,
  School as SchoolIcon,
  PlaylistAddCheck as DeliveryIcon,
  DateRange as DateRangeIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

function ProjetStageDetails({ stage }) {
  if (!stage?.projetStage) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <AssignmentIcon color="disabled" />
            <Typography variant="h6" color="text.secondary">
              Aucun projet assigné
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Votre projet sera assigné prochainement par l'administrateur.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const projet = stage.projetStage;
  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {/* En-tête du projet */}
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <AssignmentIcon color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold" color="primary">
              {projet.titre}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Projet de stage assigné
            </Typography>
          </Box>
        </Box>

        {/* Description */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Description du projet
          </Typography>
          <Typography variant="body1" paragraph>
            {projet.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          {/* Technologies */}
          {projet.technologiesUtilisees && (
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <CodeIcon color="primary" />
                <Typography variant="h6">Technologies</Typography>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {projet.technologiesUtilisees.split(',').map((tech, index) => (
                  <Chip
                    key={index}
                    label={tech.trim()}
                    variant="outlined"
                    color="primary"
                    size="small"
                  />
                ))}
              </Box>
            </Grid>
          )}

          {/* Compétences requises */}
          {projet.competencesRequises && (
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <SchoolIcon color="primary" />
                <Typography variant="h6">Compétences requises</Typography>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {projet.competencesRequises.split(',').map((comp, index) => (
                  <Chip
                    key={index}
                    label={comp.trim()}
                    variant="outlined"
                    color="secondary"
                    size="small"
                  />
                ))}
              </Box>
            </Grid>
          )}

          {/* Dates */}
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <DateRangeIcon color="primary" />
              <Typography variant="h6">Période</Typography>
            </Box>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body2">
                <strong>Début :</strong> {formatDate(projet.dateDebut)}
              </Typography>
              <Typography variant="body2">
                <strong>Fin :</strong> {formatDate(projet.dateFin)}
              </Typography>
            </Paper>
          </Grid>

          {/* Statut du stage */}
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <CheckCircleIcon color="primary" />
              <Typography variant="h6">Statut</Typography>
            </Box>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Chip
                label={stage.statut === 'EN_COURS' ? 'En cours' : 
                      stage.statut === 'TERMINE' ? 'Terminé' : 
                      stage.statut === 'SUSPENDU' ? 'Suspendu' : 'Annulé'}
                color={stage.statut === 'EN_COURS' ? 'success' : 
                       stage.statut === 'TERMINE' ? 'primary' : 'error'}
                variant="filled"
              />
            </Paper>
          </Grid>
        </Grid>

        {/* Objectifs */}
        {projet.objectifs && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box mb={3}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <TargetIcon color="primary" />
                <Typography variant="h6">Objectifs du projet</Typography>
              </Box>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body1">
                  {projet.objectifs}
                </Typography>
              </Paper>
            </Box>
          </>
        )}

        {/* Livrables attendus */}
        {projet.livrablesAttendus && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <DeliveryIcon color="primary" />
                <Typography variant="h6">Livrables attendus</Typography>
              </Box>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body1">
                  {projet.livrablesAttendus}
                </Typography>
              </Paper>
            </Box>
          </>
        )}

        {/* Commentaires du stage */}
        {stage.commentaires && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="h6" gutterBottom>
                Instructions particulières
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'info.50' }}>
                <Typography variant="body1">
                  {stage.commentaires}
                </Typography>
              </Paper>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default ProjetStageDetails;
