/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  Divider
} from "@mui/material";
import {
  Work as WorkIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import {
  offresParMoisData,
  publicationsData,
  activiteUtilisateursData
} from "layouts/dashboard/data/stageChartsData";

// Services
import { statistiquesService } from "services/statistiquesService";
import { candidatureService } from "services/candidatureService";

// Dashboard components
import OffresRecentes from "layouts/dashboard/components/OffresRecentes";
import StatistiquesDetaillees from "layouts/dashboard/components/StatistiquesDetaillees";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const navigate = useNavigate();

  // États pour les statistiques
  const [stats, setStats] = useState(null);
  const [candidatureStats, setCandidatureStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les statistiques au montage du composant
  useEffect(() => {
    loadStatistiques();
  }, []);

  const loadStatistiques = async () => {
    try {
      setLoading(true);
      const [statsData, candidatureStatsData] = await Promise.all([
        statistiquesService.getStatistiquesDashboard(),
        candidatureService.getStatistiquesCandidatures()
      ]);
      setStats(statsData);
      setCandidatureStats(candidatureStatsData);
      setError('');
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </MDBox>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>


        {/* Statistiques principales */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon={<WorkIcon />}
                title="Total Offres"
                count={stats?.totalOffres || 0}
                percentage={{
                  color: "success",
                  amount: `+${stats?.offresRecentes || 0}`,
                  label: "cette semaine",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon={<VisibilityIcon />}
                title="Offres Publiées"
                count={stats?.offresPubliees || 0}
                percentage={{
                  color: "success",
                  amount: `+${stats?.offresPublieesRecentes || 0}`,
                  label: "cette semaine",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon={<PeopleIcon />}
                title="Utilisateurs"
                count={stats?.totalUtilisateurs || 0}
                percentage={{
                  color: "info",
                  amount: `${stats?.totalAdmins || 0} admins`,
                  label: `${stats?.totalClients || 0} clients`,
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon={<AssignmentIcon />}
                title="Projets"
                count={stats?.totalProjets || 0}
                percentage={{
                  color: "warning",
                  amount: `${stats?.offresCeMois || 0}`,
                  label: "offres ce mois",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        {/* Graphiques et tendances */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Offres par mois"
                  description="Évolution des créations d'offres"
                  date={`${stats?.offresCeMois || 0} offres ce mois`}
                  chart={offresParMoisData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Offres publiées"
                  description={
                    <>
                      (<strong>+{stats?.offresPublieesRecentes || 0}</strong>) nouvelles cette semaine
                    </>
                  }
                  date="mis à jour maintenant"
                  chart={publicationsData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="warning"
                  title="Activité utilisateurs"
                  description="Connexions et inscriptions"
                  date="données en temps réel"
                  chart={activiteUtilisateursData}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        {/* Actions rapides et informations détaillées */}
        <MDBox>
          <Grid container spacing={3}>
            {/* Carte de gestion des offres de stage */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <WorkIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Box>
                      <MDTypography variant="h6" fontWeight="medium">
                        Gestion des Offres
                      </MDTypography>
                      <Typography variant="body2" color="text.secondary">
                        {stats?.totalOffres || 0} offres • {stats?.offresPubliees || 0} publiées
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    Créez, modifiez et publiez des offres de stage avec leurs projets associés.
                  </Typography>

                  <Box display="flex" gap={1} mt={2}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      size="small"
                      onClick={() => navigate('/admin/offres')}
                    >
                      Gérer les offres
                    </MDButton>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate('/offres')}
                    >
                      Voir publiques
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Carte des utilisateurs */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <PeopleIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                    <Box>
                      <MDTypography variant="h6" fontWeight="medium">
                        Utilisateurs
                      </MDTypography>
                      <Typography variant="body2" color="text.secondary">
                        {stats?.totalAdmins || 0} admins • {stats?.totalClients || 0} clients
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    Gérez les comptes utilisateurs et leurs permissions d'accès.
                  </Typography>

                  <Box display="flex" gap={1} mt={2}>
                    <MDButton
                      variant="gradient"
                      color="success"
                      size="small"
                      onClick={() => navigate('/admin/profile')}
                    >
                      Mon Profil
                    </MDButton>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate('/auth/sign-up')}
                    >
                      Nouveau compte
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Carte des candidatures */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <PeopleIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                    <Box>
                      <MDTypography variant="h6" fontWeight="medium">
                        Candidatures
                      </MDTypography>
                      <Typography variant="body2" color="text.secondary">
                        {candidatureStats?.total || 0} candidatures • {candidatureStats?.enAttente || 0} en attente
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    Gérez les candidatures reçues et suivez leur statut.
                  </Typography>

                  <Box display="flex" gap={1} mt={2}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      size="small"
                      onClick={() => navigate('/admin/candidatures')}
                    >
                      Voir candidatures
                    </MDButton>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={loadStatistiques}
                    >
                      Actualiser
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Carte des projets */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <AssignmentIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                    <Box>
                      <MDTypography variant="h6" fontWeight="medium">
                        Projets de Stage
                      </MDTypography>
                      <Typography variant="body2" color="text.secondary">
                        {stats?.totalProjets || 0} projets disponibles
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    Consultez et gérez les projets de stage associés aux offres.
                  </Typography>

                  <Box display="flex" gap={1} mt={2}>
                    <MDButton
                      variant="gradient"
                      color="warning"
                      size="small"
                      onClick={() => navigate('/admin/offres')}
                    >
                      Voir projets
                    </MDButton>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={loadStatistiques}
                    >
                      Actualiser
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </MDBox>

        {/* Section des détails et activités récentes */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <OffresRecentes />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <StatistiquesDetaillees />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
