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

export const entretienService = {
  // Programmer un entretien (admin)
  async programmerEntretien(entretienData) {
    const response = await apiClient.post('/entretiens/programmer', entretienData);
    return response.data;
  },

  // Modifier un entretien (admin)
  async modifierEntretien(entretienId, entretienData) {
    const response = await apiClient.put(`/entretiens/${entretienId}`, entretienData);
    return response.data;
  },

  // Supprimer un entretien (admin)
  async supprimerEntretien(entretienId) {
    const response = await apiClient.delete(`/entretiens/${entretienId}`);
    return response.data;
  },

  // Récupérer un entretien par ID
  async getEntretienById(entretienId) {
    const response = await apiClient.get(`/entretiens/${entretienId}`);
    return response.data;
  },

  // Récupérer l'entretien d'une candidature
  async getEntretienByCandidature(candidatureId) {
    try {
      const response = await apiClient.get(`/entretiens/candidature/${candidatureId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // Pas d'entretien programmé
      }
      throw error;
    }
  },

  // Récupérer mes entretiens (client)
  async getMesEntretiens() {
    const response = await apiClient.get('/entretiens/mes-entretiens');
    return response.data;
  },

  // Récupérer mes entretiens à venir (client)
  async getMesEntretiensAVenir() {
    const response = await apiClient.get('/entretiens/mes-entretiens/a-venir');
    return response.data;
  },

  // Récupérer tous les entretiens à venir (admin)
  async getEntretiensAVenir() {
    const response = await apiClient.get('/entretiens/a-venir');
    return response.data;
  },

  // Récupérer les entretiens d'aujourd'hui (admin)
  async getEntretiensAujourdhui() {
    const response = await apiClient.get('/entretiens/aujourd-hui');
    return response.data;
  }
};

export default entretienService;
