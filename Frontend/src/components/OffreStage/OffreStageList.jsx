import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Publish as PublishIcon,
  UnpublishedOutlined as UnpublishIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';

import { offreStageService, formatDate, formatDuree, getStatusColor, getStatusText } from 'services/offreStageService';

function OffreStageList({ onCreateNew, onEdit, onView }) {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOffres, setFilteredOffres] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, offre: null });

  useEffect(() => {
    loadOffres();
  }, []);

  useEffect(() => {
    // Filtrer les offres en fonction du terme de recherche
    if (searchTerm.trim() === '') {
      setFilteredOffres(offres);
    } else {
      const filtered = offres.filter(offre =>
        offre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.localisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (offre.entreprise && offre.entreprise.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredOffres(filtered);
    }
  }, [searchTerm, offres]);

  const loadOffres = async () => {
    try {
      setLoading(true);
      const data = await offreStageService.getAllOffres();
      setOffres(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des offres: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await offreStageService.supprimerOffre(deleteDialog.offre.id);
      setDeleteDialog({ open: false, offre: null });
      loadOffres();
    } catch (err) {
      setError('Erreur lors de la suppression: ' + (err.response?.data?.error || err.message));
    }
  };

  const handlePublish = async (offre) => {
    try {
      if (offre.estPublie) {
        await offreStageService.depublierOffre(offre.id);
      } else {
        await offreStageService.publierOffre(offre.id);
      }
      loadOffres();
    } catch (err) {
      setError('Erreur lors de la publication: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const results = await offreStageService.rechercherOffres(searchTerm);
        setOffres(results);
      } catch (err) {
        setError('Erreur lors de la recherche: ' + (err.response?.data?.error || err.message));
      }
    } else {
      loadOffres();
    }
  };

  if (loading) {
    return (
      <MDBox p={3}>
        <MDTypography variant="h6">Chargement des offres...</MDTypography>
      </MDBox>
    );
  }

  return (
    <MDBox>
      {/* Header avec recherche et bouton d'ajout */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <MDTypography variant="h4" fontWeight="medium">
          Gestion des Offres de Stage
        </MDTypography>
        <MDButton variant="gradient" color="info" onClick={onCreateNew} startIcon={<AddIcon />}>
          Nouvelle Offre
        </MDButton>
      </MDBox>

      {/* Barre de recherche */}
      <MDBox mb={3}>
        <TextField
          fullWidth
          placeholder="Rechercher par titre, description, localisation ou entreprise..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </MDBox>

      {/* Messages d'erreur */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Liste des offres */}
      <Grid container spacing={3}>
        {filteredOffres.map((offre) => (
          <Grid item xs={12} md={6} lg={4} key={offre.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Header de la carte */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" component="h2" sx={{ flexGrow: 1, mr: 1 }}>
                    {offre.titre}
                  </Typography>
                  <Chip
                    label={getStatusText(offre.estPublie)}
                    color={getStatusColor(offre.estPublie)}
                    size="small"
                  />
                </Box>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {offre.description.length > 150
                    ? `${offre.description.substring(0, 150)}...`
                    : offre.description}
                </Typography>

                {/* Informations détaillées */}
                <Box sx={{ mb: 2 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{offre.localisation}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <ScheduleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{formatDuree(offre.dureeSemaines)}</Typography>
                  </Box>
                  {offre.entreprise && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{offre.entreprise}</Typography>
                    </Box>
                  )}
                </Box>

                {/* Dates */}
                <Typography variant="caption" color="text.secondary">
                  Créée le {formatDate(offre.dateCreation)}
                  {offre.datePublication && (
                    <><br />Publiée le {formatDate(offre.datePublication)}</>
                  )}
                </Typography>
              </CardContent>

              {/* Actions */}
              <Box sx={{ p: 2, pt: 0 }}>
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Tooltip title="Voir les détails">
                      <IconButton size="small" onClick={() => onView(offre)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                      <IconButton size="small" onClick={() => onEdit(offre)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteDialog({ open: true, offre })}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Tooltip title={offre.estPublie ? "Dépublier" : "Publier"}>
                    <IconButton
                      size="small"
                      color={offre.estPublie ? "warning" : "success"}
                      onClick={() => handlePublish(offre)}
                    >
                      {offre.estPublie ? <UnpublishIcon /> : <PublishIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Message si aucune offre */}
      {filteredOffres.length === 0 && !loading && (
        <MDBox textAlign="center" py={6}>
          <MDTypography variant="h6" color="text" fontWeight="light">
            {searchTerm ? 'Aucune offre trouvée pour cette recherche' : 'Aucune offre de stage disponible'}
          </MDTypography>
          {!searchTerm && (
            <MDButton variant="gradient" color="info" onClick={onCreateNew} sx={{ mt: 2 }}>
              Créer la première offre
            </MDButton>
          )}
        </MDBox>
      )}

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, offre: null })}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer l'offre "{deleteDialog.offre?.titre}" ?
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, offre: null })}>
            Annuler
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}

export default OffreStageList;
