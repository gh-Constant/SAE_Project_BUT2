<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey pt-24 pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête standardisé -->
      <div class="mb-12 text-center">
        <h1 class="text-4xl md:text-5xl font-medieval font-bold text-iron-black mb-4">
          <i class="fas fa-scroll mr-3 text-antique-bronze"></i>
          Quiz
        </h1>
        <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-6"></div>
        <p class="text-lg text-stone-grey text-center max-w-2xl mx-auto">
          Testez vos connaissances et gagnez de l'XP !
        </p>
      </div>

      <!-- Main Content -->
      <main>
      <!-- Tools Bar -->
      <div class="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm">
        <!-- Search -->
        <div class="relative flex-1 w-full md:max-w-md">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-grey/50">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un quiz..."
            class="w-full pl-10 pr-4 py-2 border border-stone-grey/30 rounded-lg focus:ring-2 focus:ring-antique-bronze focus:border-transparent bg-parchment/30"
          />
        </div>

        <!-- Filters & Sort -->
        <div class="flex flex-wrap gap-3 w-full md:w-auto">
          <!-- Filter by Location -->
          <select 
            v-model="selectedLocation" 
            class="px-4 py-2 border border-stone-grey/30 rounded-lg focus:ring-2 focus:ring-antique-bronze focus:border-transparent bg-white text-stone-grey cursor-pointer"
          >
            <option :value="null">Tous les lieux</option>
            <option v-for="loc in availableLocations" :key="loc" :value="loc">
              {{ loc }}
            </option>
          </select>

          <!-- Sort -->
          <select 
            v-model="sortBy" 
            class="px-4 py-2 border border-stone-grey/30 rounded-lg focus:ring-2 focus:ring-antique-bronze focus:border-transparent bg-white text-stone-grey cursor-pointer"
          >
            <option value="date_desc">Plus récents</option>
            <option value="date_asc">Plus anciens</option>
            <option value="title_asc">Titre (A-Z)</option>
            <option value="title_desc">Titre (Z-A)</option>
          </select>

          <!-- Create quiz button (for prestataires/admins) -->
          <router-link
            v-if="canCreateQuiz"
            to="/quiz/create"
            class="px-4 py-2 bg-antique-bronze text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center flex-shrink-0"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Créer
          </router-link>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-antique-bronze"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-12 text-red-500">
        <p>{{ error }}</p>
        <button 
          @click="loadQuizzes"
          class="mt-4 px-4 py-2 bg-antique-bronze text-white rounded-lg"
        >
          Réessayer
        </button>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredQuizzes.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-stone-grey/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-stone-grey/60">Aucun quiz trouvé</p>
      </div>

      <!-- Quiz Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuizCard
          v-for="quiz in filteredQuizzes"
          :key="quiz.id_quiz"
          :quiz="quiz"
          :questionCount="quiz.questions?.length ?? 5"
          :can-edit="canCreateQuiz && quiz.id_creator === authStore.user?.id"
          @click="navigateToQuiz(quiz.id_quiz)"
          @edit="editQuiz(quiz.id_quiz)"
        />
      </div>
    </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { quizService, type Quiz } from '@/services/quizService';
import QuizCard from '@/components/quiz/QuizCard.vue';
import { Role } from '@/mocks/users';

const router = useRouter();
const authStore = useAuthStore();

const quizzes = ref<Quiz[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');
const sortBy = ref('date_desc');
const selectedLocation = ref<string | null>(null);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const canCreateQuiz = computed(() => {
  const role = authStore.user?.role;
  return role === Role.PRESTATAIRE_ROLE_ID || role === Role.ADMIN_ROLE_ID;
});

const isPrestataire = computed(() => authStore.user?.role === Role.PRESTATAIRE_ROLE_ID);

const availableLocations = computed(() => {
  const locations = new Set<string>();
  quizzes.value.forEach(q => {
    if (q.location?.name) locations.add(q.location.name);
  });
  return Array.from(locations).sort();
});

const filteredQuizzes = computed(() => {
  let result = [...quizzes.value];

  // 1. Filter by Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(quiz => 
      quiz.title.toLowerCase().includes(query) ||
      quiz.description?.toLowerCase().includes(query) ||
      quiz.location?.name.toLowerCase().includes(query)
    );
  }

  // 2. Filter by Location
  if (selectedLocation.value) {
    result = result.filter(quiz => quiz.location?.name === selectedLocation.value);
  }

  // 3. Sort
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'date_asc':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'date_desc':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'title_asc':
        return a.title.localeCompare(b.title);
      case 'title_desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  return result;
});

async function loadQuizzes() {
  loading.value = true;
  error.value = null;

  try {
    const user = authStore.user;
    const isPrestataire = user?.role === Role.PRESTATAIRE_ROLE_ID;

    // Filter by creator if Prestataire (shows active and inactive)
    // Otherwise show only active quizzes (public view)
    const filters = isPrestataire 
      ? { id_creator: user.id } 
      : { is_active: true };

    quizzes.value = await quizService.getQuizzes(filters);
  } catch (err) {
    error.value = 'Impossible de charger les quiz';
    console.error('Error loading quizzes:', err);
  } finally {
    loading.value = false;
  }
}

function navigateToQuiz(id_quiz: number) {
  router.push(`/quiz/${id_quiz}`);
}

function editQuiz(id_quiz: number) {
  router.push(`/quiz/${id_quiz}/edit`);
}

onMounted(() => {
  loadQuizzes();
});
</script>

<style scoped>
</style>
