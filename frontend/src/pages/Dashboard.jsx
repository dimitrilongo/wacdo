import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { LogOut, User, Calendar, Shield, Mail, Store, Users, Briefcase, Search } from 'lucide-react';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
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
              <Link to="/restaurants" className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Bienvenue dans votre espace personnel WACDO</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Carte Profil utilisateur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-red-600" />
                <span>Profil utilisateur</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Nom complet:</span>
                <span className="text-sm font-medium">{user?.nom_complet}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium">{user?.email}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Embauché le:</span>
                <span className="text-sm font-medium">
                  {new Date(user?.date_embauche).toLocaleDateString('fr-FR')}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Statut:</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full text-xs ${
                  user?.is_admin 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user?.is_admin ? 'Administrateur' : 'Employé'}
                </span>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Section informations supplémentaires */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Informations système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">ID utilisateur:</span> {user?.id}
                </div>
                <div>
                  <span className="font-medium">Type de compte:</span> {user?.is_admin ? 'Administrateur' : 'Employé standard'}
                </div>
                <div>
                  <span className="font-medium">Dernière connexion:</span> Maintenant (FAKE)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
