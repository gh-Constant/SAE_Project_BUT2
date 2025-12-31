<template>
  <div class="quiz-question bg-white rounded-xl shadow-md p-6">
    <!-- Question number -->
    <div class="flex items-center justify-between mb-4">
      <span class="text-sm font-medium text-antique-bronze">
        Question {{ currentIndex + 1 }} / {{ totalQuestions }}
      </span>
      <div class="h-1 flex-1 mx-4 bg-stone-grey/20 rounded-full overflow-hidden">
        <div 
          class="h-full bg-antique-bronze transition-all duration-300"
          :style="{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- Question content (HTML from editor) -->
    <div 
      class="question-content prose prose-sm max-w-none mb-6"
      v-html="question.content"
    ></div>

    <!-- Question image -->
    <div v-if="question.image_url" class="mb-6">
      <img 
        :src="question.image_url" 
        :alt="`Image pour la question ${currentIndex + 1}`"
        class="max-h-64 rounded-lg mx-auto"
      />
    </div>

    <!-- Answers -->
    <div class="space-y-3">
      <button
        v-for="answer in question.answers"
        :key="answer.id_answer"
        class="answer-button w-full text-left p-4 rounded-lg border-2 transition-all"
        :class="{
          'border-antique-bronze bg-antique-bronze/10': selectedAnswerId === answer.id_answer,
          'border-stone-grey/20 hover:border-antique-bronze/50': selectedAnswerId !== answer.id_answer,
        }"
        @click="selectAnswer(answer.id_answer)"
      >
        <div class="flex items-center">
          <div 
            class="w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0"
            :class="{
              'border-antique-bronze bg-antique-bronze': selectedAnswerId === answer.id_answer,
              'border-stone-grey/40': selectedAnswerId !== answer.id_answer,
            }"
          >
            <svg 
              v-if="selectedAnswerId === answer.id_answer"
              class="w-4 h-4 text-white" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <span class="text-stone-grey">{{ answer.content }}</span>
        </div>
      </button>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between mt-8">
      <button
        v-if="currentIndex > 0"
        class="px-4 py-2 text-stone-grey hover:text-antique-bronze transition-colors"
        @click="$emit('previous')"
      >
        ← Précédent
      </button>
      <div v-else></div>

      <button
        v-if="currentIndex < totalQuestions - 1"
        class="px-6 py-2 bg-antique-bronze text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!selectedAnswerId"
        @click="$emit('next')"
      >
        Suivant →
      </button>
      <button
        v-else
        class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!selectedAnswerId"
        @click="$emit('submit')"
      >
        Terminer le quiz
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { QuizQuestion } from '@/types/quiz';

interface Props {
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  initialAnswer?: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  previous: [];
  next: [];
  submit: [];
  'answer-selected': [questionId: number, answerId: number];
}>();

const selectedAnswerId = ref<number | null>(props.initialAnswer || null);

// Reset selection when question changes
watch(() => props.question.id_question, () => {
  selectedAnswerId.value = props.initialAnswer || null;
});

// Watch for initialAnswer changes
watch(() => props.initialAnswer, (newVal) => {
  if (newVal) {
    selectedAnswerId.value = newVal;
  }
});

function selectAnswer(answerId: number) {
  selectedAnswerId.value = answerId;
  emit('answer-selected', props.question.id_question, answerId);
}
</script>

<style scoped>
@reference "tailwindcss";

.question-content :deep(p) {
  @apply mb-2;
}

.question-content :deep(strong) {
  @apply font-semibold;
}

.question-content :deep(em) {
  @apply italic;
}

.question-content :deep(ul) {
  @apply list-disc pl-5 mb-2;
}

.question-content :deep(ol) {
  @apply list-decimal pl-5 mb-2;
}

.answer-button:focus {
  @apply outline-none ring-2 ring-amber-700 ring-offset-2;
}
</style>
