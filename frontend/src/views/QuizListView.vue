<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey pt-24 pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête standardisé -->
      <div class="mb-12 text-center">
        <h1 class="text-4xl md:text-5xl font-medieval font-bold text-iron-black mb-4">
          <i class="fas fa-scroll mr-3 text-antique-bronze"></i>
          Quiz & Aventures
        </h1>
        <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-6"></div>
        <p class="text-lg text-stone-grey text-center max-w-2xl mx-auto">
          Testez vos connaissances et gagnez de l'XP !
        </p>
      </div>

      <!-- Main Content -->
      <main>
      <!-- Filters -->
      <div class="mb-8 flex flex-wrap gap-4 items-center">
        <!-- Search -->
        <div class="flex-1 min-w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un quiz..."
            class="w-full px-4 py-2 border border-stone-grey/30 rounded-lg focus:ring-2 focus:ring-antique-bronze focus:border-transparent"
          />
        </div>

        <!-- My attempts button (if authenticated) -->
        <router-link
          v-if="isAuthenticated"
          to="/quiz/my-attempts"
          class="px-4 py-2 bg-white border border-antique-bronze text-antique-bronze rounded-lg hover:bg-antique-bronze hover:text-white transition-colors"
        >
          Mes tentatives
        </router-link>

        <!-- Create quiz button (for prestataires/admins) -->
        <router-link
          v-if="canCreateQuiz"
          to="/quiz/create"
          class="px-4 py-2 bg-antique-bronze text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Créer un quiz
        </router-link>
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
          :question-count="quiz.questions?.length ?? 5"
          @click="navigateToQuiz(quiz.id_quiz)"
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

const isAuthenticated = computed(() => authStore.isAuthenticated);
const canCreateQuiz = computed(() => {
  const role = authStore.user?.role;
  return role === Role.PRESTATAIRE_ROLE_ID || role === Role.ADMIN_ROLE_ID;
});

const filteredQuizzes = computed(() => {
  if (!searchQuery.value) return quizzes.value;
  
  const query = searchQuery.value.toLowerCase();
  return quizzes.value.filter(quiz => 
    quiz.title.toLowerCase().includes(query) ||
    quiz.description?.toLowerCase().includes(query) ||
    quiz.location?.name.toLowerCase().includes(query)
  );
});

async function loadQuizzes() {
  loading.value = true;
  error.value = null;

  try {
    quizzes.value = await quizService.getQuizzes({ is_active: true });
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

onMounted(() => {
  loadQuizzes();
});
</script>

<style scoped>
@reference "tailwindcss";
</style>
