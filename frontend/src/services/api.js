import axios from 'axios';

// Configuration de base d'Axios
const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Pour Sanctum
});

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Erreur API:', error);
        return Promise.reject(error);
    }
);

// Services API
export const apiService = {
    // Test de connexion à l'API
    testConnection: async () => {
        try {
            const response = await apiClient.get('/test');
            return response.data;
        } catch (error) {
            throw new Error('Impossible de se connecter à l\'API');
        }
    },

    // Récupérer des données de test
    getData: async () => {
        try {
            const response = await apiClient.get('/data');
            return response.data;
        } catch {
            throw new Error('Erreur lors de la récupération des données');
        }
    },

    // Exemple d'authentification (à implémenter côté Laravel)
    login: async (credentials) => {
        try {
            const response = await apiClient.post('/login', credentials);
            return response.data;
        } catch {
            throw new Error('Erreur de connexion');
        }
    },

    // Exemple d'inscription (à implémenter côté Laravel)
    register: async (userData) => {
        try {
            const response = await apiClient.post('/register', userData);
            return response.data;
        } catch {
            throw new Error('Erreur lors de l\'inscription');
        }
    }
};

export default apiClient;