<!--
  @file Toolbar.vue
  @description
  Barre d'outils de l'éditeur TipTap — thème médiéval.
  Fournit des boutons pour formater le texte, insérer des éléments, aligner, changer la couleur, la police, etc.
-->

<template>
  <div
    v-if="editor"
    class="toolbar"
  >
    <!-- Groupe : Formatage texte -->
    <div class="toolbar-group">
      <button
        :class="{ 'is-active': editor.isActive('bold') }"
        class="toolbar-button"
        title="Gras"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <i class="fas fa-bold"></i>
      </button>
      <button
        :class="{ 'is-active': editor.isActive('italic') }"
        class="toolbar-button"
        title="Italique"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <i class="fas fa-italic"></i>
      </button>
      <button
        :class="{ 'is-active': editor.isActive('underline') }"
        class="toolbar-button"
        title="Souligné"
        @click="editor.chain().focus().toggleUnderline().run()"
      >
        <i class="fas fa-underline"></i>
      </button>
      <button
        :class="{ 'is-active': editor.isActive('strike') }"
        class="toolbar-button"
        title="Barré"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        <i class="fas fa-strikethrough"></i>
      </button>
    </div>

    <div class="toolbar-separator" />

    <!-- Groupe : Titres -->
    <div class="toolbar-group">
      <button
        :class="{ 'is-active': editor.isActive('paragraph') }"
        class="toolbar-button"
        title="Paragraphe"
        @click="editor.chain().focus().setParagraph().run()"
      >
        <i class="fas fa-paragraph"></i>
      </button>
      <button
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        class="toolbar-button toolbar-button-heading"
        title="Titre 1"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        H1
      </button>
      <button
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        class="toolbar-button toolbar-button-heading"
        title="Titre 2"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        H2
      </button>
      <button
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        class="toolbar-button toolbar-button-heading"
        title="Titre 3"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        H3
      </button>
    </div>

    <div class="toolbar-separator" />

    <!-- Groupe : Listes & Blocs -->
    <div class="toolbar-group">
      <button
        :class="{ 'is-active': editor.isActive('bulletList') }"
        class="toolbar-button"
        title="Liste à puces"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <i class="fas fa-list-ul"></i>
      </button>
      <button
        :class="{ 'is-active': editor.isActive('orderedList') }"
        class="toolbar-button"
        title="Liste numérotée"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        <i class="fas fa-list-ol"></i>
      </button>
      <button
        :class="{ 'is-active': editor.isActive('blockquote') }"
        class="toolbar-button"
        title="Citation"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        <i class="fas fa-quote-right"></i>
      </button>
      <button
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        class="toolbar-button"
        title="Bloc de code"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      >
        <i class="fas fa-code"></i>
      </button>
      <button
        class="toolbar-button"
        title="Ligne horizontale"
        @click="editor.chain().focus().setHorizontalRule().run()"
      >
        <i class="fas fa-minus"></i>
      </button>
    </div>

    <div class="toolbar-separator" />

    <!-- Groupe : Alignement -->
    <div class="toolbar-group">
      <button
        :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
        class="toolbar-button"
        title="Aligner à gauche"
        @click="editor.chain().focus().setTextAlign('left').run()"
      >
        <i class="fas fa-align-left"></i>
      </button>
      <button
        :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
        class="toolbar-button"
        title="Centrer"
        @click="editor.chain().focus().setTextAlign('center').run()"
      >
        <i class="fas fa-align-center"></i>
      </button>
      <button
        :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
        class="toolbar-button"
        title="Aligner à droite"
        @click="editor.chain().focus().setTextAlign('right').run()"
      >
        <i class="fas fa-align-right"></i>
      </button>
    </div>

    <div class="toolbar-separator" />

    <!-- Groupe : Couleur & Polices -->
    <div class="toolbar-group">
      <div class="color-picker-wrapper" title="Couleur du texte">
        <i class="fas fa-palette color-picker-icon"></i>
        <input
          type="color"
          :value="editor.getAttributes('textStyle').color || '#000000'"
          class="color-input"
          @input="
            editor
              .chain()
              .focus()
              .setColor(($event.target as HTMLInputElement).value)
              .run()
          "
        >
      </div>
      <select
        :value="editor.getAttributes('textStyle').fontFamily || 'Arial'"
        class="toolbar-select"
        title="Police"
        @change="
          editor
            .chain()
            .focus()
            .setFontFamily(($event.target as HTMLSelectElement).value)
            .run()
        "
      >
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
        <option value="Georgia">Georgia</option>
        <option value="Verdana">Verdana</option>
        <option value="Helvetica">Helvetica</option>
      </select>
      <select
        :value="editor.getAttributes('textStyle').fontSize || '16px'"
        class="toolbar-select"
        title="Taille"
        @change="
          editor
            .chain()
            .focus()
            .setFontSize(($event.target as HTMLSelectElement).value)
            .run()
        "
      >
        <option value="12px">12</option>
        <option value="14px">14</option>
        <option value="16px">16</option>
        <option value="18px">18</option>
        <option value="20px">20</option>
        <option value="24px">24</option>
        <option value="28px">28</option>
        <option value="32px">32</option>
      </select>
    </div>

    <div class="toolbar-separator" />

    <!-- Groupe : Undo / Redo / Clear -->
    <div class="toolbar-group">
      <button
        :disabled="!editor.can().undo()"
        class="toolbar-button"
        title="Annuler"
        @click="editor.chain().focus().undo().run()"
      >
        <i class="fas fa-undo"></i>
      </button>
      <button
        :disabled="!editor.can().redo()"
        class="toolbar-button"
        title="Rétablir"
        @click="editor.chain().focus().redo().run()"
      >
        <i class="fas fa-redo"></i>
      </button>
      <button
        class="toolbar-button clear-format-button"
        title="Effacer le formatage"
        @click="editor.chain().focus().unsetAllMarks().run()"
      >
        <i class="fas fa-eraser"></i>
      </button>
    </div>
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
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: rgba(212, 197, 165, 0.6);
  border-bottom: 2px solid rgba(193, 155, 108, 0.3);
  border-radius: 6px 6px 0 0;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.toolbar-separator {
  width: 1px;
  height: 24px;
  background: rgba(193, 155, 108, 0.2);
  margin: 0 6px;
}

.toolbar-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(193, 155, 108, 0.2);
  border-radius: 4px;
  background: rgba(243, 234, 214, 0.8);
  color: rgba(44, 36, 27, 0.7);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.toolbar-button:hover {
  background: rgba(193, 155, 108, 0.15);
  border-color: rgba(193, 155, 108, 0.4);
  color: #2C241B;
}

.toolbar-button.is-active {
  background: #C19B6C;
  color: white;
  border-color: #C19B6C;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.toolbar-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.toolbar-button:disabled:hover {
  background: rgba(243, 234, 214, 0.8);
  border-color: rgba(193, 155, 108, 0.2);
}

.toolbar-button-heading {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 11px;
}

.toolbar-select {
  height: 32px;
  padding: 0 8px;
  font-size: 12px;
  border: 1px solid rgba(193, 155, 108, 0.2);
  border-radius: 4px;
  background: rgba(243, 234, 214, 0.8);
  color: rgba(44, 36, 27, 0.8);
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-select:hover {
  border-color: rgba(193, 155, 108, 0.4);
}

.toolbar-select:focus {
  outline: none;
  border-color: #C19B6C;
}

.color-picker-wrapper {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(193, 155, 108, 0.2);
  border-radius: 4px;
  background: rgba(243, 234, 214, 0.8);
  cursor: pointer;
  transition: all 0.2s;
}

.color-picker-wrapper:hover {
  background: rgba(193, 155, 108, 0.15);
  border-color: rgba(193, 155, 108, 0.4);
}

.color-picker-icon {
  font-size: 14px;
  color: rgba(44, 36, 27, 0.7);
  pointer-events: none;
}

.color-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.clear-format-button {
  background: rgba(254, 242, 242, 0.8);
  border-color: rgba(252, 165, 165, 0.5);
  color: rgba(239, 68, 68, 0.7);
}

.clear-format-button:hover {
  background: #fee2e2;
  border-color: #f87171;
  color: #dc2626;
}
</style>
