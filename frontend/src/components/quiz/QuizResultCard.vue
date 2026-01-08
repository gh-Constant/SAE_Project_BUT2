<template>
  <div 
    class="quiz-result-card rounded-lg border-2 p-4"
    :class="{
      'border-emerald-500 bg-emerald-50': isCorrect,
      'border-red-400 bg-red-50': !isCorrect,
    }"
  >
    <!-- Question number and status -->
    <div class="flex items-center justify-between mb-3">
      <span class="text-sm font-medium text-stone-grey">
        Question {{ questionIndex + 1 }}
      </span>
      <span 
        class="px-2 py-1 rounded-full text-xs font-medium"
        :class="{
          'bg-emerald-500 text-white': isCorrect,
          'bg-red-500 text-white': !isCorrect,
        }"
      >
        {{ isCorrect ? 'Correct' : 'Incorrect' }}
      </span>
    </div>

    <!-- Question content -->
    <div 
      class="question-content prose prose-sm max-w-none mb-4 text-stone-grey"
      v-html="question.content"
    ></div>

    <!-- Answers comparison -->
    <div class="space-y-2">
      <div 
        v-for="answer in question.answers" 
        :key="answer.id_answer"
        class="flex items-center p-2 rounded-lg"
        :class="{
          'bg-emerald-100': answer.is_correct,
          'bg-red-100': userAnswerIds.includes(answer.id_answer) && !answer.is_correct,
          'bg-gray-50': !answer.is_correct && !userAnswerIds.includes(answer.id_answer),
        }"
      >
        <!-- Icon -->
        <div class="mr-2 flex-shrink-0">
          <!-- Correct answer icon -->
          <svg 
            v-if="answer.is_correct" 
            class="w-5 h-5 text-emerald-600" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <!-- User's wrong answer icon -->
          <svg 
            v-else-if="userAnswerIds.includes(answer.id_answer)" 
            class="w-5 h-5 text-red-600" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <!-- Neutral icon -->
          <div v-else class="w-5 h-5 rounded-full border-2 border-gray-300"></div>
        </div>

        <!-- Answer text -->
        <span 
          class="text-sm"
          :class="{
            'font-medium text-emerald-700': answer.is_correct,
            'text-red-700': userAnswerIds.includes(answer.id_answer) && !answer.is_correct,
            'text-gray-500': !answer.is_correct && !userAnswerIds.includes(answer.id_answer),
          }"
        >
          {{ answer.content }}
          <span v-if="userAnswerIds.includes(answer.id_answer)" class="text-xs ml-1">(votre réponse)</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuizQuestion } from '@/types/quiz';

interface Props {
  question: QuizQuestion;
  questionIndex: number;
  userAnswerIds: number[];
  isCorrect: boolean;
}

defineProps<Props>();
</script>

