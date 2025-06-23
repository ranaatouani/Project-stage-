import { useState, useEffect } from "react";
import { Card, CardContent, List, ListItem, ListItemText, ListItemIcon, Box, LinearProgress, Typography } from "@mui/material";
import { 
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon
} from "@mui/icons-material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Services
import { statistiquesService } from "services/statistiquesService";

function StatistiquesDetaillees() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistiques();
  }, []);

  const loadStatistiques = async () => {
    try {
      setLoading(true);
      const data = await statistiquesService.getStatistiquesDashboard();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const statistiquesItems = [
    {
      icon: <WorkIcon color="primary" />,
      label: "Offres publiées",
      value: stats?.offresPubliees || 0,
      total: stats?.totalOffres || 0,
      color: "primary"
    },
    {
      icon: <VisibilityIcon color="success" />,
      label: "Taux de publication",
      value: calculatePercentage(stats?.offresPubliees, stats?.totalOffres),
      total: 100,
      color: "success",
      suffix: "%"
    },
    {
      icon: <PeopleIcon color="info" />,
      label: "Utilisateurs actifs",
      value: stats?.totalUtilisateurs || 0,
      total: (stats?.totalUtilisateurs || 0) + 10, // Simulation d'un objectif
      color: "info"
    },
    {
      icon: <AssignmentIcon color="warning" />,
      label: "Projets avec offres",
      value: stats?.totalProjets || 0,
      total: (stats?.totalProjets || 0) + 5, // Simulation d'un objectif
      color: "warning"
    }
  ];

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MDTypography variant="h6" fontWeight="medium">
            Aperçu détaillé
          </MDTypography>
          <TrendingUpIcon color="primary" />
        </MDBox>

        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Chargement...
          </Typography>
        ) : (
          <List dense>
            {statistiquesItems.map((item, index) => (
              <ListItem key={index} sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                        <Typography variant="body2" fontWeight="medium">
                          {item.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.value}{item.suffix || ''} / {item.total}{item.suffix || ''}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={calculatePercentage(item.value, item.total)}
                        color={item.color}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        <MDBox mt={2} pt={2} borderTop="1px solid #e0e0e0">
          <Typography variant="caption" color="text.secondary">
            Dernière mise à jour: maintenant
          </Typography>
        </MDBox>
      </CardContent>
    </Card>
  );
}

export default StatistiquesDetaillees;
