import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Alert,
  Tabs,
  Tab,
  Box,
  Typography,
  Divider,
  Checkbox,
  FormGroup,
  FormLabel,
  Chip
} from '@mui/material';

import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';

import { offreStageService, projetStageService } from 'services/offreStageService';

// Liste des technologies disponibles par catégorie
const TECHNOLOGIES = {
  'Développement Web': [
    'React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'SASS/SCSS',
    'Bootstrap', 'Tailwind CSS', 'Material-UI', 'jQuery', 'Node.js', 'Express.js', 'Next.js'
  ],
  'Développement Mobile': [
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'Java', 'Xamarin', 'Ionic', 'Cordova'
  ],
  'Backend & API': [
    'Node.js', 'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'PHP', 'Laravel',
    'C#', '.NET', 'Ruby on Rails', 'Go', 'Rust', 'GraphQL', 'REST API'
  ],
  'Base de données': [
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
    'Firebase', 'Elasticsearch', 'Cassandra'
  ],
  'DevOps & Cloud': [
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Jenkins', 'GitLab CI',
    'GitHub Actions', 'Terraform', 'Ansible'
  ],
  'Marketing Digital': [
    'Google Analytics', 'Google Ads', 'Facebook Ads', 'SEO', 'SEM', 'Content Marketing',
    'Email Marketing', 'Social Media Marketing', 'HubSpot', 'Mailchimp', 'Hootsuite'
  ],
  'Design & UX/UI': [
    'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InVision', 'Zeplin',
    'Principle', 'Framer', 'Canva'
  ],
  'Data & Analytics': [
    'Python', 'R', 'SQL', 'Tableau', 'Power BI', 'Excel', 'Google Data Studio',
    'Apache Spark', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch'
  ],
  'Gestion de projet': [
    'Scrum', 'Agile', 'Kanban', 'Jira', 'Trello', 'Asana', 'Monday.com', 'Slack',
    'Microsoft Project', 'Notion'
  ],
  'Autres': [
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Linux', 'Windows', 'macOS', 'Bash',
    'PowerShell', 'Vim', 'VS Code', 'IntelliJ IDEA'
  ]
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function OffreStageForm({ open, onClose, offre = null, onSave }) {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // État pour l'offre
  const [offreData, setOffreData] = useState({
    titre: '',
    description: '',
    localisation: '',
    dureeSemaines: '',
    entreprise: '',
    contactEmail: '',
    salaireMensuel: ''
  });

  // État pour le projet (optionnel)
  const [includeProjet, setIncludeProjet] = useState(false);
  const [projetData, setProjetData] = useState({
    titre: '',
    description: '',
    technologiesUtilisees: [],
    objectifs: '',
    competencesRequises: ''
  });

  const isEdit = Boolean(offre);

  useEffect(() => {
    if (offre) {
      setOffreData({
        titre: offre.titre || '',
        description: offre.description || '',
        localisation: offre.localisation || '',
        dureeSemaines: offre.dureeSemaines || '',
        entreprise: offre.entreprise || '',
        contactEmail: offre.contactEmail || '',
        salaireMensuel: offre.salaireMensuel || ''
      });
      
      if (offre.projetStage) {
        setIncludeProjet(true);
        // Convertir la chaîne de technologies en tableau si nécessaire
        const technologies = offre.projetStage.technologiesUtilisees
          ? (typeof offre.projetStage.technologiesUtilisees === 'string'
              ? offre.projetStage.technologiesUtilisees.split(', ')
              : offre.projetStage.technologiesUtilisees)
          : [];

        setProjetData({
          titre: offre.projetStage.titre || '',
          description: offre.projetStage.description || '',
          technologiesUtilisees: technologies,
          objectifs: offre.projetStage.objectifs || '',
          competencesRequises: offre.projetStage.competencesRequises || ''
        });
      }
    } else {
      // Reset pour nouvelle offre
      setOffreData({
        titre: '',
        description: '',
        localisation: '',
        dureeSemaines: '',
        entreprise: '',
        contactEmail: '',
        salaireMensuel: ''
      });
      setProjetData({
        titre: '',
        description: '',
        technologiesUtilisees: [],
        objectifs: '',
        competencesRequises: ''
      });
      setIncludeProjet(false);
    }
    setActiveTab(0);
    setError('');
  }, [offre, open]);

  const handleOffreChange = (field) => (event) => {
    setOffreData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleProjetChange = (field) => (event) => {
    setProjetData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleTechnologyToggle = (technology) => {
    setProjetData(prev => ({
      ...prev,
      technologiesUtilisees: prev.technologiesUtilisees.includes(technology)
        ? prev.technologiesUtilisees.filter(tech => tech !== technology)
        : [...prev.technologiesUtilisees, technology]
    }));
  };

  const validateForm = () => {
    if (!offreData.titre.trim()) return 'Le titre est obligatoire';
    if (!offreData.description.trim()) return 'La description est obligatoire';
    if (!offreData.localisation.trim()) return 'La localisation est obligatoire';
    if (!offreData.dureeSemaines || offreData.dureeSemaines <= 0) return 'La durée doit être positive';
    
    if (includeProjet) {
      if (!projetData.titre.trim()) return 'Le titre du projet est obligatoire';
      if (!projetData.description.trim()) return 'La description du projet est obligatoire';
    }
    
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Préparer les données de l'offre
      const offreToSave = {
        ...offreData,
        dureeSemaines: parseInt(offreData.dureeSemaines),
        salaireMensuel: offreData.salaireMensuel ? parseFloat(offreData.salaireMensuel) : null
      };

      let savedOffre;

      if (isEdit) {
        // Modification d'une offre existante
        savedOffre = await offreStageService.modifierOffre(offre.id, offreToSave);
      } else {
        // Création d'une nouvelle offre
        if (includeProjet) {
          // Convertir le tableau de technologies en chaîne pour l'envoi
          const projetToSave = {
            ...projetData,
            technologiesUtilisees: projetData.technologiesUtilisees.join(', ')
          };
          savedOffre = await offreStageService.creerOffreAvecProjet(offreToSave, projetToSave);
        } else {
          savedOffre = await offreStageService.creerOffre(offreToSave);
        }
      }

      onSave(savedOffre);
      onClose();
    } catch (err) {
      setError('Erreur lors de la sauvegarde: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <MDTypography variant="h4" fontWeight="medium">
          {isEdit ? 'Modifier l\'offre de stage' : 'Nouvelle offre de stage'}
        </MDTypography>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
          <Tab label="Informations de l'offre" />
          <Tab label="Projet associé" />
        </Tabs>

        {/* Onglet 1: Informations de l'offre */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre de l'offre"
                value={offreData.titre}
                onChange={handleOffreChange('titre')}
                required
                error={!offreData.titre.trim() && error}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={offreData.description}
                onChange={handleOffreChange('description')}
                multiline
                rows={4}
                required
                error={!offreData.description.trim() && error}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Localisation"
                value={offreData.localisation}
                onChange={handleOffreChange('localisation')}
                required
                error={!offreData.localisation.trim() && error}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Durée (en semaines)"
                type="number"
                value={offreData.dureeSemaines}
                onChange={handleOffreChange('dureeSemaines')}
                required
                inputProps={{ min: 1 }}
                error={!offreData.dureeSemaines || offreData.dureeSemaines <= 0}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Entreprise"
                value={offreData.entreprise}
                onChange={handleOffreChange('entreprise')}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email de contact"
                type="email"
                value={offreData.contactEmail}
                onChange={handleOffreChange('contactEmail')}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Salaire mensuel (€)"
                type="number"
                value={offreData.salaireMensuel}
                onChange={handleOffreChange('salaireMensuel')}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Onglet 2: Projet associé */}
        <TabPanel value={activeTab} index={1}>
          <FormControlLabel
            control={
              <Switch
                checked={includeProjet}
                onChange={(e) => setIncludeProjet(e.target.checked)}
                disabled={isEdit && offre?.projetStage}
              />
            }
            label="Inclure un projet de stage"
            sx={{ mb: 3 }}
          />

          {includeProjet && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Titre du projet"
                  value={projetData.titre}
                  onChange={handleProjetChange('titre')}
                  required={includeProjet}
                  error={includeProjet && !projetData.titre.trim() && error}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description du projet"
                  value={projetData.description}
                  onChange={handleProjetChange('description')}
                  multiline
                  rows={4}
                  required={includeProjet}
                  error={includeProjet && !projetData.description.trim() && error}
                />
              </Grid>

              <Grid item xs={12}>
                <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Technologies utilisées
                </FormLabel>

                {/* Affichage des technologies sélectionnées */}
                {projetData.technologiesUtilisees.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Technologies sélectionnées :
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {projetData.technologiesUtilisees.map((tech) => (
                        <Chip
                          key={tech}
                          label={tech}
                          onDelete={() => handleTechnologyToggle(tech)}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Liste des technologies par catégorie */}
                {Object.entries(TECHNOLOGIES).map(([category, technologies]) => (
                  <Box key={category} sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                      {category}
                    </Typography>
                    <FormGroup row>
                      {technologies.map((tech) => (
                        <FormControlLabel
                          key={tech}
                          control={
                            <Checkbox
                              checked={projetData.technologiesUtilisees.includes(tech)}
                              onChange={() => handleTechnologyToggle(tech)}
                              size="small"
                            />
                          }
                          label={tech}
                          sx={{ minWidth: '200px', mr: 2 }}
                        />
                      ))}
                    </FormGroup>
                  </Box>
                ))}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Objectifs du projet"
                  value={projetData.objectifs}
                  onChange={handleProjetChange('objectifs')}
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Compétences requises"
                  value={projetData.competencesRequises}
                  onChange={handleProjetChange('competencesRequises')}
                  placeholder="Ex: Développement web, Base de données, Gestion de projet..."
                />
              </Grid>
            </Grid>
          )}

          {!includeProjet && (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                Cette offre n'aura pas de projet associé.
                Vous pourrez en ajouter un plus tard si nécessaire.
              </Typography>
            </Box>
          )}
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <MDButton
          variant="gradient"
          color="info"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Sauvegarde...' : (isEdit ? 'Modifier' : 'Créer')}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

export default OffreStageForm;
