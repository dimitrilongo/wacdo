import { Button } from "@/components/ui/Button";
import { Briefcase } from "lucide-react";
import axios from "axios";

export default function Poste({ poste, onUpdate, onEdit, token }) {
  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${poste.nom}" ?`)) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/postes/${poste.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        onUpdate(); // Recharge les postes
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        alert('Impossible de supprimer le poste');
      }
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Briefcase className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{poste.nom}</h3>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(poste)}
        >
          Modifier
        </Button>
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
