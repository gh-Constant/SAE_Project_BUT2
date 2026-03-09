import prisma from '../prisma.js';

export async function seedPrestataires() {
  const users = await prisma.user.findMany({
    where: { role: 'prestataire' },
    select: { id_user: true }
  });

  for (const user of users) {
    await prisma.prestataire.upsert({
      where: { id_user: user.id_user },
      update: {
        id_prestataire_type: 1
      },
      create: {
        id_user: user.id_user,
        id_prestataire_type: 1
      }
    });
  }

  console.log('Prestataires seeded');
}
