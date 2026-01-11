<!--
  @file Toolbar.vue
  @description
  Barre d'outils de l'éditeur TipTap.
  Fournit des boutons pour formater le texte, insérer des éléments, aligner, changer la couleur, la police, etc.

  @utilité
  - Interface principale d'interaction avec l'éditeur.
  - Simplifie la gestion des styles et de la structure du contenu.
-->

<template>
  <div
    v-if="editor"
    class="toolbar"
  >
    <button
      :class="{ 'is-active': editor.isActive('bold') }"
      class="toolbar-button"
      @click="editor.chain().focus().toggleBold().run()"
    >
      <strong>B</strong>
    </button>
    <button
      :class="{ 'is-active': editor.isActive('italic') }"
      class="toolbar-button"
      @click="editor.chain().focus().toggleItalic().run()"
    >
      <em>I</em>
    </button>
    <button
      :class="{ 'is-active': editor.isActive('strike') }"
      class="toolbar-button"
      @click="editor.chain().focus().toggleStrike().run()"
    >
      <s>S</s>
    </button>
    <button
      :class="{ 'is-active': editor.isActive('underline') }"
      class="toolbar-button"
      @click="editor.chain().focus().toggleUnderline().run()"
    >
      <u>U</u>
    </button>
    <button
      :class="{ 'is-active': editor.isActive('codeBlock') }"
      class="toolbar-button"
      @click="editor.chain().focus().toggleCodeBlock().run()"
    >
      Code Block
    </button>
    <button
      :class="{ 'is-active': editor.isActive('paragraph') }"
      class="toolbar-button"
      @click="editor.chain().focus().setParagraph().run()"
    >
      ¶
    </button>
    <button
      :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      class="toolbar-button"
      @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
    >
      H1
    </button>
    <button
      :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      class="toolbar-button"
      @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
    >
      H2
    </button>
    <button
      :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
      class="toolbar-button"
      @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
    >
      H3
    </button>
    <button
      :class="{ 'is-active': editor.isActive('bulletList') }"
      class="toolbar-button"
      @click="editor.chain().focus().toggleBulletList().run()"
    >
      •
    </button>
    <button
      :class="{ 'is-active': editor.isActive('orderedList') }"
      class="toolbar-button"
      @click="editor.chain().focus().toggleOrderedList().run()"
    >
      1.
    </button>
    <button
      :class="{ 'is-active': editor.isActive('blockquote') }"
      class="toolbar-button"
      @click="editor.chain().focus().toggleBlockquote().run()"
    >
      "
    </button>
    <button
      class="toolbar-button"
      @click="editor.chain().focus().setHorizontalRule().run()"
    >
      ―
    </button>
    <button
      :disabled="!editor.can().undo()"
      class="toolbar-button"
      @click="editor.chain().focus().undo().run()"
    >
      ↶
    </button>
    <button
      :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
      class="toolbar-button"
      @click="editor.chain().focus().setTextAlign('left').run()"
    >
      Left
    </button>
    <button
      :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
      class="toolbar-button"
      @click="editor.chain().focus().setTextAlign('center').run()"
    >
      Center
    </button>
    <button
      :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
      class="toolbar-button"
      @click="editor.chain().focus().setTextAlign('right').run()"
    >
      Right
    </button>
    <button
      :disabled="!editor.can().redo()"
      class="toolbar-button"
      @click="editor.chain().focus().redo().run()"
    >
      ↷
    </button>
    <input
      type="color"
      :value="editor.getAttributes('textStyle').color || '#000000'"
      class="toolbar-button color-input"
      @input="
        editor
          .chain()
          .focus()
          .setColor(($event.target as HTMLInputElement).value)
          .run()
      "
    >
    <select
      :value="editor.getAttributes('textStyle').fontFamily || 'Arial'"
      class="toolbar-button font-family-select"
      @change="
        editor
          .chain()
          .focus()
          .setFontFamily(($event.target as HTMLSelectElement).value)
          .run()
      "
    >
      <option value="Arial">
        Arial
      </option>
      <option value="Times New Roman">
        Times New Roman
      </option>
      <option value="Courier New">
        Courier New
      </option>
      <option value="Georgia">
        Georgia
      </option>
      <option value="Verdana">
        Verdana
      </option>
      <option value="Helvetica">
        Helvetica
      </option>
      <option value="Comic Sans MS">
        Comic Sans MS
      </option>
      <option value="Impact">
        Impact
      </option>
    </select>
    <select
      :value="editor.getAttributes('textStyle').fontSize || '16px'"
      class="toolbar-button font-size-select"
      @change="
        editor
          .chain()
          .focus()
          .setFontSize(($event.target as HTMLSelectElement).value)
          .run()
      "
    >
      <option value="12px">
        12px
      </option>
      <option value="14px">
        14px
      </option>
      <option value="16px">
        16px
      </option>
      <option value="18px">
        18px
      </option>
      <option value="20px">
        20px
      </option>
      <option value="24px">
        24px
      </option>
      <option value="28px">
        28px
      </option>
      <option value="32px">
        32px
      </option>
    </select>

    <button
      class="toolbar-button clear-format-button"
      title="Clear formatting"
      @click="editor.chain().focus().unsetAllMarks().run()"
    >
      Clear
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';

interface Props {
  editor: Editor | null;
}

defineProps<Props>();
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


</style>
