import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import AccepterAvecProjetModal from './AccepterAvecProjetModal';

function TestModal() {
  const [open, setOpen] = useState(false);
  
  const testCandidature = {
    id: 1,
    nom: 'Test',
    prenom: 'User',
    email: 'test@example.com',
    telephone: '0123456789',
    offreStage: {
      titre: 'Stage Test',
      entreprise: 'Entreprise Test'
    }
  };

  return (
    <Box p={3}>
      <Button 
        variant="contained" 
        onClick={() => {
          console.log('Test: Ouverture du modal');
          setOpen(true);
        }}
      >
        Tester le Modal
      </Button>
      
      <AccepterAvecProjetModal
        open={open}
        onClose={() => {
          console.log('Test: Fermeture du modal');
          setOpen(false);
        }}
        candidature={testCandidature}
        onSuccess={() => {
          console.log('Test: Succès du modal');
          setOpen(false);
        }}
      />
    </Box>
  );
}

export default TestModal;
