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

// ===== Services pour les Statistiques =====

export const statistiquesService = {
  // Récupérer toutes les statistiques du dashboard
  async getStatistiquesDashboard() {
    const response = await apiClient.get('/statistiques/dashboard');
    return response.data;
  },

  // Récupérer les statistiques des offres
  async getStatistiquesOffres() {
    const response = await apiClient.get('/statistiques/offres');
    return response.data;
  },

  // Récupérer les statistiques des utilisateurs
  async getStatistiquesUtilisateurs() {
    const response = await apiClient.get('/statistiques/utilisateurs');
    return response.data;
  },

  // Récupérer les statistiques des projets
  async getStatistiquesProjets() {
    const response = await apiClient.get('/statistiques/projets');
    return response.data;
  }
};

export default statistiquesService;
