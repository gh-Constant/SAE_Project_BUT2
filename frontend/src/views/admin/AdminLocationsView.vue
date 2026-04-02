<template>
    <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
        <AdminNavbar :user="user" @logout="handleLogout" />
        <BackToMapButton to="/admin" />
        <div class="py-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Header -->
                <div class="mb-12 text-center">
                    <h1
                        class="text-4xl font-medieval font-bold text-iron-black mb-2 flex items-center justify-center gap-3">
                        <i class="fas fa-map-marked-alt text-antique-bronze text-4xl"></i>
                        {{ t('admin.manage_locations.title') }}
                    </h1>
                    <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
                    <p class="text-base font-body text-stone-grey">
                        {{ t('admin.manage_locations.subtitle') }}
                    </p>
                </div>

            </div>



            <!-- Section: All Locations -->
            <div>
                <h2 class="text-2xl font-medieval font-bold text-iron-black mb-6 flex items-center">
                    <span class="w-8 h-1 bg-antique-bronze rounded-full mr-4"></span>
                    {{ t('admin.manage_locations.section_title') }}
                </h2>

                <div
                    class="bg-white/60 backdrop-blur-sm border border-antique-bronze/20 rounded-lg overflow-hidden shadow-sm">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-antique-bronze/10">
                            <thead class="bg-antique-bronze/10">
                                <tr>
                                    <th scope="col"
                                        class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">
                                        {{ t('admin.manage_locations.table.name') }}
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">
                                        {{ t('admin.manage_locations.table.type') }}
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">
                                        {{ t('admin.manage_locations.table.price') }}
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">
                                        {{ t('admin.manage_locations.table.status') }}
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-4 text-left text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">
                                        {{ t('admin.manage_locations.table.owner') }}
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-4 text-center text-xs font-medieval font-bold text-iron-black uppercase tracking-wider">
                                        {{ t('admin.manage_locations.table.actions') }}
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
                                        {{ location.price }} {{ t('checkout.gold.buy.currency') }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-center">
                                        <span :class="[
                                            'px-2.5 py-0.5 rounded-full text-xs font-bold border',
                                            location.status === 'APPROVED' ? 'bg-green-100/80 text-green-900 border-green-200' :
                                                location.status === 'PENDING' ? 'bg-orange-100/80 text-orange-900 border-orange-200' :
                                                    'bg-yellow-100/80 text-yellow-900 border-yellow-200'
                                        ]">
                                            {{ location.status === 'APPROVED' ? t('admin.manage_locations.status.purchased') : location.status ===
                                                'PENDING' ? t('admin.manage_locations.status.pending') : t('admin.manage_locations.status.available') }}
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
                                                    :title="t('admin.manage_locations.actions.validate_purchase')">
                                                    <i class="fas fa-check-circle text-xl"></i>
                                                </button>
                                                <button @click="onRefuse(location)"
                                                    class="text-red-600 hover:text-red-900 transition-colors p-1"
                                                    :title="t('admin.manage_locations.actions.reject_request')">
                                                    <i class="fas fa-times-circle text-xl"></i>
                                                </button>
                                            </template>

                                            <!-- ALREADY PURCHASED -->
                                            <template v-else-if="location.purchased">
                                                <button @click="openEditModal(location, 'UPDATE')"
                                                    class="text-blue-600 hover:text-blue-900 transition-colors p-1"
                                                    :title="t('admin.manage_locations.actions.edit_location')">
                                                    <i class="fas fa-edit text-lg"></i>
                                                </button>
                                                <button @click="onDelete(location)"
                                                    class="text-red-600 hover:text-red-900 transition-colors p-1"
                                                    :title="t('admin.manage_locations.actions.delete_permanently')">
                                                    <i class="fas fa-trash-alt text-lg"></i>
                                                </button>
                                            </template>

                                            <!-- AVAILABLE -->
                                            <template v-else>
                                                <button @click="openEditModal(location, 'ASSIGN')"
                                                    class="text-antique-bronze hover:text-iron-black transition-colors p-1"
                                                    :title="t('admin.manage_locations.actions.edit_assign')">
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
                            {{ t('admin.manage_locations.loading') }}
                        </p>
                    </div>

                    <!-- Empty State -->
                    <div v-if="!loading && locations.length === 0" class="text-center py-8 text-stone-500 italic">
                        {{ t('admin.manage_locations.empty') }}
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
                {{ modalMode === 'ASSIGN' ? t('admin.manage_locations.modal.assign_owner') : t('admin.manage_locations.modal.edit_location') }}
            </h3>

            <div class="space-y-4">
                <!-- Name & Price Row -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-iron-black mb-1">{{ t('admin.manage_locations.modal.location_name') }}</label>
                        <input v-model="editedLocation.name" type="text"
                            class="w-full p-2 bg-white/50 border border-antique-bronze/30 rounded focus:ring-2 focus:ring-antique-bronze outline-none text-iron-black">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-iron-black mb-1">{{ t('admin.manage_locations.modal.price_gold') }}</label>
                        <input v-model.number="editedLocation.price" type="number"
                            class="w-full p-2 bg-white/50 border border-antique-bronze/30 rounded focus:ring-2 focus:ring-antique-bronze outline-none text-iron-black">
                    </div>
                </div>

                <!-- Description -->
                <div>
                    <label class="block text-sm font-bold text-iron-black mb-1">{{ t('admin.manage_locations.modal.description') }}</label>
                    <Editor v-model="editedLocation.description" />
                </div>

                <div>
                    <label class="block text-sm font-bold text-iron-black mb-2">{{ t('admin.manage_locations.modal.features') }}</label>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <label class="flex items-center gap-2 text-sm text-stone-grey">
                            <input v-model="editedLocation.has_water_access" type="checkbox">
                            {{ t('admin.manage_locations.modal.features_water') }}
                        </label>
                        <label class="flex items-center gap-2 text-sm text-stone-grey">
                            <input v-model="editedLocation.has_electricity" type="checkbox">
                            {{ t('admin.manage_locations.modal.features_electricity') }}
                        </label>
                        <label class="flex items-center gap-2 text-sm text-stone-grey">
                            <input v-model="editedLocation.has_toilets" type="checkbox">
                            {{ t('admin.manage_locations.modal.features_toilets') }}
                        </label>
                        <label class="flex items-center gap-2 text-sm text-stone-grey sm:col-span-2">
                            <input v-model="editedLocation.is_accessible_pmr" type="checkbox">
                            {{ t('admin.manage_locations.modal.features_accessible') }}
                        </label>
                    </div>
                </div>

                <!-- Type Row -->
                <div>
                    <label class="block text-sm font-bold text-iron-black mb-1">{{ t('admin.manage_locations.modal.location_type') }}</label>
                    <select v-model="editedLocation.id_location_type"
                        class="w-full p-2 bg-white/50 border border-antique-bronze/30 rounded focus:ring-2 focus:ring-antique-bronze outline-none text-iron-black">
                        <option :value="1">{{ t('admin.user_stats.roles.prestataire') }}</option>
                        <option :value="2">{{ t('admin.manage_locations.types.story') }}</option>
                        <option :value="3">{{ t('admin.manage_locations.types.other') }}</option>
                    </select>
                </div>

                <!-- Owner -->
                <div>
                    <label class="block text-sm font-bold text-iron-black mb-1">{{ t('admin.manage_locations.modal.owner') }}</label>
                    <select v-model="editedLocation.id_prestataire"
                        class="w-full p-2 bg-white/50 border border-antique-bronze/30 rounded focus:ring-2 focus:ring-antique-bronze outline-none text-iron-black">
                        <option :value="undefined">{{ t('admin.manage_locations.modal.no_owner') }}</option>
                        <option :value="0">{{ t('admin.manage_locations.system_story') }}</option>
                        <option v-for="u in usersStore.allUsers" :key="u.id_user" :value="u.id_user">
                            {{ u.name }} (ID: {{ u.id_user }})
                        </option>
                    </select>
                </div>


            </div>

            <div class="flex justify-end gap-3 mt-8">
                <button @click="closeModal"
                    class="px-4 py-2 text-stone-grey font-bold hover:text-iron-black transition-colors">
                    {{ t('prestataire.profile.messages.cancel') }}
                </button>
                <button @click="saveLocation"
                    class="px-6 py-2 bg-antique-bronze text-white font-bold rounded hover:brightness-110 transition-all shadow-md">
                    {{ t('prestataire.profile.messages.save') }}
                </button>
            </div>
        </div>
    </div>
    <BackToMapButton to="/admin" />

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BackToMapButton from '@/components/shared/BackToMapButton.vue'
import { useAuthStore } from '@/stores/auth';
import { useUsersStore } from '@/stores/users';

import { locationService } from '@/services/locationService';
import { LocationMock } from '@/mocks/locations';
import { LocationType } from '@/mocks/locationTypes';
import AdminNavbar from '@/components/navbar/AdminNavbar.vue';
import Editor from '@/components/editor/Editor.vue';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();
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
        console.error("Error while loading data:", error);
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
    if (confirm(t('admin.manage_locations.confirm_validate', { name: loc.name }))) {
        try {
            await locationService.validatePurchase(loc.id);
            await refreshData();
        } catch (e) {
            console.error(e);
            alert(t('admin.manage_locations.error_validate'));
        }
    }
};

const onRefuse = async (loc: LocationMock) => {
    if (confirm(t('admin.manage_locations.confirm_reject', { name: loc.name }))) {
        try {
            await locationService.rejectPurchase(loc.id);
            await refreshData();
        } catch (e) {
            console.error(e);
            alert(t('admin.manage_locations.error_reject'));
        }
    }
};

const onDelete = async (loc: LocationMock) => {
    if (confirm(t('admin.manage_locations.confirm_delete', { name: loc.name }))) {
        try {
            await locationService.deleteLocation(loc.id);
            await refreshData();
        } catch (e) {
            console.error(e);
            alert(t('admin.manage_locations.error_delete'));
        }
    }
};

const openEditModal = (loc: LocationMock, mode: 'ASSIGN' | 'UPDATE') => {
    modalMode.value = mode;
    // Clone location to avoid direct mutation
    editedLocation.value = {
        ...loc,
        has_water_access: Boolean(loc.has_water_access),
        has_electricity: Boolean(loc.has_electricity),
        has_toilets: Boolean(loc.has_toilets),
        is_accessible_pmr: Boolean(loc.is_accessible_pmr),
    };
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
        alert(t('admin.manage_locations.error_save'));
    }
};

const refreshData = async () => {
    loading.value = true;
    try {
        const locationsData = await locationService.getAllLocations();
        await usersStore.fetchUsers();
        locations.value = locationsData;
    } catch (error) {
        console.error("Error while refreshing:", error);
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
    if (userId === 0) return t('admin.manage_locations.system_story');
    const foundUser = usersStore.allUsers.find((u: any) => u.id === userId);
    if (foundUser) {
        return foundUser.name;
    }
    return t('admin.manage_locations.unknown_owner', { id: userId });
};

const getLocationTypeName = (typeId: number) => {
    switch (typeId) {
        case LocationType.STORY_LOCATION_TYPE_ID: return t('admin.manage_locations.types.story');
        case LocationType.PRESTATAIRE_LOCATION_TYPE_ID: return t('admin.user_stats.roles.prestataire');
        case LocationType.OTHER_LOCATION_TYPE_ID: return t('admin.manage_locations.types.other');
        default: return t('admin.manage_locations.types.unknown');
    }
};
</script>
