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

// ===== Services pour les Candidatures =====

export const candidatureService = {
  // Soumettre une candidature
  async soumettreCandidature(formData) {
    const response = await axios.post(`${API_BASE_URL}/candidatures/soumettre`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    return response.data;
  },

  // Récupérer les candidatures pour une offre (admin)
  async getCandidaturesPourOffre(offreStageId) {
    const response = await apiClient.get(`/candidatures/offre/${offreStageId}`);
    return response.data;
  },

  // Récupérer mes candidatures (utilisateur connecté)
  async getMesCandidatures() {
    const response = await apiClient.get('/candidatures/mes-candidatures');
    return response.data;
  },

  // Récupérer toutes les candidatures (admin)
  async getToutesCandidatures() {
    const response = await apiClient.get('/candidatures/toutes');
    return response.data;
  },

  // Récupérer une candidature par ID
  async getCandidatureById(id) {
    const response = await apiClient.get(`/candidatures/${id}`);
    return response.data;
  },

  // Changer le statut d'une candidature (admin)
  async changerStatutCandidature(candidatureId, statut) {
    const response = await apiClient.put(`/candidatures/${candidatureId}/statut`, {
      statut: statut
    });
    return response.data;
  },

  // Accepter une candidature avec assignation de projet (admin)
  async accepterCandidatureAvecProjet(data) {
    const response = await apiClient.post('/candidatures/accepter-avec-projet', data);
    return response.data;
  },

  // Supprimer une candidature (admin)
  async supprimerCandidature(candidatureId) {
    const response = await apiClient.delete(`/candidatures/${candidatureId}`);
    return response.data;
  },

  // Rechercher des candidatures (admin)
  async rechercherCandidatures(searchTerm) {
    const response = await apiClient.get(`/candidatures/recherche?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  },

  // Récupérer les statistiques des candidatures (admin)
  async getStatistiquesCandidatures() {
    const response = await apiClient.get('/candidatures/statistiques');
    return response.data;
  },

  // Debug: lister les fichiers CV (à supprimer en production)
  async debugListCVFiles() {
    const response = await apiClient.get('/candidatures/debug/cv-files');
    return response.data;
  }
};

export default candidatureService;
