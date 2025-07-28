import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon
} from '@mui/icons-material';

import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import AccepterAvecProjetModal from './AccepterAvecProjetModal';

function CandidatureDetailsModalTest({ open, onClose, candidature, onChangeStatut }) {
  console.log('🔄 CandidatureDetailsModalTest rendu');
  
  const [showAccepterAvecProjetModal, setShowAccepterAvecProjetModal] = useState(false);

  if (!candidature) {
    console.log('Pas de candidature, retour null');
    return null;
  }

  const getStatutLabel = (statut) => {
    switch (statut) {
      case 'EN_ATTENTE': return 'En attente';
      case 'ACCEPTEE': return 'Acceptée';
      case 'REFUSEE': return 'Refusée';
      case 'ENTRETIEN': return 'Entretien programmé';
      default: return statut;
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'EN_ATTENTE': return 'warning';
      case 'ACCEPTEE': return 'success';
      case 'REFUSEE': return 'error';
      case 'ENTRETIEN': return 'info';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold">
              Détails de la candidature (Test)
            </MDTypography>
            <Chip 
              label={getStatutLabel(candidature.statut)} 
              color={getStatutColor(candidature.statut)}
              sx={{ mt: 1 }}
            />
          </MDBox>
          <IconButton onClick={onClose} size="large">
            <CloseIcon />
          </IconButton>
        </MDBox>
      </DialogTitle>

      <DialogContent>
        <Box p={2}>
          <Typography variant="h6">
            {candidature.nom} {candidature.prenom}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {candidature.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {candidature.telephone}
          </Typography>
          
          {candidature.offreStage && (
            <Box mt={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Offre : {candidature.offreStage.titre}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <MDButton
          variant="outlined"
          color="secondary"
          onClick={onClose}
        >
          Fermer
        </MDButton>

        {candidature.statut === 'EN_ATTENTE' && (
          <>
            <MDButton
              variant="gradient"
              color="info"
              onClick={() => {
                console.log('🎯 BOUTON TEST CLIQUÉ - Ouverture du modal de projet');
                setShowAccepterAvecProjetModal(true);
              }}
              sx={{ mr: 1 }}
            >
              Accepter avec Projet
            </MDButton>
            <MDButton
              variant="outlined"
              color="success"
              onClick={() => {
                console.log('⚠️ BOUTON TEST CLIQUÉ - Acceptation sans projet');
                onChangeStatut('ACCEPTEE');
              }}
              sx={{ mr: 1 }}
            >
              Accepter sans projet
            </MDButton>
            <MDButton
              variant="gradient"
              color="error"
              onClick={() => onChangeStatut('REFUSEE')}
            >
              Refuser
            </MDButton>
          </>
        )}
      </DialogActions>

      {/* Modal pour accepter avec projet */}
      <AccepterAvecProjetModal
        open={showAccepterAvecProjetModal}
        onClose={() => {
          console.log('Fermeture du modal AccepterAvecProjetModal');
          setShowAccepterAvecProjetModal(false);
        }}
        candidature={candidature}
        onSuccess={() => {
          console.log('Succès du modal AccepterAvecProjetModal');
          setShowAccepterAvecProjetModal(false);
          onChangeStatut('ACCEPTEE');
        }}
      />
    </Dialog>
  );
}

export default CandidatureDetailsModalTest;
