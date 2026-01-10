import prisma from '../prisma.js';

const questSeeds = [
  // Merchant Stall #5 (location id: 14) - THÈME : Logistique & Aide manuelle
  { title: "Livraison Inter-Stands", description: "Apporter un panier à l'échoppe de la Place.", xp_reward: 60, id_location: 14 },
  { title: "Rangement Express", description: "Aider le marchand à trier ses caisses vides pendant 5 minutes.", xp_reward: 40, id_location: 14 },
  { title: "Le Mot Secret", description: "Dire le mot de passe du jour au vendeur.", xp_reward: 50, id_location: 14 },
  { title: "Vitrine Éclatante", description: "Nettoyer la vitre de présentation pour qu'elle brille.", xp_reward: 30, id_location: 14 },
  { title: "Inventaire Participatif", description: "Compter le nombre de produits rouges sur l'étalage pour le stock.", xp_reward: 45, id_location: 14 },

  // Merchant Stall #6 (location id: 15) - THÈME : Exploration & Observation
  { title: "L'Objet Intrus", description: "Trouver l'objet anachronique caché dans la décoration du stand.", xp_reward: 50, id_location: 15 },
  { title: "L'Origine du Monde", description: "Découvrir la provenance exacte de la matière première principale.", xp_reward: 55, id_location: 15 },
  { title: "Le Marchand", description: "Discuter avec le marchand sur les produits.", xp_reward: 20, id_location: 15 },
  { title: "Le Gardien du Temps", description: "Relever l'heure exacte d'ouverture affichée sur le petit panneau caché.", xp_reward: 10, id_location: 15 },
  { title: "Le Mot Secret", description: "Obtenir le mot de passe du jour en discutant avec le vendeur.", xp_reward: 10, id_location: 15 },

  // Merchant Stall #7 (location id: 16) - THÈME : Créativité & Social
  { title: "Reporter d'un Jour", description: "Interviewer le marchand sur l'histoire de sa boutique (3 questions).", xp_reward: 50, id_location: 16 },
  { title: "Mur des Avis", description: "Dire son avis sur le stand.", xp_reward: 20, id_location: 16 },
  { title: "Compteur", description: "Compter le nombre de personne se présentant au stand.", xp_reward: 30, id_location: 16 },
  { title: "Dessinateur Amateur", description: "Faire un croquis rapide du stand et l'offrir au marchand.", xp_reward: 55, id_location: 16 },
  { title: "Souvenir Digital", description: "Prendre en photo le stand.", xp_reward: 25, id_location: 16 },
];

export async function seedQuests() {
  console.log(' Seeding quests...');

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
