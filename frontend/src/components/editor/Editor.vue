<template>
  <div class="editor-container">
    <Toolbar v-if="editor" :editor="editor" />
    <EditorContent v-if="editor" :editor="editor" class="editor-content" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { editorExtensions, defaultContent } from './editorConfig'
import Toolbar from './Toolbar.vue'

const editor = useEditor({
  extensions: editorExtensions,
  content: defaultContent,
  editorProps: {
    attributes: {
      class: 'tiptap prose prose-sm sm:prose lg:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
    },
  },
})

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