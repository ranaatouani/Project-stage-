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

export const stageService = {
  // Créer un stage à partir d'une candidature (Admin)
  async creerStageDepuisCandidature(candidatureId) {
    const response = await apiClient.post(`/stages/creer-depuis-candidature/${candidatureId}`);
    return response.data;
  },

  // Récupérer tous les stages (Admin)
  async getAllStages() {
    const response = await apiClient.get('/stages/admin/tous');
    return response.data;
  },

  // Récupérer les stages en cours (Admin)
  async getStagesEnCours() {
    const response = await apiClient.get('/stages/admin/en-cours');
    return response.data;
  },

  // Récupérer les stages terminés (Admin)
  async getStagesTermines() {
    const response = await apiClient.get('/stages/admin/termines');
    return response.data;
  },

  // Récupérer les statistiques des stages (Admin)
  async getStageStats() {
    const response = await apiClient.get('/stages/admin/statistiques');
    return response.data;
  },

  // Changer le statut d'un stage (Admin)
  async changerStatutStage(stageId, statut, commentaires = '') {
    const response = await apiClient.put(`/stages/admin/${stageId}/statut`, {
      statut,
      commentaires
    });
    return response.data;
  },

  // Mettre à jour les dates d'un stage (Admin)
  async mettreAJourDatesStage(stageId, dateDebut, dateFin) {
    const response = await apiClient.put(`/stages/admin/${stageId}/dates`, {
      dateDebut,
      dateFin
    });
    return response.data;
  },

  // Récupérer mes stages (Client)
  async getMesStages() {
    const response = await apiClient.get('/stages/mes-stages');
    return response.data;
  },

  // Télécharger l'attestation de stage (client)
  async telechargerAttestation(stageId) {
    const response = await apiClient.get(`/stages/${stageId}/attestation`, {
      responseType: 'blob'
    });

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    // Extraire le nom du fichier depuis les headers
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'Attestation_Stage.pdf';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return response;
  },

  // Récupérer un stage par ID
  async getStageById(stageId) {
    const response = await apiClient.get(`/stages/${stageId}`);
    return response.data;
  },

  // Supprimer un stage (Admin)
  async supprimerStage(stageId) {
    const response = await apiClient.delete(`/stages/admin/${stageId}`);
    return response.data;
  }
};

export default stageService;
