// Service d'authentification centralisé
class AuthService {
  constructor() {
    this.baseURL = 'http://localhost:8090/api/auth';
  }

  // Récupérer le token depuis localStorage
  getToken() {
    return localStorage.getItem('accessToken');
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    const token = this.getToken();
    return token !== null && token !== undefined;
  }

  // Récupérer les informations de l'utilisateur connecté
  async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Aucun token trouvé');
      }

      const response = await fetch(`${this.baseURL}/user-info`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations utilisateur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur getCurrentUser:', error);
      throw error;
    }
  }

  // Connexion
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de connexion');
      }

      const data = await response.json();
      
      // Stocker les tokens
      if (data.access_token) {
        localStorage.setItem('accessToken', data.access_token);
      }
      if (data.refresh_token) {
        localStorage.setItem('refreshToken', data.refresh_token);
      }

      return data;
    } catch (error) {
      console.error('Erreur login:', error);
      throw error;
    }
  }

  // Inscription
  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur d\'inscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur register:', error);
      throw error;
    }
  }

  // Mise à jour du profil
  async updateProfile(profileData) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Aucun token trouvé');
      }

      const response = await fetch(`${this.baseURL}/update-profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de mise à jour');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur updateProfile:', error);
      throw error;
    }
  }

  // Déconnexion
  logout() {
    // Supprimer les tokens du localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Optionnel: Appeler l'endpoint de déconnexion côté serveur
    // pour invalider le token côté serveur aussi

    // Rediriger vers la page d'accueil
    window.location.href = '/';
  }

  // Vérifier si l'utilisateur est admin
  async isAdmin() {
    try {
      const user = await this.getCurrentUser();
      return user.role === 'ADMIN';
    } catch (error) {
      return false;
    }
  }

  // Décoder le token JWT (basique, sans vérification de signature)
  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

  // Vérifier si le token est expiré
  isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;

    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }
}

// Exporter une instance unique (singleton)
const authService = new AuthService();
export default authService;
