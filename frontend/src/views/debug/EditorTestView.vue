<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-center mb-8">
        Editor Test Page
      </h1>
      <Editor ref="editorRef" @ready="onEditorReady" />
      <div class="mt-8 flex justify-center">
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          @click="getEditorContent">
          Get Editor Content
        </button>
      </div>
      <div v-if="editorContent" class="mt-6">
        <h2 class="text-xl font-semibold mb-4">
          Editor Content (JSON):
        </h2>
        <pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">{{ editorContent }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Editor from '@/components/editor/Editor.vue'

const editorRef = ref()
const editorContent = ref('')
const editorInstance = ref()

const onEditorReady = (editor: any) => {
  editorInstance.value = editor
}

const getEditorContent = () => {
  if (editorInstance.value) {
    editorContent.value = JSON.stringify(editorInstance.value.getJSON(), null, 2)
  }
}
</script>

<style scoped></style>