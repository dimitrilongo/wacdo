import { Button } from "@/components/ui/Button";
import { Store, MapPin } from "lucide-react"; // mes petits icones
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function Restaurant({ restaurant, onUpdate, token }) {
  const navigate = useNavigate();

	
	// la fonction delete
  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${restaurant.nom}" ?`)) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/restaurants/${restaurant.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        onUpdate(); // Recharge les reataurants
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        alert('Impossible de supprimer le restaurant');
      }
    }
  };

  return (
    <div
      className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => navigate(`/restaurants/${restaurant.id}`)}
    >
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Store className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{restaurant.nom}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-3 w-3" />
            <span>{restaurant.adresse}, {restaurant.code_postal} {restaurant.ville}</span>
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:bg-red-50"
          onClick={(e) => {
            e.stopPropagation(); // Empêche la navigation lors du clic sur Supprimer
            handleDelete();
          }}
        >
          Supprimer
        </Button>
      </div>
    </div>
  );
}
