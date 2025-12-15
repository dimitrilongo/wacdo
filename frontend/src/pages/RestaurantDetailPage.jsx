import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Store, MapPin, ArrowLeft, Users, Edit } from "lucide-react";

export default function RestaurantDetailPage() {
  const { id } = useParams(); // Récupère l'ID du restaurant depuis l'URL (query parameters)
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();

  const [restaurant, setRestaurant] = useState(null);
  const [affectations, setAffectations] = useState([]);

  // États pour les filtres
  const [filterPoste, setFilterPoste] = useState('');
  const [filterNom, setFilterNom] = useState('');
  const [filterDateDebut, setFilterDateDebut] = useState('');

  const [postes, setPostes] = useState([]); // Liste des postes pour le filtre
  const [users, setUsers] = useState([]); // Liste des collaborateurs

  // États pour le formulaire de modification
  const [isEditing, setIsEditing] = useState(false);

  // États pour le formulaire d'affectation
  const [showAffectationForm, setShowAffectationForm] = useState(false);
  const [affectationData, setAffectationData] = useState({
    user_id: '',
    poste_id: '',
    date_debut: new Date().toISOString().split('T')[0],
    date_fin: ''
  });
	// États pour le formulaire de modification du restaurant
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    code_postal: '',
    ville: ''
  });

  // Fonction pour récupérer les détails du restaurant
  const fetchRestaurantDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/restaurants/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRestaurant(response.data);
      setAffectations(response.data.affectations || []);
    } catch (err) {
      console.error('Erreur lors du chargement du restaurant:', err);
      alert('Impossible de charger les détails du restaurant');
    }
  };

  // Fonction pour récupérer la liste des postes (pour le filtre)
  const fetchPostes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/postes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPostes(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des postes:', err);
    }
  };

  // Fonction pour récupérer la liste des collaborateurs
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des collaborateurs:', err);
    }
  };

  useEffect(() => {
    fetchRestaurantDetails();
    fetchPostes();
    fetchUsers();
  }, [id]);

  // Fonction pour gérer le changement des champs du formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fonction pour ouvrir le formulaire de modification
  const handleEditClick = () => {
    setFormData({
      nom: restaurant.nom,
      adresse: restaurant.adresse,
      code_postal: restaurant.code_postal,
      ville: restaurant.ville
    });
    setIsEditing(true);
  };

  // Fonction pour annuler la modification
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      nom: '',
      adresse: '',
      code_postal: '',
      ville: ''
    });
  };

  // Fonction pour soumettre la modification
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/restaurants/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsEditing(false);
      fetchRestaurantDetails(); // Recharger les détails
      alert('Restaurant modifié avec succès !');
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      alert('Impossible de modifier le restaurant');
    }
  };

  // Fonction pour gérer le changement des champs du formulaire d'affectation
  const handleAffectationChange = (e) => {
    setAffectationData({
      ...affectationData,
      [e.target.name]: e.target.value
    });
  };

  // Fonction pour soumettre l'affectation
  const handleAffectationSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/affectations', {
        ...affectationData,
        restaurant_id: parseInt(id),
        user_id: parseInt(affectationData.user_id),
        poste_id: parseInt(affectationData.poste_id),
        date_fin: affectationData.date_fin || null
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShowAffectationForm(false);
      setAffectationData({
        user_id: '',
        poste_id: '',
        date_debut: new Date().toISOString().split('T')[0],
        date_fin: ''
      });
      fetchRestaurantDetails(); // Recharger les détails
      alert('Collaborateur affecté avec succès !');
    } catch (err) {
      console.error('Erreur lors de l\'affectation:', err);
      alert('Impossible d\'affecter le collaborateur');
    }
  };

  // Fonction pour annuler le formulaire d'affectation
  const handleCancelAffectation = () => {
    setShowAffectationForm(false);
    setAffectationData({
      user_id: '',
      poste_id: '',
      date_debut: new Date().toISOString().split('T')[0],
      date_fin: ''
    });
  };

  // Fonction pour filtrer les affectations en cours (sans date_fin ou date_fin future)
  const affectationsEnCours = affectations.filter(affectation => {
    if (!affectation.date_fin) return true;
    const dateFin = new Date(affectation.date_fin);
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour comparer juste les dates
    return dateFin >= aujourdhui;
  });

  // Fonction pour filtrer les affectations passées (avec date_fin dans le passé)
  const affectationsPassees = affectations.filter(affectation => {
    if (!affectation.date_fin) return false;
    const dateFin = new Date(affectation.date_fin);
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour comparer juste les dates
    return dateFin < aujourdhui;
  });

  // Fonction pour filtrer les affectations en cours avec les filtres
  const filteredAffectations = affectationsEnCours.filter(affectation => {
    // Filtre par poste
    if (filterPoste && affectation.poste.id !== parseInt(filterPoste)) {
      return false;
    }

    // Filtre par nom de collaborateur
    if (filterNom && !affectation.user.name.toLowerCase().includes(filterNom.toLowerCase())) {
      return false;
    }

	  // Filtre par date de début - extraire seulement la partie date (YYYY-MM-DD) - Oui bazar
	  // l'html iput lui à 2025-11-13 par exemple mais dans la DB c'esi ISO avc le T
    if (filterDateDebut) {
      const dateDebutOnly = affectation.date_debut.split(' ')[0].split('T')[0];
      if (dateDebutOnly !== filterDateDebut) {
        return false;
      }
    }

    return true;
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <Store className="h-6 w-6 text-white" />
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
              className="px-3 py-4 text-sm font-medium text-red-600 border-b-2 border-red-600"
            >
              Restaurants
            </button>
            <button
              onClick={() => navigate('/collaborateurs')}
              className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
            >
              Collaborateurs
            </button>
            <button
              onClick={() => navigate('/fonctions')}
              className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
            >
              Fonctions
            </button>
            <button
              onClick={() => navigate('/affectations')}
              className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
            >
              Affectations
            </button>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bouton retour */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/restaurants')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour à la liste</span>
          </Button>
        </div>

        {/* Informations du restaurant */}
        <Card className="mb-6">
          <div className="p-6">
            {!isEditing ? (
              // Mode affichage
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Store className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{restaurant.nom}</h2>
                      <div className="flex items-center space-x-2 text-gray-600 mt-1">
                        <MapPin className="h-4 w-4" />
                        <span>{restaurant.adresse}, {restaurant.code_postal} {restaurant.ville}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleEditClick}
                    className="bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-white flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Modifier</span>
                  </Button>
                </div>
              </>
            ) : (
              // Mode édition
              <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Modifier le restaurant</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du restaurant *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse *
                    </label>
                    <input
                      type="text"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code postal *
                    </label>
                    <input
                      type="text"
                      name="code_postal"
                      value={formData.code_postal}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville *
                    </label>
                    <input
                      type="text"
                      name="ville"
                      value={formData.ville}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-white"
                  >
                    Enregistrer
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
            )}
          </div>
        </Card>

        {/* Formulaire d'affectation d'un nouveau collaborateur */}
        {!showAffectationForm ? (
          <div className="mb-6">
            <Button
              onClick={() => setShowAffectationForm(true)}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white flex items-center space-x-2"
            >
              <Users className="h-5 w-5" />
              <span>Affecter un collaborateur</span>
            </Button>
          </div>
        ) : (
          <Card className="mb-6">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Affecter un nouveau collaborateur</h3>
              <form onSubmit={handleAffectationSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Collaborateur *
                    </label>
                    <select
                      name="user_id"
                      value={affectationData.user_id}
                      onChange={handleAffectationChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Sélectionner un collaborateur</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.prenom} {user.nom} - {user.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Poste *
                    </label>
                    <select
                      name="poste_id"
                      value={affectationData.poste_id}
                      onChange={handleAffectationChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                      Date de début *
                    </label>
                    <input
                      type="date"
                      name="date_debut"
                      value={affectationData.date_debut}
                      onChange={handleAffectationChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de fin (optionnelle)
                    </label>
                    <input
                      type="date"
                      name="date_fin"
                      value={affectationData.date_fin}
                      onChange={handleAffectationChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white"
                  >
                    Créer l'affectation
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelAffectation}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}

        {/* Section des collaborateurs */}
        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="h-6 w-6 text-red-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Collaborateurs en poste ({filteredAffectations.length})
              </h3>
            </div>

            {/* Filtres */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrer par poste
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
                  Filtrer par nom
                </label>
                <input
                  type="text"
                  value={filterNom}
                  onChange={(e) => setFilterNom(e.target.value)}
                  placeholder="Nom du collaborateur..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrer par date de début
                </label>
                <input
                  type="date"
                  value={filterDateDebut}
                  onChange={(e) => setFilterDateDebut(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Bouton pour réinitialiser les filtres */}
            {(filterPoste || filterNom || filterDateDebut) && (
              <div className="mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilterPoste('');
                    setFilterNom('');
                    setFilterDateDebut('');
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}

            {/* Liste des collaborateurs en cours  attention si tableau vide filteredAffectations message erreur sino on affiche*/}
            {filteredAffectations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {affectationsEnCours.length === 0 ?
                  "Aucun collaborateur en poste dans ce restaurant" :
                  "Aucun collaborateur ne correspond aux filtres"
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
                        Poste
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date de début
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date de fin
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAffectations.map((affectation) => {
                      // Vérification de sécurité pour éviter les erreurs si user ou poste sont null
                      if (!affectation.user || !affectation.poste) {
                        return null;
                      }

                      return (
                        <tr key={affectation.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {affectation.user.name?.charAt(0).toUpperCase() || '?'}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
								  {affectation.user.nom || 'N/A'}&nbsp;

								  {affectation.user.prenom || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {affectation.user.email || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              {affectation.poste.nom || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(affectation.date_debut).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {affectation.date_fin ?
                            new Date(affectation.date_fin).toLocaleDateString('fr-FR') :
                            <span className="text-green-600 font-medium">En cours</span>
                          }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>

        {/* Section des affectations passées */}
        {affectationsPassees.length > 0 && (
          <Card className="mt-6">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Users className="h-6 w-6 text-gray-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Anciens collaborateurs ({affectationsPassees.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Collaborateur
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {affectationsPassees.map((affectation) => {
                      // Vérification de sécurité pour éviter les erreurs si user ou poste sont null
                      if (!affectation.user || !affectation.poste) {
                        return null;
                      }

                      return (
                        <tr key={affectation.id} className="hover:bg-gray-50 opacity-75">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {affectation.user.name?.charAt(0).toUpperCase() || '?'}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-700">
                                  {affectation.user.nom || 'N/A'}&nbsp;
                                  {affectation.user.prenom || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {affectation.user.email || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">
                              {affectation.poste.nom || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(affectation.date_debut).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {affectation.date_fin ?
                              new Date(affectation.date_fin).toLocaleDateString('fr-FR') :
                              'N/A'
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
