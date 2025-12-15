import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LogOut, Store, Users, Briefcase, Search, Plus } from "lucide-react";
import axios from "axios";
import Restaurant from "../components/Restaurant.jsx";

export default function RestaurantsPage() {
  const { user, logout, token } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  //le formulaire je le cache ou l'affiche - par défaut il est caché
  const [showForm, setShowForm] = useState(false);
  
  // États pour les filtres
  const [filterNom, setFilterNom] = useState('');
  const [filterCodePostal, setFilterCodePostal] = useState('');
  const [filterVille, setFilterVille] = useState('');
	
// Je stocke les données du formulaire -> usestate valeur vie par défaut
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    code_postal: '',
    ville: ''
  });

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/restaurants`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Restaurants récupérés:", response.data);
      setRestaurants(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des restaurants:', err);
      setError('Impossible de charger les restaurants');
    }
  };

  useEffect(() => {
    if (token) {
      fetchRestaurants();
    }
  }, [token]);

  const handleLogout = async () => {
    await logout();
  };

  const handleSubmit = async (e) => {
	  e.preventDefault(); // pas de rechargement de page
	  // on POST
    try {
      await axios.post(`${API_BASE_URL}/restaurants`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFormData({ nom: '', adresse: '', code_postal: '', ville: '' }); // ok on revide le formulaire pour la prochaine fois
      setShowForm(false); // je recache le formulaire après soumission
      fetchRestaurants(); // je récupère de nouveau les restaurants ça me permet d'afficher le nouveau
    } catch (err) {
      console.error('Erreur lors de la création du restaurant:', err);
      setError('Impossible de créer le restaurant');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData, // tout le reste des données du formulaire
      [e.target.name]: e.target.value // ça met à jour que la veleur du champ modifié
    });
  };

  // Fonction pour filtrer les restaurants
  const filteredRestaurants = restaurants.filter(restaurant => {
    // Filtre par nom
    if (filterNom && !restaurant.nom.toLowerCase().includes(filterNom.toLowerCase())) {
      return false;
    }
    
    // Filtre par code postal
    if (filterCodePostal && !restaurant.code_postal.includes(filterCodePostal)) {
      return false;
    }
    
    // Filtre par ville
    if (filterVille && !restaurant.ville.toLowerCase().includes(filterVille.toLowerCase())) {
      return false;
    }
    
    return true;
  });

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
              <Link to="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                <span>Dashboard</span>
              </Link>
              <Link to="/restaurants" className="flex items-center space-x-2 text-red-600 font-medium">
                <Store className="h-4 w-4" />
                <span>Restaurants</span>
              </Link>
              <Link to="/collaborateurs" className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                <Users className="h-4 w-4" />
                <span>Collaborateurs</span>
              </Link>
              <Link to="/fonctions" className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                <Briefcase className="h-4 w-4" />
                <span>Fonctions</span>
              </Link>
              <Link to="/affectations" className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                <Search className="h-4 w-4" />
                <span>Affectations</span>
              </Link>
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
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des restaurants</h1>
            <p className="text-gray-600">Liste de tous les restaurants WACDO</p>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Créer un restaurant</span>
          </Button>
        </div>

        {showForm && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Nouveau restaurant</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du restaurant
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal
                  </label>
                  <input
                    type="text"
                    name="code_postal"
                    value={formData.code_postal}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="ville"
                    value={formData.ville}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  Créer
                </Button>
              </div>
            </form>
          </Card>
        )}

        {error ? (
          <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
          </Card>
        ) : (
          <>
            {/* Formulaire de filtres */}
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Search className="h-5 w-5 text-red-600" />
                <span>Filtres de recherche</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du restaurant
                  </label>
                  <input
                    type="text"
                    value={filterNom}
                    onChange={(e) => setFilterNom(e.target.value)}
                    placeholder="Rechercher par nom..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal
                  </label>
                  <input
                    type="text"
                    value={filterCodePostal}
                    onChange={(e) => setFilterCodePostal(e.target.value)}
                    placeholder="Ex: 75001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={filterVille}
                    onChange={(e) => setFilterVille(e.target.value)}
                    placeholder="Rechercher par ville..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Bouton pour réinitialiser les filtres */}
              {(filterNom || filterCodePostal || filterVille) && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilterNom('');
                      setFilterCodePostal('');
                      setFilterVille('');
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}

              <p className="text-sm text-gray-500 mt-4">
                {filteredRestaurants.length} restaurant{filteredRestaurants.length > 1 ? 's' : ''} trouvé{filteredRestaurants.length > 1 ? 's' : ''}
              </p>
            </Card>

            {/* Liste des restaurants */}
            <Card className="p-6">
              {filteredRestaurants.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {restaurants.length === 0 ? 
                    "Aucun restaurant enregistré" :
                    "Aucun restaurant ne correspond aux filtres"
                  }
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredRestaurants.map(restaurant => (
                    <Restaurant key={restaurant.id} restaurant={restaurant} onUpdate={fetchRestaurants} token={token} />
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
