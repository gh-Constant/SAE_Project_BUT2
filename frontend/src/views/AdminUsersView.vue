<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <AdminNavbar :user="user" @logout="handleLogout" />

    <div class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-12 text-center">
          <h1 class="text-4xl font-medieval font-bold text-iron-black mb-2 flex items-center justify-center gap-3">
            <svg class="w-8 h-8 text-antique-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            Gestion des Utilisateurs
          </h1>
          <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
          <p class="text-base font-body text-stone-grey">Supervision et validation des comptes utilisateurs</p>
        </div>


        <!-- Section: All Users -->
        <div>
          <h2 class="text-2xl font-medieval font-bold text-iron-black mb-6 flex items-center">
            <span class="w-8 h-1 bg-antique-bronze rounded-full mr-4"></span>
            Tous les Utilisateurs
          </h2>

          <div v-if="unverifiedUsers.length !== 0"
            class=" bg-white/40 rounded-lg p-8 text-center border border-antique-bronze/10">
            <p class="text-stone-grey italic">Inscription en attente: {{ unverifiedUsers.length }}</p>
          </div>

          <div
            class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-lg overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-antique-bronze/10">
                <thead class="bg-antique-bronze/10">
                  <tr>
                    <th scope="col"
                      class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">
                      Nom</th>
                    <th scope="col"
                      class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">
                      Email</th>
                    <th scope="col"
                      class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">
                      Type</th>
                    <th scope="col"
                      class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">
                      Statut</th>
                    <th scope="col"
                      class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">
                      Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-antique-bronze/10 font-body">
                  <tr v-for="user in allUsers" :key="user.id" class="hover:bg-antique-bronze/5 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-iron-black">
                      {{ user.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-stone-grey">
                      {{ user.email }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-antique-bronze">
                      {{ getRoleLabel(user.role) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <span :class="[
                        'px-2.5 py-0.5 rounded-full text-xs font-bold border',
                        user.isVerified
                          ? 'bg-green-100/80 text-green-900 border-green-200'
                          : 'bg-yellow-100/80 text-yellow-900 border-yellow-200'
                      ]">
                        {{ user.isVerified ? 'Vérifié' : 'En attente' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div class="flex items-center justify-center gap-2">
                        <button v-if="!user.isVerified" @click="verifyUser(user.id)"
                          class="text-green-600 hover:text-green-900 transition-colors p-1" title="Vérifier">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button @click="deleteUser(user.id)"
                          class="text-red-600 hover:text-red-900 transition-colors p-1" title="Supprimer">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUsersStore } from '@/stores/users';
import AdminNavbar from '@/components/navbar/AdminNavbar.vue';

const router = useRouter();
const authStore = useAuthStore();
const usersStore = useUsersStore();

const user = computed(() => authStore.user);
const unverifiedUsers = computed(() => usersStore.unverifiedUsers);
const allUsers = computed(() => {
  const users = usersStore.allUsers;
  return users.sort((a, b) => {
    // 1. Unverified first
    if (!a.isVerified && b.isVerified) return -1;
    if (a.isVerified && !b.isVerified) return 1;

    // 2. Prestataire before others (among verified or among unverified)
    // Actually the requirement says "garder comme ordre les utilisateur non vérifié au début et ensuite rajouté les prestataire au début"
    // This implies sorting by verification status first (unverified first), 
    // AND THEN sorting by role (Prestataire first).

    if (a.role === 'prestataire' && b.role !== 'prestataire') return -1;
    if (a.role !== 'prestataire' && b.role === 'prestataire') return 1;

    // 3. Adventurer after Provider (implicit from above if we just push provider to top)
    if (a.role === 'aventurier' && b.role !== 'aventurier' && b.role !== 'prestataire') return -1;

    return 0;
  });
});

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'prestataire': return 'Prestataire';
    case 'aventurier': return 'Aventurier';
    case 'admin': return 'Admin';
    default: return role;
  }
};

onMounted(async () => {
  await usersStore.fetchUsers();
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const verifyUser = async (userId: number) => {
  await usersStore.verifyUser(userId);
};

const deleteUser = async (userId: number) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
    await usersStore.deleteUser(userId);
  }
};
</script>