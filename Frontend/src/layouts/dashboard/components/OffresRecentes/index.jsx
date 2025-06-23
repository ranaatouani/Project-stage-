import { useState, useEffect } from "react";
import { Card, CardContent, List, ListItem, ListItemText, ListItemIcon, Chip, Box, Typography, Divider } from "@mui/material";
import { Work as WorkIcon, Visibility as VisibilityIcon, Edit as EditIcon } from "@mui/icons-material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Services
import { offreStageService } from "services/offreStageService";

function OffresRecentes() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffresRecentes();
  }, []);

  const loadOffresRecentes = async () => {
    try {
      setLoading(true);
      const data = await offreStageService.getAllOffres();
      // Prendre les 5 dernières offres
      const offresRecentes = data.slice(-5).reverse();
      setOffres(offresRecentes);
    } catch (error) {
      console.error('Erreur lors du chargement des offres récentes:', error);
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
    });
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MDTypography variant="h6" fontWeight="medium">
            Offres récentes
          </MDTypography>
          <WorkIcon color="primary" />
        </MDBox>

        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Chargement...
          </Typography>
        ) : offres.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Aucune offre disponible
          </Typography>
        ) : (
          <List dense>
            {offres.map((offre, index) => (
              <Box key={offre.id}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <WorkIcon color={offre.estPublie ? "success" : "warning"} fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" fontWeight="medium" noWrap sx={{ maxWidth: '60%' }}>
                          {offre.titre}
                        </Typography>
                        <Chip
                          label={offre.estPublie ? "Publiée" : "Brouillon"}
                          size="small"
                          color={offre.estPublie ? "success" : "warning"}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {offre.localisation} • {offre.dureeSemaines} semaines
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          Créée le {formatDate(offre.dateCreation)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < offres.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}

        <MDBox mt={2} pt={2} borderTop="1px solid #e0e0e0">
          <Typography variant="caption" color="text.secondary">
            {offres.length} offre{offres.length > 1 ? 's' : ''} récente{offres.length > 1 ? 's' : ''}
          </Typography>
        </MDBox>
      </CardContent>
    </Card>
  );
}

export default OffresRecentes;
