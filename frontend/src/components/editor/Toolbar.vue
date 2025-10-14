<template>
  <div v-if="editor" class="toolbar">
    <button
      @click="editor.chain().focus().toggleBold().run()"
      :class="{ 'is-active': editor.isActive('bold') }"
      class="toolbar-button"
    >
      <strong>B</strong>
    </button>
    <button
      @click="editor.chain().focus().toggleItalic().run()"
      :class="{ 'is-active': editor.isActive('italic') }"
      class="toolbar-button"
    >
      <em>I</em>
    </button>
    <button
      @click="editor.chain().focus().toggleStrike().run()"
      :class="{ 'is-active': editor.isActive('strike') }"
      class="toolbar-button"
    >
      <s>S</s>
    </button>
    <button
      @click="editor.chain().focus().toggleUnderline().run()"
      :class="{ 'is-active': editor.isActive('underline') }"
      class="toolbar-button"
    >
      <u>U</u>
    </button>
    <button
      @click="editor.chain().focus().toggleCodeBlock().run()"
      :class="{ 'is-active': editor.isActive('codeBlock') }"
      class="toolbar-button"
    >
      Code Block
    </button>
    <button
      @click="editor.chain().focus().setParagraph().run()"
      :class="{ 'is-active': editor.isActive('paragraph') }"
      class="toolbar-button"
    >
      ¶
    </button>
    <button
      @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      class="toolbar-button"
    >
      H1
    </button>
    <button
      @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      class="toolbar-button"
    >
      H2
    </button>
    <button
      @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
      class="toolbar-button"
    >
      H3
    </button>
    <button
      @click="editor.chain().focus().toggleBulletList().run()"
      :class="{ 'is-active': editor.isActive('bulletList') }"
      class="toolbar-button"
    >
      •
    </button>
    <button
      @click="editor.chain().focus().toggleOrderedList().run()"
      :class="{ 'is-active': editor.isActive('orderedList') }"
      class="toolbar-button"
    >
      1.
    </button>
    <button
      @click="editor.chain().focus().toggleBlockquote().run()"
      :class="{ 'is-active': editor.isActive('blockquote') }"
      class="toolbar-button"
    >
      "
    </button>
    <button
      @click="editor.chain().focus().setHorizontalRule().run()"
      class="toolbar-button"
    >
      ―
    </button>
    <button
      @click="editor.chain().focus().undo().run()"
      :disabled="!editor.can().undo()"
      class="toolbar-button"
    >
      ↶
    </button>
    <button
      @click="editor.chain().focus().setTextAlign('left').run()"
      :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
      class="toolbar-button"
    >
      Left
    </button>
    <button
      @click="editor.chain().focus().setTextAlign('center').run()"
      :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
      class="toolbar-button"
    >
      Center
    </button>
    <button
      @click="editor.chain().focus().setTextAlign('right').run()"
      :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
      class="toolbar-button"
    >
      Right
    </button>
    <button
      @click="editor.chain().focus().redo().run()"
      :disabled="!editor.can().redo()"
      class="toolbar-button"
    >
      ↷
    </button>
    <input
      type="color"
      @input="editor.chain().focus().setColor($event.target.value).run()"
      :value="editor.getAttributes('textStyle').color || '#000000'"
      class="toolbar-button color-input"
    />
    <select
      @change="editor.chain().focus().setFontFamily($event.target.value).run()"
      :value="editor.getAttributes('textStyle').fontFamily || 'Arial'"
      class="toolbar-button font-family-select"
    >
      <option value="Arial">Arial</option>
      <option value="Times New Roman">Times New Roman</option>
      <option value="Courier New">Courier New</option>
      <option value="Georgia">Georgia</option>
      <option value="Verdana">Verdana</option>
      <option value="Helvetica">Helvetica</option>
      <option value="Comic Sans MS">Comic Sans MS</option>
      <option value="Impact">Impact</option>
    </select>
    <select
      @change="editor.chain().focus().setFontSize($event.target.value).run()"
      :value="editor.getAttributes('textStyle').fontSize || '16px'"
      class="toolbar-button font-size-select"
    >
      <option value="12px">12px</option>
      <option value="14px">14px</option>
      <option value="16px">16px</option>
      <option value="18px">18px</option>
      <option value="20px">20px</option>
      <option value="24px">24px</option>
      <option value="28px">28px</option>
      <option value="32px">32px</option>
    </select>
    <button
      @click="translateSelectedText"
      :disabled="isTranslating"
      class="toolbar-button translate-button"
    >
      {{ isTranslating ? 'Translating...' : 'Translate' }}
    </button>
    <button
      @click="editor.chain().focus().unsetAllMarks().run()"
      class="toolbar-button clear-format-button"
      title="Clear formatting"
    >
      ⌫
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { translationService } from '../../services/translationService'

interface Props {
  editor: Editor | null
}

const props = defineProps<Props>()
const isTranslating = ref(false)

const translateSelectedText = async () => {
  if (!props.editor) return

  const { from, to } = props.editor.state.selection
  const selectedText = props.editor.state.doc.textBetween(from, to)

  if (!selectedText.trim()) {
    alert('Please select some text to translate')
    return
  }

  isTranslating.value = true

  try {
    const response = await translationService.translate({ text: selectedText })

    // Replace the selected text with the translated text
    props.editor.chain().focus().deleteSelection().insertContent(response.translatedText).run()
  } catch (error) {
    console.error('Translation failed:', error)
    alert('Translation failed. Please try again.')
  } finally {
    isTranslating.value = false
  }
}

</script>

<style scoped>
@reference "tailwindcss";

.toolbar {
  @apply flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-md;
}

.toolbar-button {
  @apply px-2 py-1.5 border border-gray-300 rounded bg-white cursor-pointer text-sm transition-all duration-200;
}

.toolbar-button:hover {
  @apply bg-gray-100 border-gray-400;
}

.toolbar-button.is-active {
  @apply bg-blue-100 border-blue-500 text-blue-700;
}

.toolbar-button:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.color-input {
  @apply w-10 h-8 p-0 border border-gray-300 rounded bg-white cursor-pointer;
}

.font-family-select {
  @apply px-1.5 py-1 border border-gray-300 rounded bg-white cursor-pointer text-sm min-w-30;
}

.font-size-select {
  @apply px-1.5 py-1 border border-gray-300 rounded bg-white cursor-pointer text-sm;
}

.clear-format-button {
  @apply bg-red-50 border-red-300 text-red-600;
}

.clear-format-button:hover {
  @apply bg-red-100 border-red-400;
}

.translate-button {
  @apply bg-green-50 border-green-300 text-green-600;
}

.translate-button:hover:not(:disabled) {
  @apply bg-green-100 border-green-400;
}

.translate-button:disabled {
  @apply bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed;
}
</style>