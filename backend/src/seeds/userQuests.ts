import prisma from '../prisma.js';

// Matches UserQuestStatus enum in schema
enum UserQuestStatus {
  accepted = 'accepted',
  completed = 'completed',
}

const userQuestSeeds = [
  // User 2 (Alice L'Aventurière)
  { id_user: 2, id_quest: 1, status: UserQuestStatus.completed, created_at: new Date('2024-01-15T10:00:00Z'), updated_at: new Date('2024-01-15T14:30:00Z') },
  { id_user: 2, id_quest: 3, status: UserQuestStatus.completed, created_at: new Date('2024-01-16T09:00:00Z'), updated_at: new Date('2024-01-16T09:45:00Z') },
  { id_user: 2, id_quest: 6, status: UserQuestStatus.completed, created_at: new Date('2024-01-17T11:00:00Z'), updated_at: new Date('2024-01-17T13:00:00Z') },
  { id_user: 2, id_quest: 9, status: UserQuestStatus.completed, created_at: new Date('2024-01-18T15:00:00Z'), updated_at: new Date('2024-01-18T17:30:00Z') },
  { id_user: 2, id_quest: 12, status: UserQuestStatus.accepted, created_at: new Date('2024-01-19T08:00:00Z'), updated_at: new Date('2024-01-19T08:00:00Z') },
  { id_user: 2, id_quest: 15, status: UserQuestStatus.completed, created_at: new Date('2024-01-20T10:00:00Z'), updated_at: new Date('2024-01-20T12:00:00Z') },
  { id_user: 2, id_quest: 18, status: UserQuestStatus.completed, created_at: new Date('2024-01-21T09:00:00Z'), updated_at: new Date('2024-01-21T11:30:00Z') },
  { id_user: 2, id_quest: 20, status: UserQuestStatus.accepted, created_at: new Date('2024-01-22T06:00:00Z'), updated_at: new Date('2024-01-22T06:00:00Z') },
  
  // User 1 (Gérard Le prestataire)
  { id_user: 1, id_quest: 2, status: UserQuestStatus.completed, created_at: new Date('2024-01-14T08:00:00Z'), updated_at: new Date('2024-01-14T16:00:00Z') },
  { id_user: 1, id_quest: 5, status: UserQuestStatus.completed, created_at: new Date('2024-01-15T10:00:00Z'), updated_at: new Date('2024-01-15T15:00:00Z') },
  { id_user: 1, id_quest: 8, status: UserQuestStatus.accepted, created_at: new Date('2024-01-16T14:00:00Z'), updated_at: new Date('2024-01-16T14:00:00Z') },
  { id_user: 1, id_quest: 11, status: UserQuestStatus.completed, created_at: new Date('2024-01-17T09:00:00Z'), updated_at: new Date('2024-01-18T11:00:00Z') },
  { id_user: 1, id_quest: 14, status: UserQuestStatus.completed, created_at: new Date('2024-01-19T13:00:00Z'), updated_at: new Date('2024-01-19T15:00:00Z') },
  
  // User 3 (Godefroy Le Sénéchal / Admin)
  { id_user: 3, id_quest: 4, status: UserQuestStatus.completed, created_at: new Date('2024-01-13T07:00:00Z'), updated_at: new Date('2024-01-13T12:00:00Z') },
  { id_user: 3, id_quest: 7, status: UserQuestStatus.completed, created_at: new Date('2024-01-14T19:00:00Z'), updated_at: new Date('2024-01-14T20:30:00Z') },
  { id_user: 3, id_quest: 10, status: UserQuestStatus.accepted, created_at: new Date('2024-01-15T14:00:00Z'), updated_at: new Date('2024-01-15T14:00:00Z') },
  { id_user: 3, id_quest: 16, status: UserQuestStatus.completed, created_at: new Date('2024-01-16T11:00:00Z'), updated_at: new Date('2024-01-16T13:00:00Z') },

  // User 4 (Marie La marchande)
  { id_user: 4, id_quest: 13, status: UserQuestStatus.completed, created_at: new Date('2024-01-16T10:00:00Z'), updated_at: new Date('2024-01-16T11:00:00Z') },
  { id_user: 4, id_quest: 17, status: UserQuestStatus.completed, created_at: new Date('2024-01-15T14:00:00Z'), updated_at: new Date('2024-01-15T16:30:00Z') },

  // User 5 (Pierre Le Paysan)
  { id_user: 5, id_quest: 1, status: UserQuestStatus.accepted, created_at: new Date('2024-01-22T08:00:00Z'), updated_at: new Date('2024-01-22T08:00:00Z') },
];

export async function seedUserQuests() {
  console.log('📜 Seeding user quests...');
  
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
if (require.main === module) {
  seedUserQuests()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error(e);
      prisma.$disconnect();
      process.exit(1);
    });
}
