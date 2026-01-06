<!--
  @file Editor.vue
  @description
  Composant principal de l’éditeur TipTap.
  Initialise l’éditeur, charge les extensions et gère son cycle de vie Vue.

  @utilité
  - Point d’entrée principal de l’éditeur.
  - Monte TipTap et émet un événement "ready" lorsque l’éditeur est prêt.
  - Inclut le composant Toolbar et le contenu de l’éditeur.
-->

<template>
  <div class="editor-container">
    <!-- Barre d’outils -->
    <Toolbar
      v-if="editor"
      :editor="editor"
    />

    <!-- Zone d’édition -->
    <EditorContent
      v-if="editor"
      :editor="editor"
      class="editor-content"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { editorExtensions, defaultContent } from './editorConfig'
import Toolbar from './Toolbar.vue'

/**
 * Props for the Editor component
 */
interface Props {
  initialContent?: string;
}

const props = withDefaults(defineProps<Props>(), {
  initialContent: defaultContent
});

/**
 * Émet un événement 'ready' lorsque l'éditeur est complètement initialisé.
 */
const emit = defineEmits<{
  ready: [editor: any]
}>()

// Liste des textes placeholder connus
const placeholderTexts = [
  'Hello, start editing!',
  'Start writing your update...',
  'Je suis un prestataire de service médieval'
]

/**
 * Vérifie si le contenu actuel est un placeholder
 */
const isPlaceholderContent = (content: string, cursorPosition?: number): boolean => {
  if (!content || content.trim() === '<p></p>' || content.trim() === '') {
    return false
  }
  
  // Extraire le texte brut du HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = content
  const textContent = (tempDiv.textContent || tempDiv.innerText || '').trim()
  
  // Vérifier si c'est un placeholder connu
  if (placeholderTexts.some(placeholder => textContent === placeholder)) {
    return true
  }
  
  // Vérifier si c'est un texte court dans un seul paragraphe (probablement un placeholder)
  if (textContent.length < 60 && content.match(/^<p>.*<\/p>$/)) {
    // Si le curseur est au début ou dans le placeholder, c'est probablement un placeholder
    if (cursorPosition !== undefined && cursorPosition <= textContent.length + 10) {
      return true
    }
  }
  
  return false
}

/**
 * Initialise l'éditeur avec les extensions et le contenu par défaut.
 */
const editor = useEditor({
  extensions: editorExtensions,
  content: props.initialContent,
  editorProps: {
    attributes: {
      class: 'tiptap prose prose-sm sm:prose lg:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
    },
    handleDOMEvents: {
      // Vider le contenu placeholder quand l'utilisateur commence à taper
      beforeInput: (view, event) => {
        const currentEditor = editor.value
        if (!currentEditor) return false

        const currentContent = currentEditor.getHTML()
        const selection = currentEditor.state.selection

        // Ne vider que si le curseur est vraiment au début et que c'est un placeholder connu
        if (selection && selection.from <= 10) {
          if (isPlaceholderContent(currentContent, selection.from)) {
            currentEditor.commands.clearContent()
            // Ne pas empêcher l'événement, laisser le caractère être inséré
          }
        }
        return false
      },
      // Aussi gérer le cas où l'utilisateur clique et commence à taper
      keydown: (view, event) => {
        const currentEditor = editor.value
        if (!currentEditor) return false

        // Si l'utilisateur tape une touche normale (pas les touches de contrôle)
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
          const currentContent = currentEditor.getHTML()
          const selection = currentEditor.state.selection


          // Ne vider que si :
          // 1. Le curseur est vraiment au début (position <= 10)
          // 2. Et que c'est effectivement un placeholder connu
          if (selection && selection.from <= 10) {
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = currentContent
            const textContent = (tempDiv.textContent || tempDiv.innerText || '').trim()

            // Vérifier si c'est exactement un placeholder connu
            if (placeholderTexts.some(placeholder => textContent === placeholder)) {
              currentEditor.commands.clearContent()
              // L'événement keydown continuera et insérera le caractère
            }
          }
        }
        return false
      }
    }
  },
})

/**
 * Watch for changes to initialContent and update editor
 */
watch(() => props.initialContent, (newContent) => {
  if (editor.value && newContent !== editor.value.getHTML()) {
    editor.value.commands.setContent(newContent);
  }
});

/**
 * Get HTML content from editor
 */
const getHTML = (): string => {
  return editor.value?.getHTML() || '';
};

/**
 * Set HTML content in editor
 */
const setHTML = (content: string): void => {
  editor.value?.commands.setContent(content);
};

/**
 * Expose methods to parent component
 */
defineExpose({
  getHTML,
  setHTML,
  editor
});

/**
 * Quand le composant est monté, émet l'événement ready.
 */
onMounted(() => {
  if (editor.value) emit('ready', editor.value)
})

/**
 * Détruit proprement l'éditeur à la désactivation du composant.
 */
onUnmounted(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
@reference "tailwindcss";

.editor-container {
  @apply border border-gray-300 rounded-lg p-4 bg-white;
}

.editor-content {
  @apply min-h-80 p-3 border border-gray-200 rounded-md mt-2;
}

.editor-content :deep(.ProseMirror) {
  @apply outline-none min-h-64;
}
</style>
