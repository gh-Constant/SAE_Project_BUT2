<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey selection:bg-antique-bronze selection:text-white">
    <AdminNavbar :user="user" @logout="logout" />

    <main class="w-full py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex flex-col items-center justify-center mb-8 gap-4 text-center">
          <div>
            <h1 class="text-3xl font-medieval font-bold text-iron-black mb-2">{{ t('admin.quizzes.title') }}</h1>
            <p class="text-stone-grey">{{ t('admin.quizzes.subtitle') }}</p>
          </div>
        </div>
  
        <!-- Filters -->
        <!-- Search and Sort -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 mb-4 border border-antique-bronze/20">
          <div class="flex flex-col md:flex-row gap-4">
            <!-- Search -->
            <div class="flex-1">
              <div class="relative">
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  :placeholder="t('admin.quizzes.search.placeholder')" 
                  class="w-full pl-10 pr-4 py-2 bg-parchment/50 border border-stone-grey/20 rounded-lg focus:ring-2 focus:ring-antique-bronze/50 focus:border-antique-bronze transition-all"
                />
                <i class="fas fa-search absolute left-3 top-3 text-stone-grey/50"></i>
              </div>
            </div>

            <!-- Sort -->
            <div class="md:w-64">
              <div class="relative">
                <i class="fas fa-sort absolute left-3 top-3 text-stone-grey/50"></i>
                <select 
                  v-model="sortBy" 
                  class="w-full pl-10 pr-4 py-2 bg-parchment/50 border border-stone-grey/20 rounded-lg focus:ring-2 focus:ring-antique-bronze/50 focus:border-antique-bronze transition-all appearance-none"
                >
                  <option value="title-asc">{{ t('quiz.list.sort.title_asc') }}</option>
                  <option value="title-desc">{{ t('quiz.list.sort.title_desc') }}</option>
                  <option value="location-asc">{{ t('quiz.list.sort.location_asc') }}</option>
                  <option value="location-desc">{{ t('quiz.list.sort.location_desc') }}</option>
                  <option value="creator-asc">{{ t('quiz.list.sort.creator_asc') }}</option>
                  <option value="creator-desc">{{ t('quiz.list.sort.creator_desc') }}</option>
                </select>
                <i class="fas fa-chevron-down absolute right-3 top-3 text-stone-grey/50 pointer-events-none"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 mb-8 border border-antique-bronze/20">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Location Filter -->
            <select 
              v-model="locationFilter" 
              class="w-full px-4 py-2 bg-parchment/50 border border-stone-grey/20 rounded-lg focus:ring-2 focus:ring-antique-bronze/50 focus:border-antique-bronze transition-all"
            >
              <option :value="null">{{ t('admin.quizzes.filter.all_locations') }}</option>
              <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
            </select>

            <!-- Creator Filter -->
            <select 
              v-model="creatorFilter" 
              class="w-full px-4 py-2 bg-parchment/50 border border-stone-grey/20 rounded-lg focus:ring-2 focus:ring-antique-bronze/50 focus:border-antique-bronze transition-all"
            >
              <option :value="null">{{ t('admin.quizzes.filter.all_creators') }}</option>
              <option v-for="creator in creators" :key="creator.id_user" :value="creator.id_user">
                {{ creator.firstname }} {{ creator.lastname }}
              </option>
            </select>
          </div>
        </div>
  
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-antique-bronze"></div>
        </div>
  
        <!-- Quiz List -->
        <div v-else class="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-antique-bronze/20 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-antique-bronze/5 border-b border-antique-bronze/10">
                <tr>
                  <th class="px-6 py-4 font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.quizzes.table.headers.title') }}</th>
                  <th class="px-6 py-4 font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.quizzes.table.headers.location') }}</th>
                  <th class="px-6 py-4 font-medieval font-bold text-iron-black uppercase tracking-wider">{{ t('admin.quizzes.table.headers.creator') }}</th>
                  <th class="px-6 py-4 font-medieval font-bold text-iron-black text-right uppercase tracking-wider">{{ t('admin.quizzes.table.headers.actions') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-antique-bronze/10">
                <tr 
                  v-for="quiz in filteredQuizzes" 
                  :key="quiz.id_quiz"
                  class="hover:bg-antique-bronze/5 transition-colors"
                >
                  <!-- Quiz Info -->
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-stone-200">
                        <img 
                          v-if="quiz.image_url" 
                          :src="quiz.image_url" 
                          :alt="quiz.title" 
                          class="w-full h-full object-cover"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center text-stone-400">
                          <i class="fas fa-question"></i>
                        </div>
                      </div>
                      <div>
                        <div class="font-bold text-iron-black">{{ quiz.title }}</div>
                        <div class="text-xs text-stone-grey/70">{{ t('quiz.list.questions_count', { count: quiz.questions?.length ?? quiz._count?.questions ?? 0 }) }}</div>
                      </div>
                    </div>
                  </td>
  
                  <!-- Location -->
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ quiz.location?.name || t('admin.quizzes.table.unknown_location') }}
                    </span>
                  </td>
  
                  <!-- Creator -->
                  <td class="px-6 py-4">
                    <div class="text-sm">
                      {{ quiz.creator ? `${quiz.creator.firstname} ${quiz.creator.lastname}` : t('admin.quizzes.table.system_creator') }}
                    </div>
                  </td>
  
                  <!-- Actions -->
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <router-link 
                        :to="{ path: `/quiz/${quiz.id_quiz}`, query: { returnTo: '/admin/quizzes' } }"
                        class="p-2 text-stone-400 hover:text-green-600 transition-colors"
                        :title="t('admin.quizzes.table.actions.test')"
                      >
                        <i class="fas fa-play"></i>
                      </router-link>
                      <router-link 
                        :to="`/quiz/${quiz.id_quiz}/edit`"
                        class="p-2 text-stone-400 hover:text-antique-bronze transition-colors"
                        :title="t('admin.quizzes.table.actions.edit')"
                      >
                        <i class="fas fa-edit"></i>
                      </router-link>
                      <button 
                        @click="deleteQuiz(quiz)"
                        class="p-2 text-stone-400 hover:text-red-500 transition-colors"
                        :title="t('admin.quizzes.table.actions.delete')"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                
                <!-- Empty State -->
                <tr v-if="filteredQuizzes.length === 0">
                  <td colspan="6" class="px-6 py-12 text-center text-stone-grey">
                    <div class="flex flex-col items-center justify-center">
                      <i class="fas fa-search text-4xl mb-4 text-stone-300"></i>
                      <p class="text-lg font-medieval">{{ t('admin.quizzes.table.empty.title') }}</p>
                      <p class="text-sm opacity-70">{{ t('admin.quests.no_results.subtitle') }}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { quizService, type Quiz } from '@/services/quizService';
import { locationService } from '@/services/locationService';
import type { LocationMock } from '@/mocks/locations';
import { useI18n } from 'vue-i18n';
import AdminNavbar from '@/components/navbar/AdminNavbar.vue';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();
const user = computed(() => authStore.user);

const logout = () => {
  authStore.logout();
  router.push('/login');
};

const loading = ref(true);
const quizzes = ref<Quiz[]>([]);
const locations = ref<LocationMock[]>([]);

const searchQuery = ref('');
const locationFilter = ref<number | null>(null);
const creatorFilter = ref<number | null>(null);

const creators = computed(() => {
  const uniqueCreators = new Map();
  quizzes.value.forEach(quiz => {
    if (quiz.creator && !uniqueCreators.has(quiz.creator.id_user)) {
      uniqueCreators.set(quiz.creator.id_user, quiz.creator);
    }
  });
  return Array.from(uniqueCreators.values());
});

type SortOption = 'title-asc' | 'title-desc' | 'location-asc' | 'location-desc' | 'creator-asc' | 'creator-desc';
const sortBy = ref<SortOption>('title-asc');

const filteredQuizzes = computed(() => {
  let result = quizzes.value.filter(quiz => {
    // Search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      const matchesTitle = quiz.title.toLowerCase().includes(query);
      const matchesCreator = quiz.creator && 
        (quiz.creator.firstname.toLowerCase().includes(query) || 
         quiz.creator.lastname.toLowerCase().includes(query));
      
      if (!matchesTitle && !matchesCreator) return false;
    }

    // Location
    if (locationFilter.value !== null && quiz.id_location !== locationFilter.value) {
      return false;
    }

    // Creator
    if (creatorFilter.value !== null && quiz.creator?.id_user !== creatorFilter.value) {
      return false;
    }

    return true;
  });

  // Sort
  return result.sort((a, b) => {
    const [field, order] = sortBy.value.split('-');
    
    let propA: string | undefined = '';
    let propB: string | undefined = '';

    switch (field) {
      case 'title':
        propA = a.title;
        propB = b.title;
        break;
      case 'location':
        propA = a.location?.name;
        propB = b.location?.name;
        break;
      case 'creator':
        propA = a.creator ? `${a.creator.lastname} ${a.creator.firstname}` : '';
        propB = b.creator ? `${b.creator.lastname} ${b.creator.firstname}` : '';
        break;
    }

    if (!propA) propA = '';
    if (!propB) propB = '';

    const comparison = propA.localeCompare(propB, 'fr', { sensitivity: 'base' });
    return order === 'asc' ? comparison : -comparison;
  });
});

async function loadData() {
  loading.value = true;
  try {
    const [quizResponse, fetchedLocations] = await Promise.all([
      quizService.getQuizzes(),
      locationService.getAllLocations()
    ]);
    quizzes.value = quizResponse.quizzes;
    locations.value = fetchedLocations;
  } catch (err) {
    console.error('Error loading admin data:', err);
  } finally {
    loading.value = false;
  }
}

async function deleteQuiz(quiz: Quiz) {
  if (!confirm(t('admin.quizzes.table.delete_confirm', { title: quiz.title }))) {
    return;
  }

  try {
    await quizService.deleteQuiz(quiz.id_quiz);
    quizzes.value = quizzes.value.filter(q => q.id_quiz !== quiz.id_quiz);
  } catch (err) {
    console.error('Error deleting quiz:', err);
    alert(t('admin.quizzes.table.delete_error'));
  }
}

onMounted(() => {
    loadData();
});
</script>