import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pause as PauseIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

// Material Dashboard 2 React components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// Services
import { stageService } from 'services/stageService';

// Components
import StageDetailsModal from 'components/Stage/StageDetailsModal';
import ChangerStatutStageModal from 'components/Stage/ChangerStatutStageModal';

function StagesAdmin() {
  const [currentTab, setCurrentTab] = useState(0);
  const [stages, setStages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Menu contextuel
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  
  // Modals
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [statutModalOpen, setStatutModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [currentTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      let stagesData;
      switch (currentTab) {
        case 0: // Tous
          stagesData = await stageService.getAllStages();
          break;
        case 1: // En cours
          stagesData = await stageService.getStagesEnCours();
          break;
        case 2: // Terminés
          stagesData = await stageService.getStagesTermines();
          break;
        default:
          stagesData = await stageService.getAllStages();
      }
      
      setStages(stagesData);
      
      // Charger les statistiques
      const statsData = await stageService.getStageStats();
      setStats(statsData);
      
    } catch (err) {
      setError('Erreur lors du chargement des stages');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleMenuClick = (event, stage) => {
    setAnchorEl(event.currentTarget);
    setSelectedStage(stage);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStage(null);
  };

  const handleVoirDetails = (stage) => {
    setSelectedStage(stage);
    setDetailsModalOpen(true);
    handleMenuClose();
  };

  const handleChangerStatut = (stage) => {
    setSelectedStage(stage);
    setStatutModalOpen(true);
    handleMenuClose();
  };

  const handleStatutChange = async (nouveauStatut, commentaires) => {
    try {
      await stageService.changerStatutStage(selectedStage.id, nouveauStatut, commentaires);
      setStatutModalOpen(false);
      loadData(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'EN_COURS': return 'info';
      case 'TERMINE': return 'success';
      case 'ANNULE': return 'error';
      case 'SUSPENDU': return 'warning';
      default: return 'default';
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'EN_COURS': return <WorkIcon />;
      case 'TERMINE': return <CheckCircleIcon />;
      case 'ANNULE': return <CancelIcon />;
      case 'SUSPENDU': return <PauseIcon />;
      default: return <WorkIcon />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mb={3}>
          <MDTypography variant="h4" fontWeight="bold">
            Gestion des Stages
          </MDTypography>
          <MDTypography variant="body2" color="text">
            Gérez les stages des étudiants acceptés
          </MDTypography>
        </MDBox>

        {/* Statistiques */}
        {stats && (
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <WorkIcon color="info" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="h4">{stats.enCours}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        En cours
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="h4">{stats.termines}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Terminés
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <CancelIcon color="error" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="h4">{stats.annules}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Annulés
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <PauseIcon color="warning" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="h4">{stats.suspendus}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Suspendus
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Onglets */}
        <MDBox mb={3}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Tous les stages" />
            <Tab label="En cours" />
            <Tab label="Terminés" />
          </Tabs>
        </MDBox>

        {/* Messages d'erreur */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Liste des stages */}
        <Card>
          <CardContent>
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : stages.length === 0 ? (
              <Box textAlign="center" p={3}>
                <Typography variant="h6" color="text.secondary">
                  Aucun stage trouvé
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Stagiaire</TableCell>
                      <TableCell>Stage</TableCell>
                      <TableCell>Entreprise</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell>Dates</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stages.map((stage) => (
                      <TableRow key={stage.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {stage.stagiaire.lastName} {stage.stagiaire.firstName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {stage.stagiaire.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {stage.offreStage.titre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {stage.offreStage.dureeSemaines} semaines
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {stage.offreStage.entreprise}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatutIcon(stage.statut)}
                            label={stage.statut.replace('_', ' ')}
                            color={getStatutColor(stage.statut)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            <Box>
                              <Typography variant="caption">
                                Du {formatDate(stage.dateDebut)}
                              </Typography>
                              <br />
                              <Typography variant="caption">
                                Au {formatDate(stage.dateFin)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={(e) => handleMenuClick(e, stage)}
                            size="small"
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Menu contextuel */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleVoirDetails(selectedStage)}>
            Voir détails
          </MenuItem>
          <MenuItem onClick={() => handleChangerStatut(selectedStage)}>
            Changer statut
          </MenuItem>
        </Menu>

        {/* Modals */}
        <StageDetailsModal
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          stage={selectedStage}
        />

        <ChangerStatutStageModal
          open={statutModalOpen}
          onClose={() => setStatutModalOpen(false)}
          stage={selectedStage}
          onSave={handleStatutChange}
        />
      </MDBox>
    </DashboardLayout>
  );
}

export default StagesAdmin;
