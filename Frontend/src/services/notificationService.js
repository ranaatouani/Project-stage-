import axios from 'axios';

const API_BASE_URL = 'http://localhost:8090/api';

// Configuration d'axios avec intercepteur pour le token
const apiClient = axios.create({
  baseURL: API_BASE_URL,
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
      // Token expiré ou invalide
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/authentication/sign-in';
    }
    return Promise.reject(error);
  }
);

export const notificationService = {
  // Récupérer toutes les notifications
  async getMesNotifications() {
    const response = await apiClient.get('/notifications');
    return response.data;
  },

  // Récupérer les notifications non lues
  async getNotificationsNonLues() {
    const response = await apiClient.get('/notifications/non-lues');
    return response.data;
  },

  // Compter les notifications non lues
  async getCountNotificationsNonLues() {
    const response = await apiClient.get('/notifications/count-non-lues');
    return response.data.count;
  },

  // Marquer une notification comme lue
  async marquerCommeLue(notificationId) {
    const response = await apiClient.put(`/notifications/${notificationId}/marquer-lue`);
    return response.data;
  },

  // Marquer toutes les notifications comme lues
  async marquerToutesCommeLues() {
    const response = await apiClient.put('/notifications/marquer-toutes-lues');
    return response.data;
  }
};
