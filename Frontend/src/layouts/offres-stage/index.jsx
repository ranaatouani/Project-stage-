import React, { useState } from 'react';
import { Grid, Card } from '@mui/material';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

// Composants pour les offres de stage
import OffreStageList from 'components/OffreStage/OffreStageList';
import OffreStageForm from 'components/OffreStage/OffreStageForm';
import OffreStageDetails from 'components/OffreStage/OffreStageDetails';

function OffresStage() {
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [refreshList, setRefreshList] = useState(0);

  const handleCreateNew = () => {
    setSelectedOffre(null);
    setFormOpen(true);
  };

  const handleEdit = (offre) => {
    setSelectedOffre(offre);
    setFormOpen(true);
  };

  const handleView = (offre) => {
    setSelectedOffre(offre);
    setDetailsOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedOffre(null);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setSelectedOffre(null);
  };

  const handleSave = () => {
    // Rafraîchir la liste après sauvegarde
    setRefreshList(prev => prev + 1);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Gestion des Offres de Stage
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={3} pb={1}>
                <OffreStageList
                  key={refreshList}
                  onCreateNew={handleCreateNew}
                  onEdit={handleEdit}
                  onView={handleView}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Formulaire de création/modification */}
      <OffreStageForm
        open={formOpen}
        onClose={handleFormClose}
        offre={selectedOffre}
        onSave={handleSave}
      />

      {/* Dialog de détails */}
      <OffreStageDetails
        open={detailsOpen}
        onClose={handleDetailsClose}
        offre={selectedOffre}
      />

      <Footer />
    </DashboardLayout>
  );
}

export default OffresStage;
