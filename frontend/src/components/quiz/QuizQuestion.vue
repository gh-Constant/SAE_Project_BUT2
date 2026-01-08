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

    <!-- Instructions -->
    <p class="text-sm text-stone-grey/70 mb-4 italic flex items-center gap-2">
      <svg v-if="question.multiple_correct_answers" class="w-4 h-4 text-antique-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <svg v-else class="w-4 h-4 text-antique-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ instructionText }}
    </p>

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
        :disabled="isConfirmed"
        class="answer-button w-full text-left p-4 rounded-lg border-2 transition-all"
        :class="{
          'border-antique-bronze bg-antique-bronze/10': !isConfirmed && selectedAnswerIds.includes(answer.id_answer),
          'border-stone-grey/20 hover:border-antique-bronze/50': !isConfirmed && !selectedAnswerIds.includes(answer.id_answer),
          'border-green-500 bg-green-50': isConfirmed && correctAnswers?.includes(answer.id_answer),
          'border-red-500 bg-red-50': isConfirmed && selectedAnswerIds.includes(answer.id_answer) && !correctAnswers?.includes(answer.id_answer),
          'border-stone-grey/20 opacity-50': isConfirmed && !selectedAnswerIds.includes(answer.id_answer) && !correctAnswers?.includes(answer.id_answer),
        }"
        @click="toggleAnswer(answer.id_answer)"

      >
        <div class="flex items-center">
          <div 
            class="w-6 h-6 border-2 flex items-center justify-center mr-3 flex-shrink-0 transition-all"
            :class="{
              'rounded-md': question.multiple_correct_answers,
              'rounded-full': !question.multiple_correct_answers,
              'border-antique-bronze bg-antique-bronze': !isConfirmed && selectedAnswerIds.includes(answer.id_answer),
              'border-stone-grey/40': !isConfirmed && !selectedAnswerIds.includes(answer.id_answer),
              'bg-green-500 border-green-500': isConfirmed && correctAnswers?.includes(answer.id_answer),
              'bg-red-500 border-red-500': isConfirmed && selectedAnswerIds.includes(answer.id_answer) && !correctAnswers?.includes(answer.id_answer),
              'border-stone-grey/40 opacity-50': isConfirmed && !selectedAnswerIds.includes(answer.id_answer) && !correctAnswers?.includes(answer.id_answer),
            }"
          >
            <!-- Icon: Checkmark if selected (not confirmed), OR if confirmed and correct -->
            <svg 
              v-if="(!isConfirmed && selectedAnswerIds.includes(answer.id_answer)) || (isConfirmed && correctAnswers?.includes(answer.id_answer))"
              class="w-4 h-4 text-white" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            
            <!-- Icon: Cross if confirmed AND selected AND NOT correct -->
            <svg
              v-else-if="isConfirmed && selectedAnswerIds.includes(answer.id_answer) && !correctAnswers?.includes(answer.id_answer)"
              class="w-4 h-4 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <span class="text-stone-grey">
            {{ answer.content }}
            <span v-if="isConfirmed && selectedAnswerIds.includes(answer.id_answer)" class="text-xs ml-1 font-medium text-stone-grey/70">(votre réponse)</span>
          </span>
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
        v-if="!isConfirmed && currentIndex < totalQuestions"
        class="px-6 py-2 bg-antique-bronze text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="selectedAnswerIds.length === 0"
        @click="$emit('confirm')"
      >
        Confirmer
      </button>

      <button
        v-else-if="currentIndex < totalQuestions - 1"
        class="px-6 py-2 bg-antique-bronze text-white rounded-lg hover:bg-amber-700 transition-colors"
        @click="$emit('next')"
      >
        Suivant →
      </button>
      <button
        v-else
        class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        @click="$emit('submit')"
      >
        Terminer le quiz
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { QuizQuestion } from '@/types/quiz';

interface Props {
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  initialAnswer?: number[];
  isConfirmed?: boolean;
  correctAnswers?: number[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  previous: [];
  next: [];
  submit: [];
  confirm: [];
  'answer-selected': [questionId: number, answerId: number];
}>();

const selectedAnswerIds = ref<number[]>([...(props.initialAnswer || [])]);


// Reset selection when question changes
watch(() => props.question.id_question, () => {
  selectedAnswerIds.value = [...(props.initialAnswer || [])];
});

// Watch for initialAnswer changes
watch(() => props.initialAnswer, (newVal) => {
  if (newVal) {
    selectedAnswerIds.value = [...newVal];
  }
});

const instructionText = computed(() => {
  return props.question.multiple_correct_answers 
    ? "Plusieurs réponses possibles. Sélectionnez toutes les bonnes réponses."
    : "Une seule réponse possible.";
});

function toggleAnswer(answerId: number) {
  const isMulti = props.question.multiple_correct_answers;
  
  if (!isMulti && selectedAnswerIds.value.length > 0 && !selectedAnswerIds.value.includes(answerId)) {
      // Single mode: If we already have an answer and picking a different one
      // We need to unselect the old ones.
      // Since parent toggles, we emit events for them.
       [...selectedAnswerIds.value].forEach(oldId => {
           emit('answer-selected', props.question.id_question, oldId);
       });
       selectedAnswerIds.value = []; // Local clear
  }

  const index = selectedAnswerIds.value.indexOf(answerId);
  if (index === -1) {
    selectedAnswerIds.value.push(answerId);
  } else {
    selectedAnswerIds.value.splice(index, 1);
  }
  emit('answer-selected', props.question.id_question, answerId);
}
</script>

