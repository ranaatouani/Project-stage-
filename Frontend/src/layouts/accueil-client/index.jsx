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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// @mui icons
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WorkIcon from "@mui/icons-material/Work";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Services
import { offreStageService } from "services/offreStageService";
import { candidatureService } from "services/candidatureService";

// Components
import OffreDetailsModal from "components/OffreStage/OffreDetailsModal";
import CandidatureModal from "components/OffreStage/CandidatureModal";
import MesCandidatures from "components/Candidatures/MesCandidatures";
// import CalendrierEntretiens from "components/Entretien/CalendrierEntretiens";

function AccueilClient() {
  const navigate = useNavigate();
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOffres, setFilteredOffres] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);

  // États pour les modals
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [candidatureModalOpen, setCandidatureModalOpen] = useState(false);

  useEffect(() => {
    loadOffresPubliees();
  }, []);

  useEffect(() => {
    // Filtrer les offres selon le terme de recherche
    if (searchTerm.trim() === '') {
      setFilteredOffres(offres);
    } else {
      const filtered = offres.filter(offre =>
        offre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.localisation.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOffres(filtered);
    }
  }, [searchTerm, offres]);

  const loadOffresPubliees = async () => {
    try {
      setLoading(true);
      const data = await offreStageService.getOffresPubliees();
      setOffres(data);
      setError('');
    } catch (err) {
      console.error('Erreur lors du chargement des offres:', err);
      setError('Erreur lors du chargement des offres de stage');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleVoirDetails = (offre) => {
    setSelectedOffre(offre);
    setDetailsModalOpen(true);
  };

  const handleCandidater = (offre) => {
    setSelectedOffre(offre);
    setCandidatureModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedOffre(null);
  };

  const handleCloseCandidatureModal = () => {
    setCandidatureModalOpen(false);
    setSelectedOffre(null);
  };

  const handleSubmitCandidature = async (formData) => {
    try {
      await candidatureService.soumettreCandidature(formData);
      // La modal se fermera automatiquement après succès
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la soumission');
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* En-tête de bienvenue personnalisé */}
        <MDBox mb={4}>
          <MDTypography variant="h4" fontWeight="medium" gutterBottom>
            Bienvenue dans votre espace personnel
          </MDTypography>
          <Typography variant="h6" color="text.secondary">
            Découvrez les offres de stage disponibles et gérez vos candidatures
          </Typography>
        </MDBox>

        {/* Onglets de navigation */}
        <MDBox mb={4}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="client tabs">
            <Tab label="Offres disponibles" />
            <Tab label="Mes candidatures" />
            {/* <Tab label="Mes entretiens" /> */}
          </Tabs>
        </MDBox>

        {currentTab === 0 && (
          <>
            {/* Barre de recherche */}
            <MDBox mb={4}>
              <TextField
                fullWidth
                placeholder="Rechercher par titre, entreprise, localisation..."
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

        {/* Statistiques rapides pour le client */}
        <MDBox mb={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <WorkIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {filteredOffres.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Offres disponibles
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AccessTimeIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Candidatures envoyées
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <BusinessIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Entretiens programmés
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <LocationOnIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Offres favorites
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
        ) : filteredOffres.length === 0 ? (
          <Alert severity="info">
            {searchTerm ? 'Aucune offre ne correspond à votre recherche.' : 'Aucune offre de stage disponible pour le moment.'}
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredOffres.map((offre) => (
              <Grid item xs={12} md={6} lg={4} key={offre.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* En-tête de la carte */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <MDTypography variant="h6" fontWeight="medium" sx={{ flexGrow: 1, pr: 1 }}>
                        {offre.titre}
                      </MDTypography>
                      <Chip
                        label="Disponible"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    {/* Informations de l'entreprise */}
                    <Box display="flex" alignItems="center" mb={1}>
                      <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {offre.entreprise}
                      </Typography>
                    </Box>

                    {/* Localisation */}
                    <Box display="flex" alignItems="center" mb={1}>
                      <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {offre.localisation}
                      </Typography>
                    </Box>

                    {/* Durée */}
                    <Box display="flex" alignItems="center" mb={2}>
                      <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {offre.dureeSemaines} semaines
                      </Typography>
                    </Box>

                    {/* Description */}
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {offre.description.length > 150 
                        ? `${offre.description.substring(0, 150)}...` 
                        : offre.description}
                    </Typography>

                    {/* Date de publication */}
                    <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                      Publié le {formatDate(offre.datePublication)}
                    </Typography>

                    {/* Boutons d'action */}
                    <Box display="flex" gap={1}>
                      <MDButton
                        variant="gradient"
                        color="info"
                        size="small"
                        sx={{ flex: 1 }}
                        onClick={() => handleVoirDetails(offre)}
                      >
                        Détails
                      </MDButton>
                      <MDButton
                        variant="outlined"
                        color="success"
                        size="small"
                        sx={{ flex: 1 }}
                        onClick={() => handleCandidater(offre)}
                      >
                        Candidater
                      </MDButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
          </>
        )}

        {currentTab === 1 && (
          <MesCandidatures />
        )}

        {/* {currentTab === 2 && (
          <CalendrierEntretiens />
        )} */}

        {/* Modals */}
        <OffreDetailsModal
          open={detailsModalOpen}
          onClose={handleCloseDetailsModal}
          offre={selectedOffre}
          onCandidater={handleCandidater}
        />

        <CandidatureModal
          open={candidatureModalOpen}
          onClose={handleCloseCandidatureModal}
          offre={selectedOffre}
          onSubmit={handleSubmitCandidature}
        />
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default AccueilClient;
