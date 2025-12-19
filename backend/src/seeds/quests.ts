import prisma from '../prisma.js';

const questSeeds = [
  // Merchant Stall #5 (location id: 14, prestataire 1)
  { title: "Ranger l'étalage", description: "Aider à réorganiser les produits sur l'étalage du marchand.", xp_reward: 25, id_location: 14 },
  { title: "Attirer les clients", description: "Distribuer des échantillons pour attirer les passants vers le stand.", xp_reward: 30, id_location: 14 },
  { title: "Inventaire du matin", description: "Compter et vérifier le stock de marchandises.", xp_reward: 35, id_location: 14 },
  { title: "Livraison urgente", description: "Apporter une commande spéciale à un client VIP.", xp_reward: 50, id_location: 14 },
  { title: "Négociation difficile", description: "Convaincre un client hésitant d'acheter un produit premium.", xp_reward: 75, id_location: 14 },
  { title: "Protection du stand", description: "Surveiller le stand pendant l'absence du marchand.", xp_reward: 45, id_location: 14 },
  { title: "Démonstration produit", description: "Faire une démonstration des nouveaux produits aux visiteurs.", xp_reward: 60, id_location: 14 },

  // Merchant Stall #6 (location id: 15, prestataire 1)
  { title: "Préparation du stand", description: "Installer le stand avant l'ouverture du marché.", xp_reward: 20, id_location: 15 },
  { title: "Service client", description: "Répondre aux questions des clients pendant une heure.", xp_reward: 40, id_location: 15 },
  { title: "Collecte de paiements", description: "Récupérer les paiements en attente auprès des clients.", xp_reward: 55, id_location: 15 },
  { title: "Nettoyage du stand", description: "Nettoyer et ranger le stand après la journée.", xp_reward: 25, id_location: 15 },
  { title: "Commande spéciale", description: "Préparer une commande personnalisée pour un client régulier.", xp_reward: 80, id_location: 15 },
  { title: "Formation apprenti", description: "Former un nouvel apprenti aux techniques de vente.", xp_reward: 100, id_location: 15 },

  // Merchant Stall #7 (location id: 16, prestataire 4)
  { title: "Transport de marchandises", description: "Transporter des caisses depuis l'entrepôt vers le stand.", xp_reward: 35, id_location: 16 },
  { title: "Étude de marché", description: "Observer les concurrents et rapporter leurs prix.", xp_reward: 45, id_location: 16 },
  { title: "Décoration festive", description: "Décorer le stand pour la fête du village.", xp_reward: 30, id_location: 16 },
  { title: "Vente flash", description: "Organiser une vente promotionnelle éclair.", xp_reward: 65, id_location: 16 },
  { title: "Réparation d'urgence", description: "Réparer le toit du stand avant la pluie.", xp_reward: 50, id_location: 16 },
  { title: "Grand inventaire", description: "Faire l'inventaire complet de fin de mois.", xp_reward: 90, id_location: 16 },
  { title: "Partenariat commercial", description: "Négocier un accord avec un fournisseur.", xp_reward: 150, id_location: 16 },
];

export async function seedQuests() {
  console.log('🎯 Seeding quests...');

  for (const quest of questSeeds) {
    await prisma.quest.upsert({
      where: {
        id_quest: questSeeds.indexOf(quest) + 1
      },
      update: quest,
      create: quest
    });
  }

  console.log(`✅ Seeded ${questSeeds.length} quests`);
}

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`;
if (isMainModule) {
  seedQuests()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error(e);
      prisma.$disconnect();
      process.exit(1);
    });
}
