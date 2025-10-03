import prisma from '../prisma.js';

export async function seedPrestataireTypes() {
  const types = ['restaurateur', 'animateur', 'artisan'];

  for (const name of types) {
    await prisma.prestataireType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('✅ PrestataireTypes seeded');
}