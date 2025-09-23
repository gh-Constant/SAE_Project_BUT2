import prisma from '../prisma.js';

export async function seedRoles() {
  const roles = ['aventurer', 'artisan', 'admin'];

  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('✅ Roles seeded');
}