import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';
import { Eye, EyeOff, User, Mail, Lock, Calendar, Shield } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    mot_de_passe_confirmation: '',
    date_embauche: '',
    is_admin: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await register(formData);
      navigate('/dashboard'); // Rediriger vers le dashboard après inscription
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      
      if (error.errors) {
        setErrors(error.errors);
      } else if (error.message) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'Une erreur est survenue lors de l\'inscription' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-yellow-50 p-4">
      <div className="w-full max-w-lg">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-600 to-yellow-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">🍟</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">WACDO</h1>
          <p className="text-gray-600 mt-2">Créez votre compte employé</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Inscription</CardTitle>
            <CardDescription className="text-center">
              Remplissez vos informations pour créer votre compte
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Erreur générale */}
              {errors.general && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {/* Nom et Prénom sur la même ligne */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="nom"
                      name="nom"
                      type="text"
                      placeholder="Dupont"
                      value={formData.nom}
                      onChange={handleChange}
                      className={`pl-10 ${errors.nom ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {errors.nom && (
                    <p className="text-sm text-red-600">{errors.nom[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="prenom"
                      name="prenom"
                      type="text"
                      placeholder="Jean"
                      value={formData.prenom}
                      onChange={handleChange}
                      className={`pl-10 ${errors.prenom ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {errors.prenom && (
                    <p className="text-sm text-red-600">{errors.prenom[0]}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jean.dupont@wacdo.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email[0]}</p>
                )}
              </div>

              {/* Date d'embauche */}
              <div className="space-y-2">
                <Label htmlFor="date_embauche">Date d'embauche</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="date_embauche"
                    name="date_embauche"
                    type="date"
                    value={formData.date_embauche}
                    onChange={handleChange}
                    className={`pl-10 ${errors.date_embauche ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {errors.date_embauche && (
                  <p className="text-sm text-red-600">{errors.date_embauche[0]}</p>
                )}
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="mot_de_passe">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="mot_de_passe"
                    name="mot_de_passe"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.mot_de_passe}
                    onChange={handleChange}
                    className={`pl-10 pr-10 ${errors.mot_de_passe ? 'border-red-500' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.mot_de_passe && (
                  <p className="text-sm text-red-600">{errors.mot_de_passe[0]}</p>
                )}
              </div>

              {/* Confirmation mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="mot_de_passe_confirmation">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="mot_de_passe_confirmation"
                    name="mot_de_passe_confirmation"
                    type={showPasswordConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.mot_de_passe_confirmation}
                    onChange={handleChange}
                    className={`pl-10 pr-10 ${errors.mot_de_passe_confirmation ? 'border-red-500' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.mot_de_passe_confirmation && (
                  <p className="text-sm text-red-600">{errors.mot_de_passe_confirmation[0]}</p>
                )}
              </div>

              {/* Statut administrateur */}
              <div className="flex items-center space-x-2">
                <input
                  id="is_admin"
                  name="is_admin"
                  type="checkbox"
                  checked={formData.is_admin}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <Label htmlFor="is_admin" className="flex items-center space-x-2 cursor-pointer">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span>Compte administrateur</span>
                </Label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                disabled={loading}
              >
                {loading ? 'Création du compte...' : 'Créer le compte'}
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link 
                  to="/login" 
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Se connecter
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;