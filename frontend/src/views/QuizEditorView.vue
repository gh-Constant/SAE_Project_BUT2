<template>
  <div class="min-h-screen bg-parchment font-body text-stone-grey pt-20 pb-12">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- En-tête -->
      <div class="mb-8 text-center">
        <div class="inline-flex items-center justify-center p-3 bg-white/40 rounded-full mb-4 border-2 border-antique-bronze/20 shadow-sm backdrop-blur-sm">
          <i class="fas fa-feather-alt text-2xl text-antique-bronze"></i>
        </div>
        <h1 class="text-3xl md:text-4xl font-medieval font-bold text-iron-black mb-3">
          {{ isEditing ? 'Modifier le Grimoire' : 'Écrire un Nouveau Quiz' }}
        </h1>
        <div class="h-1 w-24 bg-antique-bronze mx-auto rounded-full mb-4"></div>
        <p class="text-base text-stone-grey text-center max-w-2xl mx-auto italic">
          "Que votre plume soit aussi affûtée que votre épée."
        </p>
      </div>

      <main>
        <form @submit.prevent="saveQuiz" class="space-y-8">
          
          <!-- Carte Informations Générales -->
          <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border-2 border-antique-bronze/20 overflow-hidden">
            <div class="bg-antique-bronze/5 px-6 py-4 border-b-2 border-antique-bronze/10 flex items-center gap-3">
              <i class="fas fa-info-circle text-antique-bronze text-xl"></i>
              <h2 class="font-medieval font-bold text-xl text-iron-black">Informations Générales</h2>
            </div>
            
            <div class="p-6 md:p-8 space-y-6">
              <!-- Title -->
              <div>
                <label class="block text-sm font-bold text-iron-black mb-2 uppercase tracking-wide">
                  Titre du Quiz <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="quizData.title"
                    type="text"
                    required
                    placeholder="Ex: Les Mystères de la Forêt de Brocéliande"
                    class="w-full pl-4 pr-4 py-3 bg-parchment/50 border-2 border-stone-grey/20 rounded-lg focus:ring-0 focus:border-antique-bronze/60 focus:bg-white transition-all font-body text-lg placeholder-stone-grey/40"
                  />
                  <div class="absolute right-3 top-3 text-stone-grey/30">
                    <i class="fas fa-heading"></i>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Location -->
                <div>
                  <label class="block text-sm font-bold text-iron-black mb-2 uppercase tracking-wide">
                    Lieu Associé <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <select
                      v-model="quizData.id_location"
                      required
                      class="w-full pl-4 pr-10 py-3 bg-parchment/50 border-2 border-stone-grey/20 rounded-lg focus:ring-0 focus:border-antique-bronze/60 focus:bg-white transition-all font-body appearance-none cursor-pointer"
                    >
                      <option :value="0" disabled>Choisir un lieu...</option>
                      <option 
                        v-for="location in availableLocations" 
                        :key="location.id" 
                        :value="location.id"
                      >
                        {{ location.name }}
                      </option>
                    </select>
                    <div class="absolute right-3 top-3.5 text-stone-grey pointer-events-none">
                      <i class="fas fa-chevron-down"></i>
                    </div>
                  </div>
                </div>

                <!-- Image Upload -->
                <div>
                  <label class="block text-sm font-bold text-iron-black mb-2 uppercase tracking-wide">
                    Image de Couverture
                  </label>
                  <div class="relative">
                    <div class="flex items-center gap-4">
                      <!-- Preview -->
                      <div v-if="quizData.image_url" class="relative group w-32 h-20 rounded-lg overflow-hidden border-2 border-stone-grey/20">
                        <img :src="quizData.image_url" class="w-full h-full object-cover" alt="Cover preview" />
                        <button 
                          type="button"
                          @click="quizData.image_url = ''"
                          class="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                      
                      <!-- Upload Button -->
                      <div class="flex-1 relative">
                        <input
                          type="file"
                          accept="image/*"
                          @change="handleImageUpload"
                          class="hidden"
                          id="quiz-cover-upload"
                        />
                        <label 
                          for="quiz-cover-upload"
                          class="w-full pl-4 pr-10 py-3 bg-parchment/50 border-2 border-stone-grey/20 rounded-lg cursor-pointer hover:bg-white transition-all font-body text-stone-grey flex items-center gap-2"
                        >
                          <i class="fas fa-image text-antique-bronze"></i>
                          <span v-if="uploadingCover">Téléchargement...</span>
                          <span v-else>Choisir une image...</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-bold text-iron-black mb-2 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  v-model="quizData.description"
                  rows="3"
                  placeholder="Narrez en quelques mots ce qui attend les courageux participants..."
                  class="w-full px-4 py-3 bg-parchment/50 border-2 border-stone-grey/20 rounded-lg focus:ring-0 focus:border-antique-bronze/60 focus:bg-white transition-all font-body resize-none placeholder-stone-grey/40"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Section Questions -->
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="bg-antique-bronze text-white w-10 h-10 rounded-lg flex items-center justify-center font-medieval font-bold text-xl shadow-sm">
                  {{ quizData.questions.length }}
                </div>
                <h2 class="font-medieval font-bold text-2xl text-iron-black">Questions du Quiz</h2>
              </div>
              
              <button
                type="button"
                @click="addQuestion"
                class="group px-4 py-2 bg-white border-2 border-antique-bronze/20 rounded-lg hover:border-antique-bronze hover:bg-parchment/50 transition-all flex items-center gap-2"
              >
                <div class="w-6 h-6 bg-antique-bronze/10 rounded-full flex items-center justify-center text-antique-bronze group-hover:scale-110 transition-transform">
                  <i class="fas fa-plus text-xs"></i>
                </div>
                <span class="font-medieval font-bold text-antique-bronze">Ajouter une question</span>
              </button>
            </div>

            <!-- Empty State -->
            <div v-if="quizData.questions.length === 0" class="bg-white/60 border-2 border-dashed border-stone-grey/20 rounded-xl p-12 text-center">
              <div class="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i class="fas fa-scroll text-4xl text-stone-300"></i>
              </div>
              <h3 class="font-medieval text-xl text-stone-600 mb-2">Le parchemin est encore vierge</h3>
              <p class="text-stone-500 mb-8 max-w-md mx-auto">Commencez par ajouter une première question pour mettre à l'épreuve les connaissances des aventuriers.</p>
              <button
                type="button"
                @click="addQuestion"
                class="px-6 py-3 bg-antique-bronze text-white rounded-lg hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                <i class="fas fa-plus"></i>
                Ajouter une question
              </button>
            </div>

            <!-- Questions List -->
            <div v-else class="space-y-6">
              <QuizQuestionEditor
                v-for="(question, index) in quizData.questions"
                :key="index"
                v-model="quizData.questions[index]"
                :index="index"
                :can-delete="quizData.questions.length > 1"
                @delete="removeQuestion(index)"
                class="transform transition-all duration-300 hover:shadow-md"
              />
            </div>
          </div>

          <!-- Actions Bar -->
          <div class="sticky bottom-6 z-10">
            <div class="bg-white/90 backdrop-blur-md border px-6 py-4 rounded-xl shadow-xl flex items-center justify-between gap-4 border-antique-bronze/20">
              <router-link
                to="/quiz"
                class="px-6 py-2.5 text-stone-600 font-bold hover:text-iron-black transition-colors flex items-center gap-2"
              >
                <i class="fas fa-arrow-left"></i>
                Annuler
              </router-link>
              
              <div class="flex items-center gap-4">
                <span class="text-sm text-stone-500 hidden sm:inline-block" v-if="!isValid">
                  <i class="fas fa-exclamation-circle text-amber-500 mr-1"></i>
                  Remplissez tous les champs obligatoires
                </span>
                <button
                  type="submit"
                  :disabled="saving || !isValid"
                  class="px-8 py-3 bg-antique-bronze text-white font-medieval font-bold text-lg rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
                >
                  <span v-if="saving" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  <i v-else class="fas fa-save"></i>
                  {{ saving ? 'Enregistrement...' : (isEditing ? 'Sauvegarder les Modifs' : 'Publier le Quiz') }}
                </button>
              </div>
            </div>
          </div>

        </form>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { quizService, type CreateQuizInput } from '@/services/quizService';
import type { CreateQuestionInput } from '@/types/quiz';
import { locationService } from '@/services/locationService';
import type { LocationMock } from '@/mocks/locations';
import QuizQuestionEditor from '@/components/quiz/QuizQuestionEditor.vue';

import { useAuthStore } from '@/stores/auth';
import { Role } from '@/mocks/users';

import { uploadService } from '@/services/uploadService';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isEditing = computed(() => !!route.params.id);

const quizData = reactive<CreateQuizInput>({
  title: '',
  description: '',
  image_url: '',
  id_location: 0,
  questions: [],
});

const availableLocations = ref<LocationMock[]>([]);
const saving = ref(false);
const uploadingCover = ref(false);

async function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  uploadingCover.value = true;

  try {
    const response = await uploadService.uploadImage(file);
    quizData.image_url = response.url;
  } catch (err) {
    console.error('Upload failed:', err);
    alert('Erreur lors du téléchargement de l\'image');
  } finally {
    uploadingCover.value = false;
    input.value = ''; // Reset input
  }
}

const isValid = computed(() => {
  if (!quizData.title.trim()) return false;
  if (!quizData.id_location) return false;
  if (quizData.questions.length === 0) return false;
  
  // Check each question has content and at least one correct answer
  for (const q of quizData.questions) {
    if (!q.content.trim() || q.content === '<p></p>') return false;
    if (q.answers.length < 2) return false;
    if (!q.answers.some(a => a.is_correct)) return false;
    if (q.answers.some(a => !a.content.trim())) return false;
  }
  
  return true;
});

function createEmptyQuestion(): CreateQuestionInput {
  return {
    content: '',
    image_url: undefined,
    order_index: quizData.questions.length,
    answers: [
      { content: '', is_correct: true, order_index: 0 },
      { content: '', is_correct: false, order_index: 1 },
    ],
  };
}

function addQuestion() {
  quizData.questions.push(createEmptyQuestion());
}

function removeQuestion(index: number) {
  quizData.questions.splice(index, 1);
  // Update order indices
  quizData.questions.forEach((q, i) => {
    q.order_index = i;
  });
}

async function loadLocations() {
  try {
    const user = authStore.user;
    if (user && user.role === Role.PRESTATAIRE_ROLE_ID) {
       availableLocations.value = await locationService.getLocationsByProviderId(user.id);
    } else {
       // Si Admin ou autre, on peut tout montrer ou gérer différemment
       availableLocations.value = await locationService.getAllLocations();
    }
  } catch (err) {
    console.error('Error loading locations:', err);
  }
}

async function loadQuizForEdit() {
  if (!isEditing.value) return;

  try {
    const quiz = await quizService.getQuizById(Number(route.params.id));
    if (quiz) {
      quizData.title = quiz.title;
      quizData.description = quiz.description || '';
      quizData.image_url = quiz.image_url || '';
      quizData.id_location = quiz.id_location;
      
      if (quiz.questions) {
        quizData.questions = quiz.questions.map((q, index) => ({
          content: q.content,
          image_url: q.image_url,
          order_index: index,
          answers: q.answers.map((a, aIndex) => ({
            content: a.content,
            is_correct: a.is_correct || false,
            order_index: aIndex,
          })),
        }));
      }
    }
  } catch (err) {
    console.error('Error loading quiz for edit:', err);
  }
}

async function saveQuiz() {
  if (!isValid.value) return;

  saving.value = true;

  try {
    if (isEditing.value) {
      await quizService.updateQuiz(Number(route.params.id), {
        title: quizData.title,
        description: quizData.description || undefined,
        image_url: quizData.image_url || undefined,
        questions: quizData.questions,
      });
    } else {
      await quizService.createQuiz(quizData);
    }

    router.push('/quiz');
  } catch (err) {
    console.error('Error saving quiz:', err);
    alert('Erreur lors de l\'enregistrement du quiz');
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  await loadLocations();
  await loadQuizForEdit();
});
</script>

<style scoped>
@reference "tailwindcss";
</style>
