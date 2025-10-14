import StarterKit from '@tiptap/starter-kit'
import Blockquote from '@tiptap/extension-blockquote'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle, FontSize, FontFamily } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'

export const editorExtensions = [
  StarterKit,
  Blockquote,
  Link.configure({
    openOnClick: true,
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  TextStyle,
  Color,
  FontSize,
  FontFamily,
]