<template>
  <div class="quiz-question-editor bg-white rounded-xl shadow-md p-6 mb-4">
    <!-- Question Header -->
    <div class="flex items-center justify-between mb-4">
      <h4 class="font-medium text-stone-grey">
        Question {{ index + 1 }}
      </h4>
      <button
        v-if="canDelete"
        class="text-red-500 hover:text-red-700 transition-colors p-1"
        @click="$emit('delete')"
        title="Supprimer la question"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <!-- Question Content Editor -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-stone-grey mb-2">
        Contenu de la question
      </label>
      <Editor 
        ref="editorRef"
        :initialContent="modelValue.content"
        @ready="onEditorReady"
      />
    </div>

    <!-- Question Image -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-stone-grey mb-2">
        Image (optionnel)
      </label>
      
      <div class="flex items-center gap-4">
        <!-- Preview -->
        <div v-if="modelValue.image_url" class="relative group w-24 h-16 rounded-lg overflow-hidden border border-stone-grey/20">
          <img :src="modelValue.image_url" class="w-full h-full object-cover" alt="Preview" />
          <button 
            type="button"
            @click="updateField('image_url', '')"
            class="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            title="Supprimer l'image"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Upload Button -->
        <div class="flex-1">
          <label 
            class="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-stone-grey/30 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors"
            :class="{'opacity-50 cursor-not-allowed': uploading}"
          >
            <div class="flex items-center gap-2 text-stone-grey">
              <span v-if="uploading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-antique-bronze"></span>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-sm">{{ uploading ? 'Téléchargement...' : 'Choisir une image' }}</span>
            </div>
            <input
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageUpload"
              :disabled="uploading"
            />
          </label>
        </div>
      </div>
    </div>

    <!-- Answers -->
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <label class="block text-sm font-medium text-stone-grey">
          Réponses
        </label>
        <button
          v-if="modelValue.answers.length < 6"
          class="text-antique-bronze hover:text-amber-700 text-sm flex items-center"
          @click="addAnswer"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Ajouter une réponse
        </button>
      </div>

      <div class="space-y-2">
        <div
          v-for="(answer, answerIndex) in modelValue.answers"
          :key="answerIndex"
          class="flex items-center gap-2"
        >
          <!-- Correct answer radio -->
          <button
            class="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
            :class="{
              'border-emerald-500 bg-emerald-500': answer.is_correct,
              'border-stone-grey/40 hover:border-emerald-400': !answer.is_correct,
            }"
            @click="toggleCorrectAnswer(answerIndex)"
            title="Basculer l'état de la réponse"

          >
            <svg 
              v-if="answer.is_correct"
              class="w-4 h-4 text-white" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Answer input -->
          <input
            type="text"
            :value="answer.content"
            @input="updateAnswer(answerIndex, 'content', ($event.target as HTMLInputElement).value)"
            placeholder="Texte de la réponse"
            class="flex-1 px-3 py-2 border border-stone-grey/30 rounded-lg focus:ring-2 focus:ring-antique-bronze focus:border-transparent"
          />

          <!-- Delete answer -->
          <button
            v-if="modelValue.answers.length > 2"
            class="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
            @click="removeAnswer(answerIndex)"
            title="Supprimer"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <p class="text-xs text-stone-grey/60 mt-2">
        Cliquez sur le cercle pour définir les bonnes réponses (plusieurs possibles)

      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Editor from '@/components/editor/Editor.vue';
import type { CreateQuestionInput, CreateAnswerInput } from '@/types/quiz';
import { uploadService } from '@/services/uploadService';

interface Props {
  modelValue: CreateQuestionInput;
  index: number;
  canDelete?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  canDelete: true,
  modelValue: () => ({
    content: '',
    image_url: '',
    answers: [],
    order_index: 0
  } as any)
});

const emit = defineEmits<{
  'update:modelValue': [value: CreateQuestionInput];
  delete: [];
}>();

const editorRef = ref<InstanceType<typeof Editor> | null>(null);
const uploading = ref(false);

async function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  uploading.value = true;

  try {
    const response = await uploadService.uploadImage(file);
    updateField('image_url', response.url);
  } catch (err) {
    console.error('Upload failed:', err);
    alert('Erreur lors du téléchargement de l\'image');
  } finally {
    uploading.value = false;
    input.value = ''; // Reset
  }
}

function onEditorReady() {
  // Editor is ready
}

// Update content from editor when it changes
function updateEditorContent() {
  if (editorRef.value) {
    const content = editorRef.value.getHTML();
    if (content !== props.modelValue.content) {
      emit('update:modelValue', {
        ...props.modelValue,
        content,
      });
    }
  }
}

// Watch for content changes via polling (TipTap doesn't emit on every change)
let contentInterval: ReturnType<typeof setInterval> | null = null;
watch(() => editorRef.value, (editor) => {
  if (editor) {
    contentInterval = setInterval(updateEditorContent, 500);
  }
}, { immediate: true });

function updateField(field: keyof CreateQuestionInput, value: string) {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value || undefined,
  });
}

function updateAnswer(index: number, field: keyof CreateAnswerInput, value: string | boolean) {
  const answers = [...props.modelValue.answers];
  answers[index] = { ...answers[index], [field]: value };
  emit('update:modelValue', { ...props.modelValue, answers });
}

function toggleCorrectAnswer(index: number) {
  const answers = [...props.modelValue.answers];
  answers[index] = {
    ...answers[index],
    is_correct: !answers[index].is_correct
  };
  emit('update:modelValue', { ...props.modelValue, answers });
}

function addAnswer() {
  const answers = [
    ...props.modelValue.answers,
    {
      content: '',
      is_correct: false,
      order_index: props.modelValue.answers.length,
    },
  ];
  emit('update:modelValue', { ...props.modelValue, answers });
}

function removeAnswer(index: number) {
  const answers = props.modelValue.answers
    .filter((_, i) => i !== index)
    .map((answer, i) => ({ ...answer, order_index: i }));
  
  // Ensure at least one answer is correct
  if (!answers.some(a => a.is_correct) && answers.length > 0) {
    answers[0].is_correct = true;
  }
  
  emit('update:modelValue', { ...props.modelValue, answers });
}
</script>
