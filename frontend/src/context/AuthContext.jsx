import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user');
      
      if (authToken && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
        setToken(authToken);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Fonction de connexion
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      setUser(response.user);
      setIsAuthenticated(true);
      setToken(response.token);
      
      return response;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setToken(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setToken(null);
      setLoading(false);
    }
  };

  // Fonction pour rafraîchir les infos utilisateur
  const refreshUser = async () => {
    try {
      const response = await authService.me();
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      console.error('Erreur lors de la récupération des infos utilisateur:', error);
      logout(); // Déconnecter si erreur
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    token,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};