import axios from 'axios';

const API_BASE_URL = 'http://localhost:8090/api';

// Configuration axios avec intercepteur pour les tokens
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré, rediriger vers la page de connexion
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/auth/sign-in';
    }
    return Promise.reject(error);
  }
);

// ===== Services pour les Offres de Stage =====

export const offreStageService = {
  // CRUD Operations
  async creerOffre(offre) {
    const response = await apiClient.post('/offres', offre);
    return response.data;
  },

  async creerOffreAvecProjet(offre, projet) {
    const response = await apiClient.post('/offres/avec-projet', {
      offre,
      projet
    });
    return response.data;
  },

  async getAllOffres() {
    const response = await apiClient.get('/offres');
    return response.data;
  },

  async getOffresPubliees() {
    const response = await apiClient.get('/offres/publiees');
    return response.data;
  },

  async getOffresNonPubliees() {
    const response = await apiClient.get('/offres/non-publiees');
    return response.data;
  },

  async getOffreById(id) {
    const response = await apiClient.get(`/offres/${id}`);
    return response.data;
  },

  async modifierOffre(id, offre) {
    const response = await apiClient.put(`/offres/${id}`, offre);
    return response.data;
  },

  async supprimerOffre(id) {
    const response = await apiClient.delete(`/offres/${id}`);
    return response.data;
  },

  // Publication Operations
  async publierOffre(id) {
    const response = await apiClient.put(`/offres/${id}/publier`);
    return response.data;
  },

  async depublierOffre(id) {
    const response = await apiClient.put(`/offres/${id}/depublier`);
    return response.data;
  },

  // Search Operations
  async rechercherOffres(searchTerm) {
    const response = await apiClient.get(`/offres/recherche?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  },

  async rechercherOffresPubliees(searchTerm) {
    const response = await apiClient.get(`/offres/recherche/publiees?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  },

  async getOffresParLocalisation(localisation) {
    const response = await apiClient.get(`/offres/localisation/${encodeURIComponent(localisation)}`);
    return response.data;
  },

  async getOffresParDuree(duree) {
    const response = await apiClient.get(`/offres/duree/${duree}`);
    return response.data;
  },

  async getOffresRecentes() {
    const response = await apiClient.get('/offres/recentes');
    return response.data;
  },

  // Statistics
  async getStatistiques() {
    const response = await apiClient.get('/offres/statistiques');
    return response.data;
  }
};

// ===== Services pour les Projets de Stage =====

export const projetStageService = {
  // CRUD Operations
  async creerProjet(projet) {
    const response = await apiClient.post('/projets', projet);
    return response.data;
  },

  async getAllProjets() {
    const response = await apiClient.get('/projets');
    return response.data;
  },

  async getProjetsNonAssocies() {
    const response = await apiClient.get('/projets/non-associes');
    return response.data;
  },

  async getProjetsAvecOffresPubliees() {
    const response = await apiClient.get('/projets/avec-offres-publiees');
    return response.data;
  },

  async getProjetById(id) {
    const response = await apiClient.get(`/projets/${id}`);
    return response.data;
  },

  async modifierProjet(id, projet) {
    const response = await apiClient.put(`/projets/${id}`, projet);
    return response.data;
  },

  async supprimerProjet(id) {
    const response = await apiClient.delete(`/projets/${id}`);
    return response.data;
  },

  // Search Operations
  async rechercherProjets(searchTerm) {
    const response = await apiClient.get(`/projets/recherche?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  },

  async getProjetsParTitre(titre) {
    const response = await apiClient.get(`/projets/titre/${encodeURIComponent(titre)}`);
    return response.data;
  },

  async getProjetsParTechnologie(technologie) {
    const response = await apiClient.get(`/projets/technologie/${encodeURIComponent(technologie)}`);
    return response.data;
  },

  async getProjetsParCompetence(competence) {
    const response = await apiClient.get(`/projets/competence/${encodeURIComponent(competence)}`);
    return response.data;
  },

  // Statistics
  async getStatistiques() {
    const response = await apiClient.get('/projets/statistiques');
    return response.data;
  }
};

// ===== Utilitaires =====

export const formatDate = (dateString) => {
  if (!dateString) return 'Non défini';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDuree = (semaines) => {
  if (!semaines) return 'Non définie';
  if (semaines === 1) return '1 semaine';
  return `${semaines} semaines`;
};

export const getStatusColor = (estPublie) => {
  return estPublie ? 'success' : 'warning';
};

export const getStatusText = (estPublie) => {
  return estPublie ? 'Publiée' : 'Brouillon';
};

export default { offreStageService, projetStageService };
