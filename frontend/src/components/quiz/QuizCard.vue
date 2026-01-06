<template>
  <div 
    class="quiz-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    @click="$emit('click')"
  >
    <!-- Quiz Image -->
    <div class="h-40 bg-antique-bronze relative">
      <img
        v-if="quiz.image_url"
        :src="quiz.image_url"
        :alt="quiz.title"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg class="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <!-- Question count badge -->
      <div class="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium">
        {{ questionCount }} questions
      </div>

      <!-- Inactive badge -->
      <div v-if="!quiz.is_active" class="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
        Inactif
      </div>

      <!-- Edit Button (FAB style) -->
      <button
        v-if="canEdit"
        @click.stop="$emit('edit')"
        class="absolute right-6 -bottom-5 w-12 h-12 flex items-center justify-center bg-antique-bronze rounded-full shadow-lg text-white hover:bg-amber-700 hover:scale-110 transition-all z-20 border-4 border-white"
        title="Modifier le quiz"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
    </div>

    <!-- Quiz Info -->
    <div class="p-4">
      <h3 class="font-display text-lg font-semibold text-stone-grey mb-2 line-clamp-2">
        {{ quiz.title }}
      </h3>
      
      <p v-if="quiz.description" class="text-stone-grey/70 text-sm mb-3 line-clamp-2">
        {{ quiz.description }}
      </p>

      <!-- Location -->
      <div v-if="quiz.location" class="flex items-center text-xs text-stone-grey/60 mb-2">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {{ quiz.location.name }}
      </div>

      <!-- Stats -->
      <div class="flex items-center justify-between text-xs text-stone-grey/60">
        <span v-if="quiz._count?.attempts !== undefined" class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {{ quiz._count.attempts }} tentatives
        </span>
        <span v-if="quiz.creator">
          par {{ quiz.creator.firstname }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Quiz } from '@/types/quiz';

interface Props {
  quiz: Quiz;
  questionCount?: number;
  canEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  questionCount: 0,
  canEdit: false,
});

defineEmits<{
  click: [];
  edit: [];
}>();
</script>
