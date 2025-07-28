import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// @mui icons
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AttachFileIcon from "@mui/icons-material/AttachFile";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Services
import { candidatureService } from "services/candidatureService";

// Components
import CandidatureDetailsModal from "components/Candidature/CandidatureDetailsModalFinal";

function CandidaturesAdmin() {
  const navigate = useNavigate();
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCandidatures, setFilteredCandidatures] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    loadCandidatures();
  }, []);

  useEffect(() => {
    // Filtrer les candidatures selon le terme de recherche
    if (searchTerm.trim() === '') {
      setFilteredCandidatures(candidatures);
    } else {
      const filtered = candidatures.filter(candidature =>
        candidature.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidature.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidature.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidature.offreStage.titre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCandidatures(filtered);
    }
  }, [searchTerm, candidatures]);

  const loadCandidatures = async () => {
    try {
      setLoading(true);
      const data = await candidatureService.getToutesCandidatures();
      setCandidatures(data);
      setError('');
    } catch (err) {
      console.error('Erreur lors du chargement des candidatures:', err);
      setError('Erreur lors du chargement des candidatures');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
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
      case 'ENTRETIEN': return 'Entretien';
      case 'ANNULEE': return 'Annulée';
      default: return statut;
    }
  };

  const handleMenuOpen = (event, candidature) => {
    setAnchorEl(event.currentTarget);
    setSelectedCandidature(candidature);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCandidature(null);
  };

  const handleChangeStatut = async (nouveauStatut) => {
    try {
      await candidatureService.changerStatutCandidature(selectedCandidature.id, nouveauStatut);
      await loadCandidatures(); // Recharger les données
      handleMenuClose();
      setDetailsModalOpen(false); // Fermer le modal de détails aussi
    } catch (err) {
      console.error('Erreur lors du changement de statut:', err);
      setError('Erreur lors du changement de statut');
    }
  };

  const handleVoirDetails = (candidature) => {
    setSelectedCandidature(candidature);
    setDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedCandidature(null);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* En-tête */}
        <MDBox mb={4}>
          <MDTypography variant="h4" fontWeight="medium" gutterBottom>
            Gestion des Candidatures
          </MDTypography>
          <Typography variant="h6" color="text.secondary">
            Consultez et gérez toutes les candidatures reçues
          </Typography>
        </MDBox>

        {/* Barre de recherche */}
        <MDBox mb={4}>
          <TextField
            fullWidth
            placeholder="Rechercher par nom, email ou offre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 600 }}
          />
        </MDBox>

        {/* Statistiques rapides */}
        <MDBox mb={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <WorkIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {filteredCandidatures.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total candidatures
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <ScheduleIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {filteredCandidatures.filter(c => c.statut === 'EN_ATTENTE').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    En attente
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {filteredCandidatures.filter(c => c.statut === 'ACCEPTEE').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Acceptées
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CancelIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {filteredCandidatures.filter(c => c.statut === 'REFUSEE').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Refusées
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </MDBox>

        {/* Contenu principal */}
        {loading ? (
          <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </MDBox>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <Card>
            <CardContent>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Candidat</strong></TableCell>
                      <TableCell><strong>Contact</strong></TableCell>
                      <TableCell><strong>Offre</strong></TableCell>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell><strong>Statut</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCandidatures.map((candidature) => (
                      <TableRow key={candidature.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Box>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography
                                  variant="body2"
                                  fontWeight="medium"
                                  sx={{
                                    cursor: 'pointer',
                                    '&:hover': { color: 'primary.main', textDecoration: 'underline' }
                                  }}
                                  onClick={() => handleVoirDetails(candidature)}
                                >
                                  {candidature.prenom} {candidature.nom}
                                </Typography>
                                {candidature.cvFilename && (
                                  <AttachFileIcon
                                    sx={{ fontSize: 16, color: 'success.main' }}
                                    title="CV disponible"
                                  />
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Box display="flex" alignItems="center" mb={0.5}>
                              <EmailIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="caption">
                                {candidature.email}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                              <PhoneIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="caption">
                                {candidature.telephone}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {candidature.offreStage.titre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {candidature.offreStage.entreprise}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(candidature.dateCandidature)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatutLabel(candidature.statut)}
                            color={getStatutColor(candidature.statut)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <MDButton
                              variant="outlined"
                              color="info"
                              size="small"
                              onClick={() => handleVoirDetails(candidature)}
                            >
                              Détails
                            </MDButton>
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, candidature)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {filteredCandidatures.length === 0 && !loading && (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="text.secondary">
                    {searchTerm ? 'Aucune candidature ne correspond à votre recherche.' : 'Aucune candidature disponible.'}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Menu contextuel */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleChangeStatut('ACCEPTEE')}>
            <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
            Accepter
          </MenuItem>
          <MenuItem onClick={() => handleChangeStatut('REFUSEE')}>
            <CancelIcon sx={{ mr: 1, color: 'error.main' }} />
            Refuser
          </MenuItem>
          <MenuItem onClick={() => handleChangeStatut('ENTRETIEN')}>
            <ScheduleIcon sx={{ mr: 1, color: 'info.main' }} />
            Programmer entretien
          </MenuItem>
          <MenuItem onClick={() => handleChangeStatut('EN_ATTENTE')}>
            <ScheduleIcon sx={{ mr: 1, color: 'warning.main' }} />
            Remettre en attente
          </MenuItem>
        </Menu>

        {/* Modal de détails de candidature */}
        <CandidatureDetailsModal
          open={detailsModalOpen}
          onClose={handleCloseDetailsModal}
          candidature={selectedCandidature}
          onChangeStatut={handleChangeStatut}
        />
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default CandidaturesAdmin;
