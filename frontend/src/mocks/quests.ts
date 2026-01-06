import { LOCATIONS } from './locations';

// Helper to get location by id
const getLocation = (id: number) => LOCATIONS.find(l => l.id === id);

// Matches backend/src/seeds/quests.ts - hardcoded with IDs and location info
export const QUESTS = [
  // Merchant Stall #5 (location id: 14, prestataire 1)
  { id_quest: 1, title: "Ranger l'étalage", description: "Aider à réorganiser les produits sur l'étalage du marchand.", xp_reward: 25, id_location: 14, location: getLocation(14) },
  { id_quest: 2, title: "Attirer les clients", description: "Distribuer des échantillons pour attirer les passants vers le stand.", xp_reward: 30, id_location: 14, location: getLocation(14) },
  { id_quest: 3, title: "Inventaire du matin", description: "Compter et vérifier le stock de marchandises.", xp_reward: 35, id_location: 14, location: getLocation(14) },
  { id_quest: 4, title: "Livraison urgente", description: "Apporter une commande spéciale à un client VIP.", xp_reward: 50, id_location: 14, location: getLocation(14) },
  { id_quest: 5, title: "Négociation difficile", description: "Convaincre un client hésitant d'acheter un produit premium.", xp_reward: 75, id_location: 14, location: getLocation(14) },
  { id_quest: 6, title: "Protection du stand", description: "Surveiller le stand pendant l'absence du marchand.", xp_reward: 45, id_location: 14, location: getLocation(14) },
  { id_quest: 7, title: "Démonstration produit", description: "Faire une démonstration des nouveaux produits aux visiteurs.", xp_reward: 60, id_location: 14, location: getLocation(14) },

  // Merchant Stall #6 (location id: 15, prestataire 1)
  { id_quest: 8, title: "Préparation du stand", description: "Installer le stand avant l'ouverture du marché.", xp_reward: 20, id_location: 15, location: getLocation(15) },
  { id_quest: 9, title: "Service client", description: "Répondre aux questions des clients pendant une heure.", xp_reward: 40, id_location: 15, location: getLocation(15) },
  { id_quest: 10, title: "Collecte de paiements", description: "Récupérer les paiements en attente auprès des clients.", xp_reward: 55, id_location: 15, location: getLocation(15) },
  { id_quest: 11, title: "Nettoyage du stand", description: "Nettoyer et ranger le stand après la journée.", xp_reward: 25, id_location: 15, location: getLocation(15) },
  { id_quest: 12, title: "Commande spéciale", description: "Préparer une commande personnalisée pour un client régulier.", xp_reward: 80, id_location: 15, location: getLocation(15) },
  { id_quest: 13, title: "Formation apprenti", description: "Former un nouvel apprenti aux techniques de vente.", xp_reward: 100, id_location: 15, location: getLocation(15) },

  // Merchant Stall #7 (location id: 16, prestataire 4)
  { id_quest: 14, title: "Transport de marchandises", description: "Transporter des caisses depuis l'entrepôt vers le stand.", xp_reward: 35, id_location: 16, location: getLocation(16) },
  { id_quest: 15, title: "Étude de marché", description: "Observer les concurrents et rapporter leurs prix.", xp_reward: 45, id_location: 16, location: getLocation(16) },
  { id_quest: 16, title: "Décoration festive", description: "Décorer le stand pour la fête du village.", xp_reward: 30, id_location: 16, location: getLocation(16) },
  { id_quest: 17, title: "Vente flash", description: "Organiser une vente promotionnelle éclair.", xp_reward: 65, id_location: 16, location: getLocation(16) },
  { id_quest: 18, title: "Réparation d'urgence", description: "Réparer le toit du stand avant la pluie.", xp_reward: 50, id_location: 16, location: getLocation(16) },
  { id_quest: 19, title: "Grand inventaire", description: "Faire l'inventaire complet de fin de mois.", xp_reward: 90, id_location: 16, location: getLocation(16) },
  { id_quest: 20, title: "Partenariat commercial", description: "Négocier un accord avec un fournisseur.", xp_reward: 150, id_location: 16, location: getLocation(16) },
];