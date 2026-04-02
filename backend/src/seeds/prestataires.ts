import prisma from '../prisma.js';

export async function seedPrestataires() {
  const mappings = [
    { id_user: 1, id_prestataire_type: 1 },
    { id_user: 4, id_prestataire_type: 3 },
  ];

  for (const mapping of mappings) {
    await prisma.prestataire.upsert({
      where: { id_user: mapping.id_user },
      update: { id_prestataire_type: mapping.id_prestataire_type },
      create: mapping,
    });
  }

  console.log('Prestataires seeded');
}
