import prisma from '../prisma.js';

const questSeeds = [
  // Château Principal (location id: 1)
  { title: "Récupérer l'épée du roi", description: "Retrouver l'épée légendaire du roi dans les donjons du château.", xp_reward: 150, id_location: 1 },
  { title: "Protéger le trône", description: "Monter la garde devant la salle du trône pendant la cérémonie.", xp_reward: 75, id_location: 1 },
  { title: "Livrer un message royal", description: "Apporter un message urgent au conseiller du roi.", xp_reward: 25, id_location: 1 },
  
  // Forge du Village (location id: 2)
  { title: "Collecter du minerai", description: "Rapporter 10 unités de minerai de fer de la mine.", xp_reward: 50, id_location: 2 },
  { title: "Forger une épée", description: "Aider le forgeron à créer une épée pour les gardes.", xp_reward: 100, id_location: 2 },
  
  // Taverne du Dragon Noir (location id: 3)
  { title: "Servir les clients", description: "Aider le tavernier pendant l'heure de pointe.", xp_reward: 30, id_location: 3 },
  { title: "Résoudre une bagarre", description: "Calmer une dispute entre deux clients mécontents.", xp_reward: 45, id_location: 3 },
  { title: "Trouver le voleur", description: "Identifier qui a volé la bourse du marchand.", xp_reward: 80, id_location: 3 },
  
  // Tour des Mages (location id: 4)
  { title: "Collecter des herbes magiques", description: "Récolter 5 herbes rares pour les potions.", xp_reward: 60, id_location: 4 },
  { title: "Apprenti du mage", description: "Assister le mage dans ses expériences pendant une journée.", xp_reward: 120, id_location: 4 },
  { title: "Décrypter un parchemin", description: "Traduire un ancien parchemin magique.", xp_reward: 200, id_location: 4 },
  
  // Marché Central (location id: 5)
  { title: "Livraison express", description: "Livrer 5 colis avant la fermeture du marché.", xp_reward: 35, id_location: 5 },
  { title: "Négocier un prix", description: "Obtenir une réduction de 20% sur un objet rare.", xp_reward: 40, id_location: 5 },
  
  // Écuries Royales (location id: 6)
  { title: "Soigner un cheval", description: "Aider le palefrenier à soigner un cheval blessé.", xp_reward: 55, id_location: 6 },
  { title: "Course de chevaux", description: "Participer à la course annuelle et finir dans le top 3.", xp_reward: 175, id_location: 6 },
  
  // Bibliothèque Ancienne (location id: 7)
  { title: "Ranger les archives", description: "Classer les documents historiques par époque.", xp_reward: 20, id_location: 7 },
  { title: "Recherche historique", description: "Trouver des informations sur la bataille de 1347.", xp_reward: 65, id_location: 7 },
  
  // Port des Marchands (location id: 8)
  { title: "Décharger un navire", description: "Aider à décharger les marchandises du nouveau navire.", xp_reward: 45, id_location: 8 },
  { title: "Escorter un marchand", description: "Accompagner un marchand jusqu'à la ville voisine.", xp_reward: 90, id_location: 8 },
  { title: "Pêche miraculeuse", description: "Attraper le poisson légendaire du port.", xp_reward: 250, id_location: 8 },
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
if (require.main === module) {
  seedQuests()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error(e);
      prisma.$disconnect();
      process.exit(1);
    });
}
