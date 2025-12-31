<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey pt-24 pb-12">
    <div class="max-w-3xl mx-auto px-4">
      <!-- Score Card -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <!-- Header with gradient based on score -->
        <div 
          class="py-8 px-6 text-center text-white"
          :class="{
            'bg-gradient-to-r from-emerald-500 to-emerald-600': percentage >= 70,
            'bg-gradient-to-r from-amber-500 to-amber-600': percentage >= 40 && percentage < 70,
            'bg-gradient-to-r from-red-500 to-red-600': percentage < 40,
          }"
        >
          <!-- Score Icon -->
          <div class="mb-4">
            <div v-if="percentage >= 70" class="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div v-else-if="percentage >= 40" class="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div v-else class="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>

          <!-- Message -->
          <h1 class="font-display text-2xl font-bold mb-2">
            {{ resultMessage }}
          </h1>

          <!-- Score display -->
          <div class="text-5xl font-bold mb-2">
            {{ percentage }}%
          </div>

          <p class="text-white/80">
            {{ score }} bonnes réponses sur {{ total }}
          </p>
        </div>

        <!-- Actions -->
        <div class="p-6 flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            :to="`/quiz/${quizId}`"
            class="px-6 py-3 bg-antique-bronze text-white rounded-lg hover:bg-amber-700 transition-colors text-center font-medium"
          >
            🔄 Rejouer
          </router-link>
          <router-link
            to="/quiz"
            class="px-6 py-3 border border-stone-grey/30 text-stone-grey rounded-lg hover:bg-stone-grey/10 transition-colors text-center"
          >
            Voir d'autres quiz
          </router-link>
        </div>
      </div>

      <!-- Detailed Results -->
      <div v-if="showDetails && quizDetails" class="mb-8">
        <h2 class="font-display text-xl font-bold mb-4 text-center">Récapitulatif détaillé</h2>
        
        <div class="space-y-4">
          <QuizResultCard
            v-for="(question, index) in quizDetails.questions"
            :key="question.id_question"
            :question="question"
            :question-index="index"
            :user-answer-id="getUserAnswerId(question.id_question)"
            :is-correct="isAnswerCorrect(question)"
          />
        </div>
      </div>

      <!-- Toggle Details Button -->
      <div class="text-center">
        <button
          @click="toggleDetails"
          class="text-antique-bronze hover:text-amber-700 transition-colors"
        >
          {{ showDetails ? 'Masquer les détails' : 'Voir les détails des réponses' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { quizService, type Quiz, type QuizQuestion } from '@/services/quizService';
import QuizResultCard from '@/components/quiz/QuizResultCard.vue';
import { getQuizWithQuestions } from '@/mocks/quiz';

const route = useRoute();

const quizId = computed(() => Number(route.params.id));
const score = computed(() => Number(route.query.score) || 0);
const total = computed(() => Number(route.query.total) || 1);
const percentage = computed(() => Number(route.query.percentage) || 0);

const showDetails = ref(false);
const quizDetails = ref<Quiz | null>(null);
const userAnswersFromAttempt = ref<Record<number, number>>({});

const resultMessage = computed(() => {
  if (percentage.value >= 80) return 'Excellent ! 🏆';
  if (percentage.value >= 60) return 'Bien joué ! 👏';
  if (percentage.value >= 40) return 'Pas mal ! 📚';
  return 'Continuez à apprendre ! 💪';
});

function toggleDetails() {
  showDetails.value = !showDetails.value;
  
  if (showDetails.value && !quizDetails.value) {
    loadQuizDetails();
  }
}

async function loadQuizDetails() {
  try {
    // For mock mode, use the mock function directly
    const quiz = getQuizWithQuestions(quizId.value);
    if (quiz) {
      quizDetails.value = quiz;
    }

    // Also try to load attempt details for actual user answers
    const attemptId = route.query.attemptId;
    if (attemptId) {
      const attempt = await quizService.getAttemptDetails(Number(attemptId));
      if (attempt?.answers) {
        attempt.answers.forEach(a => {
          userAnswersFromAttempt.value[a.id_question] = a.id_answer;
        });
      }
    }
  } catch (err) {
    console.error('Error loading quiz details:', err);
  }
}

function getUserAnswerId(questionId: number): number {
  return userAnswersFromAttempt.value[questionId] || 0;
}

function isAnswerCorrect(question: QuizQuestion): boolean {
  const userAnswerId = getUserAnswerId(question.id_question);
  const correctAnswer = question.answers.find(a => a.is_correct);
  return correctAnswer?.id_answer === userAnswerId;
}

onMounted(() => {
  // Pre-load quiz details
  loadQuizDetails();
});
</script>

<style scoped>
@reference "tailwindcss";
</style>
