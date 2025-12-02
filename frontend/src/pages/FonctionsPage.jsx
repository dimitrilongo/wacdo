import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Briefcase, Plus, Store, Users, Search, LogOut } from "lucide-react";
import Poste from '../components/Poste';

export default function FonctionsPage() {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  
  const [postes, setPostes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPoste, setEditingPoste] = useState(null);
  const [formData, setFormData] = useState({
    nom: ''
  });

  // Fonction pour récupérer la liste des postes
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

  useEffect(() => {
    fetchPostes();
  }, []);

  // Gestion du formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fonction pour créer ou modifier un poste
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingPoste) {
        // Mode édition : PUT
        await axios.put(
          `http://127.0.0.1:8000/api/postes/${editingPoste.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      } else {
        // Mode création : POST
        await axios.post(
          'http://127.0.0.1:8000/api/postes',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }
      
      // Réinitialiser le formulaire et recharger la liste
      setFormData({ nom: '' });
      setShowForm(false);
      setEditingPoste(null);
      fetchPostes();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du poste:', err);
      alert('Erreur lors de la sauvegarde du poste');
    }
  };

  // Fonction pour ouvrir le formulaire en mode édition
  const handleEdit = (poste) => {
    setEditingPoste(poste);
    setFormData({
      nom: poste.nom
    });
    setShowForm(true);
  };

  // Fonction pour annuler l'édition/création
  const handleCancel = () => {
    setShowForm(false);
    setEditingPoste(null);
    setFormData({ nom: '' });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-white" />
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
              className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Collaborateurs</span>
            </button>
            <button
              onClick={() => navigate('/fonctions')}
              className="px-3 py-4 text-sm font-medium text-red-600 border-b-2 border-red-600 flex items-center space-x-2"
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
            <h2 className="text-3xl font-bold text-gray-900">Gestion des fonctions</h2>
			<p className="mt-1 text-sm text-gray-600">
			  {/* je gère le pluriel */}
              {postes.length} fonction{postes.length > 1 ? 's' : ''} enregistrée{postes.length > 1 ? 's' : ''}
            </p>
          </div>
          
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-white flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Créer une fonction</span>
            </Button>
          )}
        </div>

        {/* Formulaire de création/édition */}
        {showForm && (
          <Card className="mb-6">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {editingPoste ? 'Modifier la fonction' : 'Créer une nouvelle fonction'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la fonction *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Équipier, Manager, Directeur..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-white"
                  >
                    {editingPoste ? 'Mettre à jour' : 'Créer'}
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

        {/* Liste des postes */}
        <Card>
          <div className="divide-y divide-gray-200">
            {postes.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Aucune fonction enregistrée</p>
                <p className="text-sm mt-1">Créez votre première fonction pour commencer</p>
              </div>
            ) : (
              postes.map(poste => (
                <Poste
                  key={poste.id}
                  poste={poste}
                  onUpdate={fetchPostes}
                  onEdit={handleEdit}
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
