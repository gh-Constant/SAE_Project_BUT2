import prisma from '../prisma.js';

export async function seedServiceTypes() {
  const types = ['shop', 'reservation', 'blog', 'restaurant', 'quest', 'quiz'];

  console.log('🏷️ Seeding service types...');

  for (let i = 0; i < types.length; i++) {
    await prisma.serviceType.upsert({
      where: { id_service_type: i + 1 },
      update: { name: types[i] },
      create: { name: types[i] },
    });
  }

  console.log('✅ ServiceTypes seeded');
}
