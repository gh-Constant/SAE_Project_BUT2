import prisma from '../prisma.js';

export async function seedPrestataireTypes() {
  const types = ['restaurateur', 'animateur', 'artisan'];

  for (let i = 0; i < types.length; i++) {
    await prisma.prestataireType.upsert({
      where: { id_prestataire_type: i + 1 },
      update: {},
      create: { name: types[i] },
    });
  }

  console.log('✅ PrestataireTypes seeded');
}