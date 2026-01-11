import prisma from '../prisma.js';

// Matches UserQuestStatus enum in schema
enum UserQuestStatus {
  accepted = 'accepted',
  completed = 'completed',
}

const userQuestSeeds = [
  // User 2 (Alice L'Aventurière) - Mix of quests from all merchant stalls
  { id_user: 2, id_quest: 1, status: UserQuestStatus.completed, created_at: new Date('2024-01-15T10:00:00Z'), updated_at: new Date('2024-01-15T14:30:00Z') },  // Ranger l'étalage (Stall #5)
  { id_user: 2, id_quest: 3, status: UserQuestStatus.completed, created_at: new Date('2024-01-16T09:00:00Z'), updated_at: new Date('2024-01-16T09:45:00Z') },  // Inventaire du matin (Stall #5)
  { id_user: 2, id_quest: 6, status: UserQuestStatus.completed, created_at: new Date('2024-01-17T11:00:00Z'), updated_at: new Date('2024-01-17T13:00:00Z') },  // Protection du stand (Stall #5)
  { id_user: 2, id_quest: 9, status: UserQuestStatus.completed, created_at: new Date('2024-01-18T15:00:00Z'), updated_at: new Date('2024-01-18T17:30:00Z') },  // Service client (Stall #6)
  { id_user: 2, id_quest: 12, status: UserQuestStatus.accepted, created_at: new Date('2024-01-19T08:00:00Z'), updated_at: new Date('2024-01-19T08:00:00Z') }, // Commande spéciale (Stall #6)

  // NOTE: User 1 (Gérard) and User 4 (Marie) are prestataires - they cannot accept quests, only create them

  // User 3 (Godefroy Le Sénéchal / Admin) - Various quests
  { id_user: 3, id_quest: 4, status: UserQuestStatus.completed, created_at: new Date('2024-01-13T07:00:00Z'), updated_at: new Date('2024-01-13T12:00:00Z') },  // Livraison urgente (Stall #5)
  { id_user: 3, id_quest: 7, status: UserQuestStatus.completed, created_at: new Date('2024-01-14T19:00:00Z'), updated_at: new Date('2024-01-14T20:30:00Z') },  // Démonstration produit (Stall #5)
  { id_user: 3, id_quest: 10, status: UserQuestStatus.accepted, created_at: new Date('2024-01-15T14:00:00Z'), updated_at: new Date('2024-01-15T14:00:00Z') }, // Collecte de paiements (Stall #6)

  // User 5 (Pierre Le Paysan) - Beginner quest
  { id_user: 5, id_quest: 1, status: UserQuestStatus.accepted, created_at: new Date('2024-01-22T08:00:00Z'), updated_at: new Date('2024-01-22T08:00:00Z') },  // Ranger l'étalage (Stall #5)
  { id_user: 5, id_quest: 2, status: UserQuestStatus.completed, created_at: new Date('2024-01-23T09:00:00Z'), updated_at: new Date('2024-01-23T11:00:00Z') },  // Attirer les clients (Stall #5)
  { id_user: 5, id_quest: 8, status: UserQuestStatus.accepted, created_at: new Date('2024-01-24T10:00:00Z'), updated_at: new Date('2024-01-24T10:00:00Z') },  // Préparation du stand (Stall #6)
];

export async function seedUserQuests() {
  console.log(' Seeding user quests...');

  for (const uq of userQuestSeeds) {
    await prisma.userQuest.upsert({
      where: {
        id_user_id_quest: {
          id_user: uq.id_user,
          id_quest: uq.id_quest
        }
      },
      update: uq,
      create: uq
    });
  }

  console.log(`✅ Seeded ${userQuestSeeds.length} user quests`);
}

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`;
if (isMainModule) {
  seedUserQuests()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error(e);
      prisma.$disconnect();
      process.exit(1);
    });
}
