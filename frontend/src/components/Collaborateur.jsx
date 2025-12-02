import { Button } from "@/components/ui/Button";
import { Store, Briefcase } from "lucide-react";
import axios from "axios";

export default function Collaborateur({ collaborateur, onUpdate, onClick, token }) {
  const handleDelete = async (e) => {
    e.stopPropagation(); // Empêche le clic de déclencher l'édition
    
    const nomComplet = `${collaborateur.prenom || ''} ${collaborateur.nom || ''}`.trim() || collaborateur.email;
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${nomComplet}" ?`)) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/users/${collaborateur.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        onUpdate(); // Recharge les collaborateurs
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        alert('Impossible de supprimer le collaborateur');
      }
    }
  };

  // Récupérer l'affectation en cours (la plus récente)
  const affectationEnCours = collaborateur.affectations?.[0];
  
  // Créer le nom complet et l'initiale
  const nomComplet = `${collaborateur.prenom || ''} ${collaborateur.nom || ''}`.trim() || 'Utilisateur';
  const initiale = collaborateur.prenom?.charAt(0).toUpperCase() || collaborateur.nom?.charAt(0).toUpperCase() || 'U';

  return (
    <div 
      className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => onClick(collaborateur)}
    >
      <div className="flex items-center space-x-4 flex-1">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">
            {initiale}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900">{nomComplet}</h3>
          <p className="text-sm text-gray-600">{collaborateur.email}</p>
          
          {/* Affichage de l'affectation en cours */}
          {affectationEnCours && (
            <div className="flex items-center space-x-3 mt-1">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Store className="h-3 w-3" />
                <span>{affectationEnCours.restaurant?.nom || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Briefcase className="h-3 w-3" />
                <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full font-medium">
                  {affectationEnCours.poste?.nom || 'N/A'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-600 hover:bg-red-50"
          onClick={handleDelete}
        >
          Supprimer
        </Button>
      </div>
    </div>
  );
}
