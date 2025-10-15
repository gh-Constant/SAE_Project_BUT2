/**
 * @file extensions.ts
 * @description
 * Liste et configuration des extensions TipTap utilisées dans l’éditeur.
 * Inclut les extensions de base (StarterKit) et des extensions avancées :
 * bloc de code coloré, alignement du texte, styles de texte, couleurs, polices, etc.
 *
 * @utilité
 * - Étend les fonctionnalités du StarterKit avec des extensions supplémentaires.
 * - Intègre la coloration syntaxique via Lowlight.
 * - Permet un rendu personnalisé des blocs de code avec Vue.
 *
 * @dépendances
 * - TipTap et ses extensions officielles.
 * - Lowlight (pour la coloration syntaxique).
 * - VueNodeViewRenderer (pour intégrer des composants Vue dans TipTap).
 *
 * @exports
 * - editorExtensions : tableau d’extensions configurées à utiliser dans l’éditeur.
 */

import StarterKit from '@tiptap/starter-kit'
import Blockquote from '@tiptap/extension-blockquote'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle, FontSize, FontFamily } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CodeBlockComponent from './CodeBlockComponent.vue'

/**
 * Instancie Lowlight avec tous les langages supportés.
 * Utilisé pour colorer le code dans les blocs <code>.
 */
const lowlight = createLowlight(all)

/**
 * Ensemble des extensions TipTap activées dans l’éditeur.
 */
export const editorExtensions = [
  // StarterKit inclut le minimum vital : bold, italic, listes, titres, etc.
  StarterKit.configure({
    codeBlock: false, // désactive le code block par défaut pour utiliser celui personnalisé
  }),

  // Extension pour les blocs de code avec coloration syntaxique
  CodeBlockLowlight.configure({
    lowlight,
    enableTabIndentation: true,
  }).extend({
    /**
     * Surcharge de la méthode addNodeView :
     * permet de render le composant CodeBlock avec un composant Vue personnalisé.
     */
    addNodeView() {
      return VueNodeViewRenderer(CodeBlockComponent)
    },
  }),

  Blockquote,
  Link.configure({ openOnClick: true }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  TextStyle,
  Color,
  FontSize,
  FontFamily,
]
