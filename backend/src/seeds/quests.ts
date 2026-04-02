import prisma from '../prisma.js';

const questSeeds = [
  { title: 'Le plat signature', description: 'Repere le plat signature affiche sur l ardoise de la Rotisserie et annonce-le au serveur.', xp_reward: 60, id_location: 14, validation_code: 'QUEST:NEW:LOC:14:CODE:PRESTA_STALL_5:11111111-1111-4111-8111-111111111111' },
  { title: 'La table des epices', description: 'Identifie deux epices presentes sur la table de demonstration et fais-les valider sur place.', xp_reward: 45, id_location: 14, validation_code: 'QUEST:NEW:LOC:14:CODE:PRESTA_STALL_5:22222222-2222-4222-8222-222222222222' },
  { title: 'Le toast du banquet', description: 'Apprends la formule du toast affichee pres de la scene et recite-la correctement.', xp_reward: 55, id_location: 14, validation_code: 'QUEST:NEW:LOC:14:CODE:PRESTA_STALL_5:33333333-3333-4333-8333-333333333333' },
  { title: 'Dessert du jour', description: 'Trouve quel dessert sort du four et confirme-le au comptoir.', xp_reward: 35, id_location: 14, validation_code: 'QUEST:NEW:LOC:14:CODE:PRESTA_STALL_5:44444444-4444-4444-8444-444444444444' },
  { title: 'Mission plateau', description: 'Aide l equipe a apporter un plateau jusqu a la table marquee du lion puis reviens faire valider.', xp_reward: 70, id_location: 14, validation_code: 'QUEST:NEW:LOC:14:CODE:PRESTA_STALL_5:55555555-5555-4555-8555-555555555555' },

  { title: 'L accord parfait', description: 'Retrouve l accord recommande entre une tourte et une boisson dans le Cellier.', xp_reward: 50, id_location: 15, validation_code: 'QUEST:NEW:LOC:15:CODE:PRESTA_STALL_6:66666666-6666-4666-8666-666666666666' },
  { title: 'La bouteille mystere', description: 'Observe la couleur du breuvage mystere et donne sa bonne description au tavernier.', xp_reward: 55, id_location: 15, validation_code: 'QUEST:NEW:LOC:15:CODE:PRESTA_STALL_6:77777777-7777-4777-8777-777777777777' },
  { title: 'La devise du Cellier', description: 'Repere la devise ecrite derriere le comptoir et note-la exactement.', xp_reward: 25, id_location: 15, validation_code: 'QUEST:NEW:LOC:15:CODE:PRESTA_STALL_6:88888888-8888-4888-8888-888888888888' },
  { title: 'Le panier du voyageur', description: 'Compose un panier coherent pour un trajet de deux heures et montre ton choix au vendeur.', xp_reward: 40, id_location: 15, validation_code: 'QUEST:NEW:LOC:15:CODE:PRESTA_STALL_6:99999999-9999-4999-8999-999999999999' },
  { title: 'Le bon conseil', description: 'Demande au staff quel met conseiller a un premier visiteur et retiens leur recommandation.', xp_reward: 35, id_location: 15, validation_code: 'QUEST:NEW:LOC:15:CODE:PRESTA_STALL_6:aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1' },

  { title: 'La piece maitresse', description: 'Trouve la piece la plus minutieuse de l atelier et decris le materiau principal utilise.', xp_reward: 55, id_location: 16, validation_code: 'QUEST:NEW:LOC:16:CODE:PRESTA_STALL_7:bbbbbbb1-bbbb-4bbb-8bbb-bbbbbbbbbbb1' },
  { title: 'Le geste juste', description: 'Observe une demonstration de tir et cite une consigne de securite donnee par Marie.', xp_reward: 45, id_location: 16, validation_code: 'QUEST:NEW:LOC:16:CODE:PRESTA_STALL_7:ccccccc1-cccc-4ccc-8ccc-ccccccccccc1' },
  { title: 'Le detail grave', description: 'Repere le motif grave sur le carquois expose au centre du stand.', xp_reward: 40, id_location: 16, validation_code: 'QUEST:NEW:LOC:16:CODE:PRESTA_STALL_7:ddddddd1-dddd-4ddd-8ddd-ddddddddddd1' },
  { title: 'Le choix de l artisan', description: 'Demande a l artisan quel outil elle utilise pour la finition du cuir.', xp_reward: 50, id_location: 16, validation_code: 'QUEST:NEW:LOC:16:CODE:PRESTA_STALL_7:eeeeeee1-eeee-4eee-8eee-eeeeeeeeeee1' },
  { title: 'Le blason cache', description: 'Retrouve le petit blason suspendu pres de l entree et note son animal.', xp_reward: 30, id_location: 16, validation_code: 'QUEST:NEW:LOC:16:CODE:PRESTA_STALL_7:fffffff1-ffff-4fff-8fff-fffffffffff1' }
];

export async function seedQuests() {
  console.log('Seeding quests...');

  for (const [index, quest] of questSeeds.entries()) {
    await (prisma.quest as any).upsert({
      where: { id_quest: index + 1 },
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
