import prisma from '../prisma.js';

export async function seedLocationTypes() {
  const types = ['prestataire', 'story', 'other'];

  for (let i = 0; i < types.length; i++) {
    await prisma.locationType.upsert({
      where: { id_location_type: i + 1 },
      update: {},
      create: { name: types[i] },
    });
  }

  console.log('✅ LocationTypes seeded');
}