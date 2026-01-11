<template>
    <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
        <AdminNavbar :user="user" @logout="handleLogout" />
        <div class="py-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Header -->
                <div class="mb-12 text-center">
                    <h1
                        class="text-4xl font-medieval font-bold text-iron-black mb-2 flex items-center justify-center gap-3">
                        <i class="fas fa-map-marked-alt text-antique-bronze text-4xl"></i>
                        Gestion des Lieux
                    </h1>
                    <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
                    <p class="text-base font-body text-stone-grey">
                        Visualisation de tous les lieux et leurs propriétaires
                    </p>
                </div>

            </div>



            <!-- Section: All Locations -->
            <div>
                <h2 class="text-2xl font-medieval font-bold text-iron-black mb-6 flex items-center">
                    <span class="w-8 h-1 bg-antique-bronze rounded-full mr-4"></span>
                    Liste des Lieux
                </h2>

                <div
                    class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-lg overflow-hidden shadow-sm">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-antique-bronze/10">
                            <thead class="bg-antique-bronze/10">
                                <tr>
                                    <th scope="col"
                                        class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">
                                        Nom
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">
                                        Prix
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">
                                        Propriétaire
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-antique-bronze/10 font-body">
                                <tr v-for="location in sortedLocations" :key="location.id"
                                    class="hover:bg-antique-bronze/5 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-iron-black">
                                        {{ location.name }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-stone-grey">
                                        {{ getLocationTypeName(location.id_location_type) }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-stone-grey">
                                        {{ location.price }} Gold
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-center">
                                        <span :class="[
                                            'px-2.5 py-0.5 rounded-full text-xs font-bold border',
                                            location.status === 'APPROVED' ? 'bg-green-100/80 text-green-900 border-green-200' :
                                                location.status === 'PENDING' ? 'bg-orange-100/80 text-orange-900 border-orange-200' :
                                                    'bg-yellow-100/80 text-yellow-900 border-yellow-200'
                                        ]">
                                            {{ location.status === 'APPROVED' ? 'Acheté' : location.status ===
                                                'PENDING' ? 'En Attente' : 'Disponible' }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-stone-grey">
                                        <div v-if="location.purchased && location.id_prestataire"
                                            class="flex items-center gap-2">
                                            <i class="fas fa-user-circle text-antique-bronze/60"></i>
                                            {{ getOwnerName(location.id_prestataire) }}
                                        </div>
                                        <div v-else class="text-stone-400 italic">
                                            -
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div class="flex items-center justify-center gap-2">
                                            <!-- VALIDATION PENDING -->
                                            <template v-if="location.status === 'PENDING'">
                                                <button @click="onValidate(location)"
                                                    class="text-green-600 hover:text-green-900 transition-colors p-1"
                                                    title="Valider l'achat">
                                                    <i class="fas fa-check-circle text-xl"></i>
                                                </button>
                                                <button @click="onRefuse(location)"
                                                    class="text-red-600 hover:text-red-900 transition-colors p-1"
                                                    title="Refuser la demande">
                                                    <i class="fas fa-times-circle text-xl"></i>
                                                </button>
                                            </template>

                                            <!-- ALREADY PURCHASED -->
                                            <template v-else-if="location.purchased">
                                                <button @click="openEditModal(location, 'UPDATE')"
                                                    class="text-blue-600 hover:text-blue-900 transition-colors p-1"
                                                    title="Modifier le lieu">
                                                    <i class="fas fa-edit text-lg"></i>
                                                </button>
                                                <button @click="onDelete(location)"
                                                    class="text-red-600 hover:text-red-900 transition-colors p-1"
                                                    title="Supprimer définitivement">
                                                    <i class="fas fa-trash-alt text-lg"></i>
                                                </button>
                                            </template>

                                            <!-- AVAILABLE -->
                                            <template v-else>
                                                <button @click="openEditModal(location, 'ASSIGN')"
                                                    class="text-antique-bronze hover:text-iron-black transition-colors p-1"
                                                    title="Modifier / Assigner">
                                                    <i class="fas fa-edit text-lg"></i>
                                                </button>
                                            </template>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Loading State -->
                    <div v-if="loading" class="text-center py-12">
                        <p class="text-xl font-medieval animate-pulse text-antique-bronze">
                            Chargement des données...
                        </p>
                    </div>

                    <!-- Empty State -->
                    <div v-if="!loading && locations.length === 0" class="text-center py-8 text-stone-500 italic">
                        Aucun lieu trouvé.
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit/Assign Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div
            class="bg-parchment border-4 border-antique-bronze rounded-lg shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button @click="closeModal" class="absolute top-2 right-2 text-stone-grey hover:text-iron-black">
                <i class="fas fa-times text-xl"></i>
            </button>

            <h3 class="text-2xl font-medieval font-bold text-iron-black mb-6">
                {{ modalMode === 'ASSIGN' ? 'Assigner un propriétaire' : 'Modifier le lieu' }}
            </h3>

            <div class="space-y-4">
                <!-- Name & Price Row -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-iron-black mb-1">Nom du lieu</label>
                        <input v-model="editedLocation.name" type="text"
                            class="w-full p-2 bg-white/50 border border-antique-bronze/30 rounded focus:ring-2 focus:ring-antique-bronze outline-none text-iron-black">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-iron-black mb-1">Prix (Gold)</label>
                        <input v-model.number="editedLocation.price" type="number"
                            class="w-full p-2 bg-white/50 border border-antique-bronze/30 rounded focus:ring-2 focus:ring-antique-bronze outline-none text-iron-black">
                    </div>
                </div>

                <!-- Description -->
                <div>
                    <label class="block text-sm font-bold text-iron-black mb-1">Description</label>
                    <textarea v-model="editedLocation.description" rows="3"
                        class="w-full p-2 bg-white/50 border border-antique-bronze/30 rounded focus:ring-2 focus:ring-antique-bronze outline-none text-iron-black"></textarea>
                </div>

                <!-- Type Row -->
                <div>
                    <label class="block text-sm font-bold text-iron-black mb-1">Type de lieu</label>
                    <select v-model="editedLocation.id_location_type"
                        class="w-full p-2 bg-white/50 border border-antique-bronze/30 rounded focus:ring-2 focus:ring-antique-bronze outline-none text-iron-black">
                        <option :value="1">Prestataire</option>
                        <option :value="2">Histoire</option>
                        <option :value="3">Autre</option>
                    </select>
                </div>

                <!-- Owner -->
                <div>
                    <label class="block text-sm font-bold text-iron-black mb-1">Propriétaire</label>
                    <select v-model="editedLocation.id_prestataire"
                        class="w-full p-2 bg-white/50 border border-antique-bronze/30 rounded focus:ring-2 focus:ring-antique-bronze outline-none text-iron-black">
                        <option :value="undefined">-- Aucun --</option>
                        <option :value="0">Système / Histoire</option>
                        <option v-for="u in usersStore.allUsers" :key="u.id_user" :value="u.id_user">
                            {{ u.name }} (ID: {{ u.id_user }})
                        </option>
                    </select>
                </div>


            </div>

            <div class="flex justify-end gap-3 mt-8">
                <button @click="closeModal"
                    class="px-4 py-2 text-stone-grey font-bold hover:text-iron-black transition-colors">
                    Annuler
                </button>
                <button @click="saveLocation"
                    class="px-6 py-2 bg-antique-bronze text-white font-bold rounded hover:brightness-110 transition-all shadow-md">
                    Enregistrer
                </button>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUsersStore } from '@/stores/users';

import { locationService } from '@/services/locationService';
import { LocationMock } from '@/mocks/locations';
import { LocationType } from '@/mocks/locationTypes';
import AdminNavbar from '@/components/navbar/AdminNavbar.vue';

const router = useRouter();
const authStore = useAuthStore();
const usersStore = useUsersStore();

const user = computed(() => authStore.user);

const locations = ref<LocationMock[]>([]);
const loading = ref(true);

onMounted(async () => {
    loading.value = true;
    try {
        const [fetchedLocations] = await Promise.all([
            locationService.getAllLocations(),
            usersStore.fetchUsers() // Fetch users to map owners
        ]);
        locations.value = fetchedLocations;
    } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
    } finally {
        loading.value = false;
    }
});

// Modal State
const showModal = ref(false);
const modalMode = ref<'ASSIGN' | 'UPDATE'>('ASSIGN');
const editedLocation = ref<Partial<LocationMock>>({});

// Actions
const onValidate = async (loc: LocationMock) => {
    if (confirm(`Valider l'achat de "${loc.name}" ?`)) {
        try {
            await locationService.validatePurchase(loc.id);
            await refreshData();
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la validation");
        }
    }
};

const onRefuse = async (loc: LocationMock) => {
    if (confirm(`Refuser la demande pour "${loc.name}" ?`)) {
        try {
            await locationService.rejectPurchase(loc.id);
            await refreshData();
        } catch (e) {
            console.error(e);
            alert("Erreur lors du refus");
        }
    }
};

const onDelete = async (loc: LocationMock) => {
    if (confirm(`Êtes-vous sûr de vouloir SUPPRIMER DÉFINITIVEMENT le lieu "${loc.name}" ? Cette action est irréversible.`)) {
        try {
            await locationService.deleteLocation(loc.id);
            await refreshData();
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la suppression");
        }
    }
};

const openEditModal = (loc: LocationMock, mode: 'ASSIGN' | 'UPDATE') => {
    modalMode.value = mode;
    // Clone location to avoid direct mutation
    editedLocation.value = { ...loc };
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    editedLocation.value = {};
};

const saveLocation = async () => {
    try {
        if (!editedLocation.value.id) return; // Should not happen for edit

        // Ensure types are correct
        const payload = { ...editedLocation.value } as LocationMock;

        await locationService.updateLocation(payload);
        closeModal();
        await refreshData();
    } catch (e) {
        console.error(e);
        alert("Erreur lors de l'enregistrement");
    }
};

const refreshData = async () => {
    loading.value = true;
    try {
        const locationsData = await locationService.getAllLocations();
        await usersStore.fetchUsers();
        locations.value = locationsData;
    } catch (error) {
        console.error("Erreur lors du rafraîchissement:", error);
    } finally {
        loading.value = false;
    }
};

const sortedLocations = computed(() => {
    return [...locations.value].sort((a, b) => {
        // PENDING first
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
        if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;

        // Then purchased
        if (a.purchased === b.purchased) {
            return a.name.localeCompare(b.name);
        }
        return a.purchased ? -1 : 1;
    });
});

const handleLogout = () => {
    authStore.logout();
    router.push('/login');
};

const getOwnerName = (userId: number) => {
    if (userId === 0) return 'Système / Histoire';
    const foundUser = usersStore.allUsers.find((u: any) => u.id === userId);
    if (foundUser) {
        return foundUser.name;
    }
    return `ID: ${userId} (Inconnu)`;
};

const getLocationTypeName = (typeId: number) => {
    switch (typeId) {
        case LocationType.STORY_LOCATION_TYPE_ID: return 'Histoire';
        case LocationType.PRESTATAIRE_LOCATION_TYPE_ID: return 'Prestataire';
        case LocationType.OTHER_LOCATION_TYPE_ID: return 'Autre';
        default: return 'Inconnu';
    }
};
</script>
