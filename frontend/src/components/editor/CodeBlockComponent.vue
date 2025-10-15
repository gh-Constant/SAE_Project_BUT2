<!--
  @file CodeBlockComponent.vue
  @description
  Composant Vue personnalisé utilisé par TipTap pour le rendu des blocs de code.
  Permet à l’utilisateur de choisir le langage du code via un menu déroulant.

  @utilité
  - Fournit une interface graphique dans le bloc de code pour choisir la coloration syntaxique.
  - Intégré dans TipTap via VueNodeViewRenderer.

  @concepts TipTap :
  - NodeViewWrapper : wrapper qui relie le composant Vue au système de rendu TipTap.
  - NodeViewContent : zone dans laquelle le contenu du nœud (le code ici) est rendu.
  - props.node.attrs.language : attribut du bloc de code (langage choisi).
-->

<template>
  <node-view-wrapper class="code-block">
    <!-- Menu déroulant pour choisir le langage -->
    <select
      v-model="selectedLanguage"
      contenteditable="false"
      class="language-selector"
      tabindex="-1"
    >
      <option :value="null">
        auto
      </option>
      <option disabled>
        —
      </option>
      <option
        v-for="(language, index) in languages"
        :key="index"
        :value="language"
      >
        {{ language }}
      </option>
    </select>

    <!-- Le contenu du bloc de code -->
    <pre><code><node-view-content /></code></pre>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
// Ne pas utiliser NodeViewProps, il ne marche plus aprés 2.7 de tiptap si je me trompe pas, c'est nodeViewProps mtn
import { computed } from 'vue'

/** Props fournies par TipTap, incluant les attributs du nœud et sa configuration */
const props = defineProps(nodeViewProps)

/**
 * Liste dynamique des langages supportés par Lowlight.
 */
const languages = computed(() => {
  return props.extension.options.lowlight.listLanguages()
})

/**
 * Langage actuellement sélectionné dans le bloc de code.
 * Synchronisé avec les attributs TipTap via updateAttributes.
 */
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

/* Style général du bloc de code */
.code-block {
  @apply relative my-4;
}

/* Menu de sélection du langage */
.language-selector {
  @apply absolute top-2 right-2 bg-gray-100 border border-gray-300 rounded px-2 py-1 pr-6 text-xs cursor-pointer text-gray-700 z-10;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="Black" d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 0.25rem center;
  background-size: 0.75rem;
}

/* Style du contenu code */
.code-block pre {
  @apply m-0 p-4 bg-gray-200 rounded-md overflow-x-auto text-left;
}

.code-block code {
  @apply text-gray-900 font-mono text-sm leading-relaxed text-left;
}
</style>
