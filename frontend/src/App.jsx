import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CollaborateursPage from './pages/CollaborateursPage';
import FonctionsPage from './pages/FonctionsPage';
import AffectationsPage from './pages/AffectationsPage';

// Composant pour protéger les routes privées
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Composant pour rediriger les utilisateurs connectés
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Route par défaut - redirige vers login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Routes publiques */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />

            {/* Routes privées */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/restaurants"
              element={
                <PrivateRoute>
                  <RestaurantsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/restaurants/:id"
              element={
                <PrivateRoute>
                  <RestaurantDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/collaborateurs"
              element={
                <PrivateRoute>
                  <CollaborateursPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/fonctions"
              element={
                <PrivateRoute>
                  <FonctionsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/affectations"
              element={
                <PrivateRoute>
                  <AffectationsPage />
                </PrivateRoute>
              }
            />

            {/* Route 404 - redirige vers login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
