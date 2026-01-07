<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey pt-24 pb-12">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-antique-bronze"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <router-link 
          to="/quiz" 
          class="px-4 py-2 bg-antique-bronze text-white rounded-lg"
        >
          Retour aux quiz
        </router-link>
      </div>
    </div>

    <!-- Quiz Not Started -->
    <div v-else-if="!started && quiz" class="max-w-2xl mx-auto px-4 py-12">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Quiz Image -->
        <div class="h-48 bg-antique-bronze relative">
          <img
            v-if="quiz.image_url"
            :src="quiz.image_url"
            :alt="quiz.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="w-20 h-20 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <!-- Quiz Info -->
        <div class="p-6">
          <h1 class="font-display text-2xl font-bold mb-2">{{ quiz.title }}</h1>
          
          <p v-if="quiz.description" class="text-stone-grey/70 mb-4">
            {{ quiz.description }}
          </p>

          <div class="flex items-center gap-4 text-sm text-stone-grey/60 mb-6">
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ quiz.questions?.length || 0 }} questions
            </span>
            <span v-if="quiz.location" class="flex items-center">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
              {{ quiz.location.name }}
            </span>
          </div>

          <!-- Login prompt if not authenticated -->
          <div v-if="!isAuthenticated" class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p class="text-amber-800 text-sm">
              Connectez-vous pour sauvegarder vos résultats !
            </p>
          </div>

          <button
            @click="startQuiz"
            class="w-full py-3 bg-antique-bronze text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-lg"
          >
            Commencer le quiz
          </button>

          <router-link 
            :to="backLink" 
            class="block text-center mt-4 text-stone-grey/60 hover:text-antique-bronze transition-colors"
          >
            ← Retour {{ isFromAdmin ? 'à la gestion' : 'aux quiz' }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Quiz In Progress -->
    <div v-else-if="started && quiz && currentQuestion" class="max-w-2xl mx-auto px-4 py-8">
      <!-- Quiz Title -->
      <div class="text-center mb-6">
        <h1 class="font-display text-xl font-bold text-stone-grey">{{ quiz.title }}</h1>
      </div>

      <!-- Question Component -->
      <QuizQuestion
        :question="currentQuestion"
        :current-index="currentQuestionIndex"
        :total-questions="totalQuestions"
        :initial-answer="userAnswers[currentQuestion.id_question]"
        :is-confirmed="questionStates[currentQuestion.id_question]?.isConfirmed"
        :correct-answers="questionStates[currentQuestion.id_question]?.correctAnswers"
        @answer-selected="handleAnswerSelected"
        @previous="previousQuestion"
        @next="nextQuestion"
        @confirm="handleConfirm"
        @submit="submitQuiz"
      />

      <!-- Cancel button -->
      <div class="text-center mt-6">
        <button
          @click="cancelQuiz"
          class="text-stone-grey/60 hover:text-red-500 transition-colors text-sm"
        >
          Abandonner le quiz
        </button>
      </div>
    </div>

    <!-- Submitting -->
    <div v-else-if="submitting" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-antique-bronze mx-auto mb-4"></div>
        <p class="text-stone-grey">Calcul de votre score...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { quizService, type Quiz, type QuizQuestion as QuizQuestionType } from '@/services/quizService';
import QuizQuestion from '@/components/quiz/QuizQuestion.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const quiz = ref<Quiz | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const started = ref(false);
const submitting = ref(false);
const currentQuestionIndex = ref(0);
const userAnswers = ref<Record<number, number[]>>({});
const questionStates = ref<Record<number, { isConfirmed: boolean, correctAnswers: number[] }>>({});


const isAuthenticated = computed(() => authStore.isAuthenticated);

const totalQuestions = computed(() => quiz.value?.questions?.length || 0);

const currentQuestion = computed((): QuizQuestionType | null => {
  if (!quiz.value?.questions) return null;
  return quiz.value.questions[currentQuestionIndex.value] || null;
});

const backLink = computed(() => {
  return (route.query.returnTo as string) || '/quiz';
});

const isFromAdmin = computed(() => {
  return !!route.query.returnTo;
});

async function loadQuiz() {
  loading.value = true;
  error.value = null;

  try {
    const id = Number(route.params.id);
    
    if (isNaN(id)) {
      error.value = 'ID de quiz invalide';
      // Optional: redirect to list
      // router.replace('/quiz');
      return;
    }

    quiz.value = await quizService.getQuizForPlay(id);
    
    if (!quiz.value) {
      error.value = 'Quiz introuvable ou inactif';
    }
  } catch (err) {
    error.value = 'Impossible de charger le quiz';
    console.error('Error loading quiz:', err);
  } finally {
    loading.value = false;
  }
}

function startQuiz() {
  started.value = true;
  currentQuestionIndex.value = 0;
  started.value = true;
  currentQuestionIndex.value = 0;
  userAnswers.value = {};
  questionStates.value = {};

}

function cancelQuiz() {
  if (confirm('Êtes-vous sûr de vouloir abandonner ? Vos réponses seront perdues.')) {
    router.push(backLink.value);
  }
}

function handleAnswerSelected(questionId: number, answerId: number) {
  if (questionStates.value[questionId]?.isConfirmed) return; // Prevent changing if confirmed

  if (!userAnswers.value[questionId]) {
    userAnswers.value[questionId] = [];
  }
  
  const index = userAnswers.value[questionId].indexOf(answerId);
  if (index === -1) {
    userAnswers.value[questionId].push(answerId);
  } else {
    userAnswers.value[questionId].splice(index, 1);
  }
}

async function handleConfirm() {
  if (!currentQuestion.value || !quiz.value) return;
  
  const qId = currentQuestion.value.id_question;
  
  // Call API to check
  try {
      const result = await quizService.checkQuestion(quiz.value.id_quiz, qId);
      
      questionStates.value[qId] = {
          isConfirmed: true,
          correctAnswers: result.correctAnswers
      };
      
  } catch (e) {
      console.error("Error checking question", e);
      alert("Erreur lors de la validation");
  }
}

function previousQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
}

function nextQuestion() {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++;
  }
}

async function submitQuiz() {
  if (!quiz.value || !quiz.value.questions) return;

  // Check if all questions are answered
  const unanswered = quiz.value.questions.filter(q => 
    !userAnswers.value[q.id_question] || userAnswers.value[q.id_question].length === 0
  );

  if (unanswered.length > 0) {
    alert(`Vous n'avez pas répondu à ${unanswered.length} question(s)`);
    return;
  }

  submitting.value = true;

  try {
    // Prepare submission
    const answers: { id_question: number; id_answer: number }[] = [];
    
    Object.entries(userAnswers.value).forEach(([questionId, answerIds]) => {
      answerIds.forEach(answerId => {
        answers.push({
          id_question: Number(questionId),
          id_answer: answerId,
        });
      });
    });

    const result = await quizService.submitQuiz(quiz.value.id_quiz, { answers });

    // Navigate to results
    router.push({
      path: `/quiz/${quiz.value.id_quiz}/results`,
      query: {
        score: String(result.score),
        total: String(result.totalQuestions),
        percentage: String(result.percentage),
        attemptId: String(result.attempt.id_attempt),
      },
    });
  } catch (err) {
    console.error('Error submitting quiz:', err);
    alert('Erreur lors de la soumission du quiz');
    submitting.value = false;
  }
}

onMounted(() => {
  loadQuiz();
});
</script>

<style scoped>
</style>
