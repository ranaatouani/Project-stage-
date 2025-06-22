import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  Container,
  AppBar,
  Toolbar,
  Button,
  Paper,
  Avatar,
  Divider,
  Link
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  Visibility as VisibilityIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon
} from '@mui/icons-material';

import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';

import { offreStageService, formatDate, formatDuree } from 'services/offreStageService';
import OffreStageDetails from 'components/OffreStage/OffreStageDetails';

function OffresPubliques() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOffres, setFilteredOffres] = useState([]);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    loadOffresPubliees();
  }, []);

  useEffect(() => {
    // Filtrer les offres en fonction du terme de recherche
    if (searchTerm.trim() === '') {
      setFilteredOffres(offres);
    } else {
      const filtered = offres.filter(offre =>
        offre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.localisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (offre.entreprise && offre.entreprise.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredOffres(filtered);
    }
  }, [searchTerm, offres]);

  const loadOffresPubliees = async () => {
    try {
      setLoading(true);
      // Utiliser l'endpoint public pour les offres publiées
      const response = await fetch('http://localhost:8090/api/offres/publiees');
      const data = await response.json();
      setOffres(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des offres: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const response = await fetch(`http://localhost:8090/api/offres/recherche/publiees?q=${encodeURIComponent(searchTerm)}`);
        const results = await response.json();
        setOffres(results);
      } catch (err) {
        setError('Erreur lors de la recherche: ' + err.message);
      }
    } else {
      loadOffresPubliees();
    }
  };

  const handleView = (offre) => {
    setSelectedOffre(offre);
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setSelectedOffre(null);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" textAlign="center">
          Chargement des offres de stage...
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#f5f5f5',
      width: '100vw',
      margin: 0,
      padding: 0,
      overflowX: 'hidden'
    }}>
      {/* Navigation Header */}
      <AppBar position="static" sx={{ bgcolor: '#1976d2', boxShadow: 3 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <WorkIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h5" component="div" fontWeight="bold">
              StageConnect
            </Typography>
          </Box>

          <Box display="flex" gap={3}>
            <Button
              color="inherit"
              sx={{
                textTransform: 'none',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#ffffff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  transform: 'scale(1.05)'
                }
              }}
            >
              Accueil
            </Button>
            <Button
              color="inherit"
              sx={{
                textTransform: 'none',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#ffffff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  transform: 'scale(1.05)'
                }
              }}
            >
              À propos
            </Button>
            <Button
              color="inherit"
              sx={{
                textTransform: 'none',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#ffffff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  transform: 'scale(1.05)'
                }
              }}
            >
              Contact
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              href="/auth/sign-in"
              sx={{
                textTransform: 'none',
                fontSize: '16px',
                borderColor: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Connexion
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
          width: '100%'
        }}
      >
        <Box sx={{ px: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Trouvez Votre Stage Idéal
          </Typography>
          <Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.9 }}>
            Découvrez des opportunités de stage exceptionnelles et lancez votre carrière professionnelle
          </Typography>

          {/* Barre de recherche hero */}
          <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Rechercher par titre, localisation ou entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch} sx={{ color: 'primary.main' }}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* Statistiques */}
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={6} md={3}>
              <Box>
                <Typography variant="h3" fontWeight="bold">
                  {filteredOffres.length}
                </Typography>
                <Typography variant="body1">
                  Offres Disponibles
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box>
                <Typography variant="h3" fontWeight="bold">
                  50+
                </Typography>
                <Typography variant="body1">
                  Entreprises Partenaires
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box>
                <Typography variant="h3" fontWeight="bold">
                  200+
                </Typography>
                <Typography variant="body1">
                  Étudiants Placés
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box>
                <Typography variant="h3" fontWeight="bold">
                  95%
                </Typography>
                <Typography variant="body1">
                  Taux de Satisfaction
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Section À propos */}
      <Box sx={{ py: 8, width: '100%', bgcolor: '#f8faff' }}>
        <Box sx={{ px: 4 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
          Pourquoi Choisir StageConnect ?
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Notre plateforme connecte les étudiants talentueux avec les meilleures opportunités de stage
        </Typography>

        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          <Grid item xs={12} sm={6} md={4} display="flex">
            <Card sx={{
              height: '100%',
              textAlign: 'center',
              p: 3,
              boxShadow: 3,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              width: '100%'
            }}>
              <Avatar sx={{ bgcolor: '#1976d2', mx: 'auto', mb: 2, width: 64, height: 64 }}>
                <WorkIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" gutterBottom fontWeight="bold" color="#1976d2">
                Opportunités Variées
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Des stages dans tous les domaines : informatique, marketing, finance, ingénierie et bien plus encore.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} display="flex">
            <Card sx={{
              height: '100%',
              textAlign: 'center',
              p: 3,
              boxShadow: 3,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              width: '100%'
            }}>
              <Avatar sx={{ bgcolor: '#42a5f5', mx: 'auto', mb: 2, width: 64, height: 64 }}>
                <SchoolIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" gutterBottom fontWeight="bold" color="#1976d2">
                Accompagnement Personnalisé
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Notre équipe vous accompagne dans votre recherche et vous aide à décrocher le stage de vos rêves.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} display="flex">
            <Card sx={{
              height: '100%',
              textAlign: 'center',
              p: 3,
              boxShadow: 3,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              width: '100%'
            }}>
              <Avatar sx={{ bgcolor: '#90caf9', mx: 'auto', mb: 2, width: 64, height: 64 }}>
                <TrendingUpIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" gutterBottom fontWeight="bold" color="#1976d2">
                Évolution de Carrière
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Nos stages offrent de vraies perspectives d'évolution et souvent des opportunités d'embauche.
              </Typography>
            </Card>
          </Grid>
        </Grid>
        </Box>
      </Box>

      {/* Section des Offres */}
      <Box sx={{ bgcolor: 'white', py: 8, width: '100%' }}>
        <Box sx={{ px: 4 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
            Offres de Stage Disponibles
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            Découvrez les opportunités qui vous attendent
          </Typography>

          {/* Messages d'erreur */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Statistiques des offres */}
          <Box mb={4} textAlign="center">
            <Chip
              label={`${filteredOffres.length} offre${filteredOffres.length > 1 ? 's' : ''} disponible${filteredOffres.length > 1 ? 's' : ''}`}
              sx={{
                fontSize: '16px',
                py: 2,
                px: 3,
                bgcolor: '#1976d2',
                color: 'white',
                fontWeight: 'bold'
              }}
              size="large"
            />
          </Box>

        {/* Liste des offres */}
        <Grid container spacing={3}>
          {filteredOffres.map((offre) => (
            <Grid item xs={12} md={6} lg={4} key={offre.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Header de la carte */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="h2" sx={{ flexGrow: 1, mr: 1 }}>
                      {offre.titre}
                    </Typography>
                    <Chip
                      label="Disponible"
                      color="success"
                      size="small"
                    />
                  </Box>

                  {/* Description */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {offre.description.length > 150
                      ? `${offre.description.substring(0, 150)}...`
                      : offre.description}
                  </Typography>

                  {/* Informations détaillées */}
                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <LocationIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">{offre.localisation}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <ScheduleIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">{formatDuree(offre.dureeSemaines)}</Typography>
                    </Box>
                    {offre.entreprise && (
                      <Box display="flex" alignItems="center" mb={1}>
                        <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">{offre.entreprise}</Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Date de publication */}
                  <Typography variant="caption" color="text.secondary">
                    Publiée le {formatDate(offre.datePublication)}
                  </Typography>
                </CardContent>

                {/* Action */}
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleView(offre)}
                    sx={{
                      bgcolor: '#1976d2',
                      color: '#000000',
                      fontWeight: 'bold',
                      '&:hover': {
                        bgcolor: '#1565c0',
                        transform: 'translateY(-1px)',
                        boxShadow: 3
                      },
                      '& .MuiSvgIcon-root': {
                        color: '#000000'
                      }
                    }}
                  >
                    Voir les détails
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Message si aucune offre */}
          {filteredOffres.length === 0 && !loading && (
            <Box textAlign="center" py={6}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchTerm ? 'Aucune offre trouvée pour cette recherche' : 'Aucune offre de stage disponible pour le moment'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revenez bientôt pour découvrir de nouvelles opportunités !
              </Typography>
            </Box>
          )}

          {/* Dialog de détails */}
          <OffreStageDetails
            open={detailsOpen}
            onClose={handleDetailsClose}
            offre={selectedOffre}
          />
        </Box>
      </Box>

      {/* Section Témoignages */}
      <Box sx={{ bgcolor: '#e3f2fd', py: 8, width: '100%' }}>
        <Box sx={{ px: 4 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
            Ce que disent nos étudiants
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            Découvrez les expériences de ceux qui ont trouvé leur stage grâce à StageConnect
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 3, boxShadow: 3, borderRadius: 3, border: '1px solid #e3f2fd' }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>M</Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="#1976d2">Marie Dubois</Typography>
                    <Typography variant="body2" color="text.secondary">Étudiante en Marketing</Typography>
                  </Box>
                </Box>
                <Typography variant="body1" style={{ fontStyle: 'italic' }} color="text.secondary">
                  "Grâce à StageConnect, j'ai trouvé un stage incroyable dans une startup innovante.
                  L'équipe m'a accompagnée tout au long du processus !"
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 3, boxShadow: 3, borderRadius: 3, border: '1px solid #e3f2fd' }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: '#42a5f5', mr: 2 }}>A</Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="#1976d2">Ahmed Ben Ali</Typography>
                    <Typography variant="body2" color="text.secondary">Étudiant en Informatique</Typography>
                  </Box>
                </Box>
                <Typography variant="body1" style={{ fontStyle: 'italic' }} color="text.secondary">
                  "Mon stage de développement web s'est transformé en CDI ! StageConnect a vraiment
                  changé ma vie professionnelle."
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 3, boxShadow: 3, borderRadius: 3, border: '1px solid #e3f2fd' }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: '#90caf9', mr: 2 }}>S</Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="#1976d2">Sophie Martin</Typography>
                    <Typography variant="body2" color="text.secondary">Étudiante en Finance</Typography>
                  </Box>
                </Box>
                <Typography variant="body1" style={{ fontStyle: 'italic' }} color="text.secondary">
                  "Une plateforme intuitive et des offres de qualité. J'ai trouvé mon stage
                  en banque d'investissement en seulement 2 semaines !"
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: '#1565c0', color: 'white', py: 6, mt: 'auto', width: '100%' }}>
        <Box sx={{ px: 4 }}>
          <Grid container spacing={4}>
            {/* À propos */}
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" mb={2}>
                <WorkIcon sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h6" fontWeight="bold">
                  StageConnect
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                La plateforme de référence pour connecter les étudiants avec les meilleures opportunités de stage.
                Nous facilitons votre transition vers le monde professionnel.
              </Typography>
              <Box display="flex" gap={1}>
                <IconButton color="inherit" size="small">
                  <FacebookIcon />
                </IconButton>
                <IconButton color="inherit" size="small">
                  <TwitterIcon />
                </IconButton>
                <IconButton color="inherit" size="small">
                  <LinkedInIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* Liens rapides */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Liens Rapides
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Link href="#" color="inherit" underline="hover">
                  Accueil
                </Link>
                <Link href="#" color="inherit" underline="hover">
                  Offres de Stage
                </Link>
                <Link href="#" color="inherit" underline="hover">
                  À propos de nous
                </Link>
                <Link href="#" color="inherit" underline="hover">
                  Comment ça marche
                </Link>
                <Link href="/auth/sign-in" color="inherit" underline="hover">
                  Espace Admin
                </Link>
              </Box>
            </Grid>

            {/* Contact */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Contactez-nous
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" alignItems="center">
                  <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    contact@stageconnect.com
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <PhoneIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    +33 1 23 45 67 89
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <LocationIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    123 Rue de l'Innovation<br />
                    75001 Paris, France
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.2)' }} />

          <Box textAlign="center">
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              © 2024 StageConnect. Tous droits réservés. |
              <Link href="#" color="inherit" underline="hover" sx={{ ml: 1 }}>
                Politique de confidentialité
              </Link> |
              <Link href="#" color="inherit" underline="hover" sx={{ ml: 1 }}>
                Conditions d'utilisation
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default OffresPubliques;
