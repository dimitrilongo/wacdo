import axios from 'axios';

// Configuration de base d'Axios
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter automatiquement le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ne rediriger que si c'est une erreur d'authentification sur une route protégée
    // Pas sur la page de login elle-même
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Token expiré ou invalide
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  // Inscription
  register: async (userData) => {
    try {
      const response = await apiClient.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Connexion
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/login', credentials);
      const { token, user } = response.data;
      
      // Stocker le token et les infos utilisateur
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le stockage local même en cas d'erreur
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  // Obtenir les informations de l'utilisateur connecté
  me: async () => {
    try {
      const response = await apiClient.get('/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  // Obtenir l'utilisateur depuis le localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default apiClient;
