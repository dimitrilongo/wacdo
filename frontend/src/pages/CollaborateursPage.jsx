import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, Plus, Store, Briefcase, Search } from "lucide-react";
import Collaborateur from '../components/Collaborateur';

export default function CollaborateursPage() {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
  
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [postes, setPostes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // États pour les filtres
  const [filterNom, setFilterNom] = useState('');
  const [filterPrenom, setFilterPrenom] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [showNonAffectes, setShowNonAffectes] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    password_confirmation: '',
    restaurant_id: '',
    poste_id: '',
    date_debut: '',
    date_fin: ''
  });

  // Générer un mot de passe aléatoire sécurisé
	const generateRandomPassword = () => {
	// longeur du mot de passe
	const length = 12;
	// caractères utilisables (70 charactères possibles)
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
	let password = '';
	// bouble 12 fois
	for (let i = 0; i < length; i++) {
		// Math.random() c'est un décimal !!!! pas 0 ou 1 et Math.floor() arrondi vers le bas
      	password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  // Fonction pour récupérer la liste des collaborateurs
  const fetchCollaborateurs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCollaborateurs(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des collaborateurs:', err);
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
    fetchCollaborateurs();
    fetchRestaurants();
    fetchPostes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gestion du formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Initialiser avec un mot de passe aléatoire lors de l'ouverture du formulaire
  const handleShowForm = () => {
    const randomPassword = generateRandomPassword();
    setFormData({
      prenom: '',
      nom: '',
      email: '',
      password: randomPassword,
      password_confirmation: randomPassword,
      restaurant_id: '',
      poste_id: '',
      date_debut: '',
      date_fin: ''
    });
    setEditingUser(null);
    setShowForm(true);
  };

  // Fonction pour créer ou modifier un collaborateur
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation des mots de passe
    if (!editingUser && formData.password !== formData.password_confirmation) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      if (editingUser) {
        // Mode édition : PUT
        const dataToSend = {
          prenom: formData.prenom,
          nom: formData.nom
        };
        
        console.log('Données envoyées pour update:', dataToSend);
        console.log('ID utilisateur:', editingUser.id);
        
        await axios.put(
          `${API_BASE_URL}/users/${editingUser.id}`,
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // Gérer l'affectation si restaurant et poste sont sélectionnés
        if (formData.restaurant_id && formData.poste_id && formData.date_debut) {
          const affectationData = {
            user_id: editingUser.id,
            restaurant_id: formData.restaurant_id,
            poste_id: formData.poste_id,
            date_debut: formData.date_debut,
            date_fin: formData.date_fin || null // Envoyer null si vide
          };

          console.log('Création affectation:', affectationData);
          
          // Créer une nouvelle affectation
          await axios.post(
            `${API_BASE_URL}/affectations`,
            affectationData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
        }
        
        console.log('Sauvegarde réussie !');
      } else {
        // Mode création : POST
        await axios.post(
          `${API_BASE_URL}/users`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }
      
      // Réinitialiser le formulaire et recharger la liste
      setFormData({ 
        prenom: '',
        nom: '',
        email: '', 
        password: '', 
        password_confirmation: '',
        restaurant_id: '',
        poste_id: '',
        date_debut: '',
        date_fin: ''
      });
      setShowForm(false);
      setEditingUser(null);
      fetchCollaborateurs();
    } catch (err) {
      console.error('Erreur complète:', err);
      console.error('Réponse erreur:', err.response);
      console.error('Données erreur:', err.response?.data);
      console.error('Erreurs de validation:', err.response?.data?.errors);
      
      if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        alert('Erreur de validation :\n' + errors.join('\n'));
      } else if (err.response?.data?.message) {
        alert('Erreur : ' + err.response.data.message);
      } else {
        alert('Erreur lors de la sauvegarde du collaborateur');
      }
    }
  };

  // Fonction pour ouvrir le formulaire en mode édition
  const handleEdit = (collaborateur) => {
    setEditingUser(collaborateur);
    setFormData({
      prenom: collaborateur.prenom || '',
      nom: collaborateur.nom || '',
      email: collaborateur.email,
      password: '',
      password_confirmation: '',
      restaurant_id: '',
      poste_id: '',
      date_debut: new Date().toISOString().split('T')[0], // Date du jour par défaut
      date_fin: ''
    });
    setShowForm(true);
  };

  // Fonction pour annuler l'édition/création
  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ 
      prenom: '',
      nom: '',
      email: '', 
      password: '', 
      password_confirmation: '',
      restaurant_id: '',
      poste_id: '',
      date_debut: '',
      date_fin: ''
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fonction de filtrage
  const filteredCollaborateurs = collaborateurs.filter(collaborateur => {
    // Filtre par nom
    if (filterNom && !collaborateur.nom.toLowerCase().includes(filterNom.toLowerCase())) {
      return false;
    }
    
    // Filtre par prénom
    if (filterPrenom && !collaborateur.prenom.toLowerCase().includes(filterPrenom.toLowerCase())) {
      return false;
    }
    
    // Filtre par email
    if (filterEmail && !collaborateur.email.toLowerCase().includes(filterEmail.toLowerCase())) {
      return false;
    }
    
    // Filtre par non affectés
    if (showNonAffectes) {
      if (collaborateur.affectations && collaborateur.affectations.length > 0) {
        return false;
      }
    }
    
    return true;
  });

  // Compter les collaborateurs non affectés
  const nonAffectesCount = collaborateurs.filter(
    collab => !collab.affectations || collab.affectations.length === 0
  ).length;

  // Fonction pour réinitialiser les filtres
  const handleResetFilters = () => {
    setFilterNom('');
    setFilterPrenom('');
    setFilterEmail('');
    setShowNonAffectes(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">McWacdo Manager</h1>
                <p className="text-sm text-gray-600">Bienvenue, {user?.name}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50"
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/restaurants')}
              className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 flex items-center space-x-2"
            >
              <Store className="h-4 w-4" />
              <span>Restaurants</span>
            </button>
            <button
              onClick={() => navigate('/collaborateurs')}
              className="px-3 py-4 text-sm font-medium text-red-600 border-b-2 border-red-600 flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Collaborateurs</span>
            </button>
            <button
              onClick={() => navigate('/fonctions')}
              className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 flex items-center space-x-2"
            >
              <Briefcase className="h-4 w-4" />
              <span>Fonctions</span>
            </button>
            <button
              onClick={() => navigate('/affectations')}
              className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Affectations</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Gestion des collaborateurs</h2>
            <p className="mt-1 text-sm text-gray-600">
              {filteredCollaborateurs.length} collaborateur{filteredCollaborateurs.length > 1 ? 's' : ''} affiché{filteredCollaborateurs.length > 1 ? 's' : ''}
              {(filterNom || filterPrenom || filterEmail) && ` sur ${collaborateurs.length}`}
            </p>
          </div>
          
          {!showForm && (
            <Button
              onClick={handleShowForm}
              className="bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-white flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Créer un collaborateur</span>
            </Button>
          )}
        </div>

        {/* Formulaire de recherche */}
        {!showForm && (
          <Card className="mb-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Rechercher et filtrer</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={filterNom}
                    onChange={(e) => setFilterNom(e.target.value)}
                    placeholder="Rechercher par nom..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={filterPrenom}
                    onChange={(e) => setFilterPrenom(e.target.value)}
                    placeholder="Rechercher par prénom..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="text"
                    value={filterEmail}
                    onChange={(e) => setFilterEmail(e.target.value)}
                    placeholder="Rechercher par email..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-3">
                <Button
                  variant={showNonAffectes ? "default" : "outline"}
                  onClick={() => setShowNonAffectes(!showNonAffectes)}
                  className={showNonAffectes ? "bg-red-600 hover:bg-red-700 text-white" : "text-gray-600 hover:bg-gray-50"}
                >
                  {showNonAffectes ? '✓ ' : ''}Non affectés ({nonAffectesCount})
                </Button>
                
                {(filterNom || filterPrenom || filterEmail || showNonAffectes) && (
                  <Button
                    variant="outline"
                    onClick={handleResetFilters}
                    className="text-gray-600 hover:bg-gray-50"
                  >
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Formulaire de création/édition */}
        {showForm && (
          <Card className="mb-6">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {editingUser ? 'Modifier le collaborateur' : 'Créer un nouveau collaborateur'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Jean"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Dupont"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Email et mot de passe uniquement en mode création */}
                {!editingUser && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="exemple@email.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    {/* Champs de mot de passe cachés avec génération automatique */}
                    <input
                      type="hidden"
                      name="password"
                      value={formData.password}
                    />
                    <input
                      type="hidden"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                    />
                  </>
                )}

                {/* Section Affectation - visible uniquement en mode édition */}
                {editingUser && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Modifier l'affectation (optionnel)
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Restaurant
                        </label>
                        <select
                          name="restaurant_id"
                          value={formData.restaurant_id}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">Sélectionner un restaurant</option>
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
                          name="poste_id"
                          value={formData.poste_id}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">Sélectionner un poste</option>
                          {postes.map(poste => (
                            <option key={poste.id} value={poste.id}>
                              {poste.nom}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date de début
                        </label>
                        <input
                          type="date"
                          name="date_debut"
                          value={formData.date_debut}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date de fin (optionnelle)
                        </label>
                        <input
                          type="date"
                          name="date_fin"
                          value={formData.date_fin}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      Remplissez au minimum restaurant, poste et date de début pour créer une nouvelle affectation
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-white"
                  >
                    {editingUser ? 'Mettre à jour' : 'Créer'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}

        {/* Liste des collaborateurs */}
        <Card>
          <div className="divide-y divide-gray-200">
            {filteredCollaborateurs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                {collaborateurs.length === 0 ? (
                  <>
                    <p>Aucun collaborateur enregistré</p>
                    <p className="text-sm mt-1">Créez votre premier collaborateur pour commencer</p>
                  </>
                ) : (
                  <>
                    <p>Aucun collaborateur ne correspond aux critères de recherche</p>
                    <p className="text-sm mt-1">Essayez de modifier vos filtres</p>
                  </>
                )}
              </div>
            ) : (
              filteredCollaborateurs.map(collaborateur => (
                <Collaborateur
                  key={collaborateur.id}
                  collaborateur={collaborateur}
                  onUpdate={fetchCollaborateurs}
                  onClick={handleEdit}
                  token={token}
                />
              ))
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
