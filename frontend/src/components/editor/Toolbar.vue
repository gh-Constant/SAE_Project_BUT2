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
      @click="editor.chain().focus().toggleCode().run()"
      :class="{ 'is-active': editor.isActive('code') }"
      class="toolbar-button"
    >
      Code
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
      ⬅
    </button>
    <button
      @click="editor.chain().focus().setTextAlign('center').run()"
      :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
      class="toolbar-button"
    >
      ⬌
    </button>
    <button
      @click="editor.chain().focus().setTextAlign('right').run()"
      :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
      class="toolbar-button"
    >
      ➡
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
      :value="getCurrentFontSize()"
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
      @click="editor.chain().focus().unsetAllMarks().run()"
      class="toolbar-button clear-format-button"
      title="Clear formatting"
    >
      ⌫
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

interface Props {
  editor: Editor | null
}

const props = defineProps<Props>()

const getCurrentFontSize = () => {
  if (!props.editor) return '16px'

  // Check if we're in a heading
  if (props.editor.isActive('heading', { level: 1 })) return '32px' // 2em = 32px (assuming 16px base)
  if (props.editor.isActive('heading', { level: 2 })) return '24px' // 1.5em = 24px
  if (props.editor.isActive('heading', { level: 3 })) return '18.72px' // 1.17em ≈ 18.72px

  // Otherwise return the textStyle fontSize or default
  return props.editor.getAttributes('textStyle').fontSize || '16px'
}
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 4px 4px 0 0;
}

.toolbar-button {
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.toolbar-button:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.toolbar-button.is-active {
  background: #dbeafe;
  border-color: #3b82f6;
  color: #1d4ed8;
}

.toolbar-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.color-input {
  width: 40px;
  height: 32px;
  padding: 0;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.font-family-select {
  padding: 4px 6px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  min-width: 120px;
}

.font-size-select {
  padding: 4px 6px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
}

.clear-format-button {
  background: #fef2f2;
  border-color: #fca5a5;
  color: #dc2626;
}

.clear-format-button:hover {
  background: #fee2e2;
  border-color: #f87171;
}
</style>