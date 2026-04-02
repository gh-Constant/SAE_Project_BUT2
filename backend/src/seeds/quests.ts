import prisma from '../prisma.js';

const questSeeds = [
  // Merchant Stall #5 (location id: 14)
  { title: "Livraison Inter-Stands", description: "Apporter un panier a l'echoppe de la Place.", xp_reward: 60, id_location: 14, validation_code: 'QUEST:NEW:LOC:14:CODE:PRESTA_STALL_5:11111111-1111-4111-8111-111111111111' },
  { title: "Rangement Express", description: "Aider le marchand a trier ses caisses vides pendant 5 minutes.", xp_reward: 40, id_location: 14, validation_code: 'QUEST:NEW:LOC:14:CODE:PRESTA_STALL_5:22222222-2222-4222-8222-222222222222' },
  { title: "Le Mot Secret", description: "Dire le mot de passe du jour au vendeur.", xp_reward: 50, id_location: 14, validation_code: 'QUEST:NEW:LOC:14:CODE:PRESTA_STALL_5:33333333-3333-4333-8333-333333333333' },
  { title: "Vitrine Eclatante", description: "Nettoyer la vitre de presentation pour qu'elle brille.", xp_reward: 30, id_location: 14, validation_code: 'QUEST:NEW:LOC:14:CODE:PRESTA_STALL_5:44444444-4444-4444-8444-444444444444' },
  { title: "Inventaire Participatif", description: "Compter le nombre de produits rouges sur l'etalage pour le stock.", xp_reward: 45, id_location: 14, validation_code: 'QUEST:NEW:LOC:14:CODE:PRESTA_STALL_5:55555555-5555-4555-8555-555555555555' },

  // Merchant Stall #6 (location id: 15)
  { title: "L'Objet Intrus", description: "Trouver l'objet anachronique cache dans la decoration du stand.", xp_reward: 50, id_location: 15, validation_code: 'QUEST:NEW:LOC:15:CODE:PRESTA_STALL_6:66666666-6666-4666-8666-666666666666' },
  { title: "L'Origine du Monde", description: "Decouvrir la provenance exacte de la matiere premiere principale.", xp_reward: 55, id_location: 15, validation_code: 'QUEST:NEW:LOC:15:CODE:PRESTA_STALL_6:77777777-7777-4777-8777-777777777777' },
  { title: "Le Marchand", description: "Discuter avec le marchand sur les produits.", xp_reward: 20, id_location: 15, validation_code: 'QUEST:NEW:LOC:15:CODE:PRESTA_STALL_6:88888888-8888-4888-8888-888888888888' },
  { title: "Le Gardien du Temps", description: "Relever l'heure exacte d'ouverture affichee sur le petit panneau cache.", xp_reward: 10, id_location: 15, validation_code: 'QUEST:NEW:LOC:15:CODE:PRESTA_STALL_6:99999999-9999-4999-8999-999999999999' },
  { title: "Le Mot Secret", description: "Obtenir le mot de passe du jour en discutant avec le vendeur.", xp_reward: 10, id_location: 15, validation_code: 'QUEST:NEW:LOC:15:CODE:PRESTA_STALL_6:aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1' },

  // Merchant Stall #7 (location id: 16)
  { title: "Reporter d'un Jour", description: "Interviewer le marchand sur l'histoire de sa boutique (3 questions).", xp_reward: 50, id_location: 16, validation_code: 'QUEST:NEW:LOC:16:CODE:PRESTA_STALL_7:bbbbbbb1-bbbb-4bbb-8bbb-bbbbbbbbbbb1' },
  { title: "Mur des Avis", description: "Dire son avis sur le stand.", xp_reward: 20, id_location: 16, validation_code: 'QUEST:NEW:LOC:16:CODE:PRESTA_STALL_7:ccccccc1-cccc-4ccc-8ccc-ccccccccccc1' },
  { title: "Compteur", description: "Compter le nombre de personne se presentant au stand.", xp_reward: 30, id_location: 16, validation_code: 'QUEST:NEW:LOC:16:CODE:PRESTA_STALL_7:ddddddd1-dddd-4ddd-8ddd-ddddddddddd1' },
  { title: "Dessinateur Amateur", description: "Faire un croquis rapide du stand et l'offrir au marchand.", xp_reward: 55, id_location: 16, validation_code: 'QUEST:NEW:LOC:16:CODE:PRESTA_STALL_7:eeeeeee1-eeee-4eee-8eee-eeeeeeeeeee1' },
  { title: "Souvenir Digital", description: "Prendre en photo le stand.", xp_reward: 25, id_location: 16, validation_code: 'QUEST:NEW:LOC:16:CODE:PRESTA_STALL_7:fffffff1-ffff-4fff-8fff-fffffffffff1' },
];

export async function seedQuests() {
  console.log(' Seeding quests...');

  for (const [index, quest] of questSeeds.entries()) {
    await (prisma.quest as any).upsert({
      where: {
        id_quest: index + 1
      },
      update: quest,
      create: quest
    });
  }

  console.log(`Seeded ${questSeeds.length} quests`);
}

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
