import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LogOut, Store, Users, Briefcase, Search } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AffectationsPage() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
  const [affectations, setAffectations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // États pour les filtres
  const [filterCollaborateur, setFilterCollaborateur] = useState('');
  const [filterVille, setFilterVille] = useState('');
  const [filterRestaurant, setFilterRestaurant] = useState('');
  const [filterPoste, setFilterPoste] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  
  // Listes pour les dropdowns
  const [restaurants, setRestaurants] = useState([]);
  const [postes, setPostes] = useState([]);

  // Fonction pour récupérer toutes les affectations
  const fetchAffectations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/affectations`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAffectations(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des affectations:', err);
      alert('Erreur lors du chargement des affectations');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les restaurants
  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/restaurants`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRestaurants(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des restaurants:', err);
    }
  };

  // Fonction pour récupérer les postes
  const fetchPostes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/postes`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPostes(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des postes:', err);
    }
  };

  useEffect(() => {
    fetchAffectations();
    fetchRestaurants();
    fetchPostes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fonction pour filtrer les affectations
  const filteredAffectations = affectations.filter(affectation => {
    if (!affectation.user || !affectation.restaurant || !affectation.poste) {
      return false;
    }

    // Filtre par collaborateur (nom ou email)
    if (filterCollaborateur) {
      const searchTerm = filterCollaborateur.toLowerCase();
      const nomComplet = `${affectation.user.nom} ${affectation.user.prenom}`.toLowerCase();
      const email = affectation.user.email.toLowerCase();
      if (!nomComplet.includes(searchTerm) && !email.includes(searchTerm)) {
        return false;
      }
    }
    // Filtre par restaurant
    if (filterVille && affectation.restaurant.ville !== filterVille) {
      return false;
    }
    // Filtre par restaurant
    if (filterRestaurant && affectation.restaurant.id !== parseInt(filterRestaurant)) {
      return false;
    }

    // Filtre par poste
    if (filterPoste && affectation.poste.id !== parseInt(filterPoste)) {
      return false;
    }

    // Filtre par statut
    if (filterStatut) {
      const now = new Date();
      const dateDebut = new Date(affectation.date_debut);
      const dateFin = affectation.date_fin ? new Date(affectation.date_fin) : null;
      const isEnCours = dateDebut <= now && (!dateFin || dateFin >= now);
      const isTerminee = dateFin && dateFin < now;
      const isAVenir = dateDebut > now;

      if (filterStatut === 'en_cours' && !isEnCours) return false;
      if (filterStatut === 'terminee' && !isTerminee) return false;
      if (filterStatut === 'a_venir' && !isAVenir) return false;
    }

    return true;
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">🍟</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">WACDO</h1>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-red-600 transition-colors">
                Dashboard
              </button>
              <button onClick={() => navigate('/restaurants')} className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                <Store className="h-4 w-4" />
                <span>Restaurants</span>
              </button>
              <button onClick={() => navigate('/collaborateurs')} className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                <Users className="h-4 w-4" />
                <span>Collaborateurs</span>
              </button>
              <button onClick={() => navigate('/fonctions')} className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                <Briefcase className="h-4 w-4" />
                <span>Fonctions</span>
              </button>
              <button onClick={() => navigate('/affectations')} className="flex items-center space-x-2 text-red-600 font-medium">
                <Search className="h-4 w-4" />
                <span>Affectations</span>
              </button>
            </nav>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Bonjour, <span className="font-medium">{user?.nom_complet}</span>
              </span>
              <Button 
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Se déconnecter</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Toutes les affectations ({filteredAffectations.length})
            </h1>
          </div>

          {/* Formulaire de recherche */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres de recherche</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collaborateur
                </label>
                <input
                  type="text"
                  value={filterCollaborateur}
                  onChange={(e) => setFilterCollaborateur(e.target.value)}
                  placeholder="Nom"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

				<div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <select
                  value={filterVille}
                  onChange={(e) => setFilterVille(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Toutes les villes</option>
                  {restaurants.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.ville}>
                      {restaurant.ville}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant
                </label>
                <select
                  value={filterRestaurant}
                  onChange={(e) => setFilterRestaurant(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Tous les restaurants</option>
                  {restaurants.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poste
                </label>
                <select
                  value={filterPoste}
                  onChange={(e) => setFilterPoste(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Tous les postes</option>
                  {postes.map(poste => (
                    <option key={poste.id} value={poste.id}>
                      {poste.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  value={filterStatut}
                  onChange={(e) => setFilterStatut(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Tous les statuts</option>
                  <option value="en_cours">En cours</option>
                  <option value="a_venir">À venir</option>
                  <option value="terminee">Terminée</option>
                </select>
              </div>
            </div>

            {/* Bouton pour réinitialiser les filtres */}
            {(filterCollaborateur || filterRestaurant || filterPoste || filterStatut) && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilterCollaborateur('');
                    setFilterRestaurant('');
                    setFilterPoste('');
                    setFilterStatut('');
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Chargement des affectations...
            </div>
          ) : filteredAffectations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {affectations.length === 0 ? 
                "Aucune affectation enregistrée" :
                "Aucune affectation ne correspond aux filtres"
              }
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Collaborateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Restaurant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Poste
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date de début
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date de fin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAffectations.map((affectation) => {
                    // Vérification de sécurité
                    if (!affectation.user || !affectation.restaurant || !affectation.poste) {
                      return null;
                    }

                    // Déterminer si l'affectation est en cours
                    const now = new Date();
                    const dateDebut = new Date(affectation.date_debut);
                    const dateFin = affectation.date_fin ? new Date(affectation.date_fin) : null;
                    const isEnCours = dateDebut <= now && (!dateFin || dateFin >= now);
                    
                    return (
                      <tr key={affectation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">
                                {affectation.user.prenom?.charAt(0).toUpperCase() || '?'}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {affectation.user.nom} {affectation.user.prenom}
                              </div>
                              <div className="text-sm text-gray-500">
                                {affectation.user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Store className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {affectation.restaurant.nom}
                              </div>
                              <div className="text-sm text-gray-500">
                                {affectation.restaurant.ville}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            {affectation.poste.nom}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(affectation.date_debut).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {affectation.date_fin ? 
                            new Date(affectation.date_fin).toLocaleDateString('fr-FR') :
                            '-'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isEnCours ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              En cours
                            </span>
                          ) : dateFin && dateFin < now ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Terminée
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              À venir
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
