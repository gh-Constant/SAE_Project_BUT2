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
  @apply min-h-50 p-3 border border-gray-200 rounded-md mt-2;
}

.editor-content :deep(.ProseMirror) {
  @apply outline-none min-h-37;
}
</style>
