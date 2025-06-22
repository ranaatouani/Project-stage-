import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Euro as EuroIcon,
  CalendarToday as CalendarIcon,
  Code as CodeIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon
} from '@mui/icons-material';

import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

import { formatDate, formatDuree, getStatusColor, getStatusText } from 'services/offreStageService';

function OffreStageDetails({ open, onClose, offre }) {
  if (!offre) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h4" fontWeight="medium">
            {offre.titre}
          </MDTypography>
          <Chip
            label={getStatusText(offre.estPublie)}
            color={getStatusColor(offre.estPublie)}
            size="medium"
          />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Informations principales */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <MDTypography variant="h6" fontWeight="medium" mb={2}>
                  Description de l'offre
                </MDTypography>
                <Typography variant="body1" paragraph>
                  {offre.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <LocationIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Localisation"
                          secondary={offre.localisation}
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <ScheduleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Durée"
                          secondary={formatDuree(offre.dureeSemaines)}
                        />
                      </ListItem>

                      {offre.entreprise && (
                        <ListItem>
                          <ListItemIcon>
                            <BusinessIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Entreprise"
                            secondary={offre.entreprise}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <List dense>
                      {offre.contactEmail && (
                        <ListItem>
                          <ListItemIcon>
                            <EmailIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Contact"
                            secondary={offre.contactEmail}
                          />
                        </ListItem>
                      )}

                      {offre.salaireMensuel && (
                        <ListItem>
                          <ListItemIcon>
                            <EuroIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Salaire mensuel"
                            secondary={`${offre.salaireMensuel} €`}
                          />
                        </ListItem>
                      )}

                      <ListItem>
                        <ListItemIcon>
                          <CalendarIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Date de création"
                          secondary={formatDate(offre.dateCreation)}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>

                {offre.datePublication && (
                  <Box mt={2}>
                    <Typography variant="body2" color="success.main">
                      <strong>Publiée le:</strong> {formatDate(offre.datePublication)}
                    </Typography>
                  </Box>
                )}

                {offre.dateModification && (
                  <Box mt={1}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Dernière modification:</strong> {formatDate(offre.dateModification)}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Projet associé */}
          {offre.projetStage && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <MDTypography variant="h6" fontWeight="medium" mb={2}>
                    Projet de stage associé
                  </MDTypography>
                  
                  <Typography variant="h6" color="primary" gutterBottom>
                    {offre.projetStage.titre}
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    {offre.projetStage.description}
                  </Typography>

                  {offre.projetStage.objectifs && (
                    <Box mb={2}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle2" fontWeight="medium">
                          Objectifs du projet
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {offre.projetStage.objectifs}
                      </Typography>
                    </Box>
                  )}

                  {offre.projetStage.technologiesUtilisees && (
                    <Box mb={2}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <CodeIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle2" fontWeight="medium">
                          Technologies utilisées
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {offre.projetStage.technologiesUtilisees}
                      </Typography>
                    </Box>
                  )}

                  {offre.projetStage.competencesRequises && (
                    <Box mb={2}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle2" fontWeight="medium">
                          Compétences requises
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {offre.projetStage.competencesRequises}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Informations sur le créateur */}
          {offre.createdBy && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <MDTypography variant="h6" fontWeight="medium" mb={2}>
                    Informations administratives
                  </MDTypography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Créée par:</strong> {offre.createdBy.firstName} {offre.createdBy.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> {offre.createdBy.email}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <MDButton variant="gradient" color="info" onClick={onClose}>
          Fermer
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default OffreStageDetails;
