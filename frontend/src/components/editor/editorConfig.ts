/**
 * @file editorConfig.ts
 * @description
 * Fichier de configuration central de l’éditeur TipTap.
 * Définit les extensions utilisées (StarterKit, liens, couleurs, alignement, etc.)
 * et exporte un contenu par défaut affiché au démarrage.
 *
 * @utilité
 * - Centralise la configuration des extensions pour simplifier la maintenance.
 * - Facilite l’ajout ou la suppression d’extensions dans l’éditeur.
 *
 * @exports
 * - editorExtensions : tableau contenant la liste des extensions actives.
 * - defaultContent : contenu HTML initial de l’éditeur.
 */

import { editorExtensions } from './extensions'

export { editorExtensions }

/** Contenu initial affiché à l’ouverture de l’éditeur */
export const defaultContent = '<p>Hello, start editing!</p>'
