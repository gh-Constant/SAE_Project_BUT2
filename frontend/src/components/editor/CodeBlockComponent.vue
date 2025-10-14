<template>
  <node-view-wrapper class="code-block">
    <select contenteditable="false" v-model="selectedLanguage" class="language-selector" tabindex="-1">
      <option :value="null">auto</option>
      <option disabled>—</option>
      <option v-for="(language, index) in languages" :value="language" :key="index">
        {{ language }}
      </option>
    </select>
    <pre><code><node-view-content /></code></pre>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { computed } from 'vue'

interface Props {
  extension: any
  node: any
  updateAttributes: (attrs: any) => void
}

const props = defineProps<Props>()

const languages = computed(() => {
  return props.extension.options.lowlight.listLanguages()
})

const selectedLanguage = computed({
  get() {
    return props.node.attrs.language
  },
  set(language: string | null) {
    props.updateAttributes({ language })
  },
})
</script>

<style scoped>
@reference "tailwindcss";

.code-block {
  @apply relative my-4;
}

.code-block-header {
  @apply flex justify-start mb-2;
}

.language-selector {
  @apply absolute top-2 right-2 bg-gray-100 border border-gray-300 rounded px-2 py-1 pr-6 text-xs cursor-pointer text-gray-700 z-10;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="Black" d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 0.25rem center;
  background-size: 0.75rem;
}

.code-block select:hover {
  @apply border-gray-400;
}

.code-block select:focus {
  @apply outline-none border-blue-500 ring-2 ring-blue-200;
}

.code-block pre {
  @apply m-0 p-4 bg-gray-200 rounded-md overflow-x-auto text-left;
}

.code-block code {
  @apply text-gray-900 font-mono text-sm leading-relaxed text-left;
}
</style>