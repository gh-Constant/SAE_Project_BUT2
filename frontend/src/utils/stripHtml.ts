/**
 * Extrait le texte brut d'une chaîne HTML.
 * Utilisé pour les aperçus (cartes produits, tableaux, listes)
 * où on veut afficher le contenu sans formatage.
 */
export function stripHtml(html: string): string {
  if (!html) return ''
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}
