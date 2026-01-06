/**
 * @file levelCalculator.ts
 * @description
 * Fonctions utilitaires pour calculer le niveau, l'XP et la progression.
 * Ces fonctions sont identiques à celles du backend pour garantir la cohérence.
 */

/**
 * Calcule le niveau d'un utilisateur en fonction de son XP total
 * 
 * FORMULE : Niveau = floor(sqrt(XP / 50)) + 1
 * 
 * EXPLICATION DE LA FORMULE :
 * 1. On divise l'XP par 50 (facteur d'échelle)
 *    → Plus ce nombre est grand, plus lente sera la progression
 *    → Avec 50, les premiers niveaux sont rapides, puis ça ralentit
 * 
 * 2. On prend la racine carrée (sqrt)
 *    → Crée une courbe de progression "douce" (pas exponentielle)
 *    → Exemple : pour doubler de niveau, il faut 4× plus d'XP
 *    → Niveau 2 → 4 nécessite 4× plus d'XP que 1 → 2
 * 
 * 3. On arrondit à l'entier inférieur (floor)
 *    → On ne gagne un niveau que quand on atteint le seuil complet
 *    → Évite les niveaux "à virgule" (2.5, etc.)
 * 
 * 4. On ajoute 1
 *    → Le niveau minimum est 1 (pas 0)
 *    → Avec 0 XP, on est niveau 1
 * 
 * TABLEAU DE PROGRESSION (exemples) :
 * - Niveau 1  :        0 XP  (début du jeu)
 * - Niveau 2  :       50 XP  (1ère quête de 50 XP)
 * - Niveau 3  :      200 XP  (besoin de +150 XP)
 * - Niveau 4  :      450 XP  (besoin de +250 XP)
 * - Niveau 5  :      800 XP  (besoin de +350 XP)
 * - Niveau 10 :    4,050 XP  (besoin de +850 XP par niveau après 9)
 * - Niveau 20 :   18,050 XP  (besoin de +1,850 XP par niveau après 19)
 * - Niveau 50 :  122,500 XP  (besoin de +4,850 XP par niveau après 49)
 * - Niveau 100: 495,000 XP  (besoin de +9,850 XP par niveau après 99)
 * 
 * POURQUOI CETTE FORMULE ?
 * - Progression rapide au début → encourage les nouveaux joueurs
 * - Ralentit progressivement → garde l'intérêt à long terme
 * - Jamais impossible → même niveau 100 reste atteignable
 * - Équilibrée : ~80 quêtes pour niveau 10, ~360 pour niveau 20
 * 
 * @param xp - L'XP total de l'utilisateur
 * @returns Le niveau calculé (minimum 1)
 */
export const calculateLevelFromXP = (xp: number): number => {
  // Si l'utilisateur a 0 ou moins d'XP, il est niveau 1 (protection)
  if (xp <= 0) return 1;
  
  // Applique la formule : floor(sqrt(XP / 50)) + 1
  return Math.floor(Math.sqrt(xp / 50)) + 1;
};

/**
 * Calcule l'XP TOTAL nécessaire pour atteindre le niveau suivant
 * 
 * FORMULE INVERSE : XP = (niveau - 1)² × 50
 * 
 * EXPLICATION :
 * Cette formule est l'inverse de calculateLevelFromXP.
 * Si niveau = floor(sqrt(XP / 50)) + 1, alors XP = (niveau - 1)² × 50
 * 
 * POURQUOI (niveau - 1)² ?
 * - On enlève 1 pour revenir au "vrai" niveau (car on a +1 dans la formule de base)
 * - On met au carré (inverse de la racine carrée)
 * - On multiplie par 50 (inverse de la division par 50)
 * 
 * EXEMPLES CONCRETS :
 * - Pour atteindre niveau 2 : (2-1)² × 50 = 1 × 50 = 50 XP
 * - Pour atteindre niveau 3 : (3-1)² × 50 = 4 × 50 = 200 XP
 * - Pour atteindre niveau 4 : (4-1)² × 50 = 9 × 50 = 450 XP
 * - Pour atteindre niveau 10 : (10-1)² × 50 = 81 × 50 = 4,050 XP
 * 
 * UTILISATION :
 * Afficher à l'utilisateur "XP actuel / XP pour prochain niveau"
 * Exemple : "220 / 450 XP" (niveau 3 vers niveau 4)
 * 
 * @param currentLevel - Le niveau actuel de l'utilisateur
 * @returns L'XP TOTAL nécessaire pour atteindre le niveau suivant
 */
export const getXPForNextLevel = (currentLevel: number): number => {
  const nextLevel = currentLevel + 1;
  
  // Formule inverse : (niveau - 1)² × 50
  return (nextLevel - 1) * (nextLevel - 1) * 50;
};

/**
 * Calcule le pourcentage de progression vers le niveau suivant
 * 
 * OBJECTIF :
 * Afficher une barre de progression (0% à 100%) pour le niveau en cours
 * 
 * LOGIQUE DE CALCUL :
 * 1. Calculer l'XP de DÉBUT du niveau actuel
 *    → Exemple : Niveau 3 commence à 200 XP
 * 
 * 2. Calculer l'XP de FIN du niveau actuel (= début du niveau suivant)
 *    → Exemple : Niveau 3 se termine à 450 XP (début niveau 4)
 * 
 * 3. Calculer combien d'XP il faut gagner DANS ce niveau
 *    → Exemple : Pour passer de niveau 3 à 4, il faut 450 - 200 = 250 XP
 * 
 * 4. Calculer combien d'XP on a déjà gagné dans ce niveau
 *    → Exemple : Si on a 220 XP total, on a gagné 220 - 200 = 20 XP dans le niveau 3
 * 
 * 5. Calculer le pourcentage : (XP gagné / XP nécessaire) × 100
 *    → Exemple : (20 / 250) × 100 = 8%
 * 
 * EXEMPLE COMPLET :
 * Utilisateur niveau 3 avec 220 XP total :
 * - Niveau 3 commence à : 200 XP
 * - Niveau 4 commence à : 450 XP
 * - XP nécessaire dans niveau 3 : 450 - 200 = 250 XP
 * - XP déjà gagné dans niveau 3 : 220 - 200 = 20 XP
 * - Progression : (20 / 250) × 100 = 8%
 * 
 * PROTECTION :
 * - Math.min(100, ...) : Le pourcentage ne peut pas dépasser 100%
 * - Math.max(0, ...) : Le pourcentage ne peut pas être négatif
 * - Math.round(...) : Arrondit pour avoir un nombre entier
 * 
 * @param currentXP - L'XP total actuel de l'utilisateur
 * @param currentLevel - Le niveau actuel de l'utilisateur
 * @returns Le pourcentage de progression (0 à 100)
 */
export const getXPProgress = (currentXP: number, currentLevel: number): number => {
  // XP de début du niveau actuel (exemple : niveau 3 = 200 XP)
  const xpForCurrentLevel = (currentLevel - 1) * (currentLevel - 1) * 50;
  
  // XP de début du niveau suivant (exemple : niveau 4 = 450 XP)
  const xpForNextLevel = getXPForNextLevel(currentLevel);
  
  // Combien d'XP il faut gagner DANS ce niveau (exemple : 450 - 200 = 250)
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  
  // Combien d'XP on a déjà gagné DANS ce niveau (exemple : 220 - 200 = 20)
  const xpGained = currentXP - xpForCurrentLevel;
  
  // Pourcentage : (20 / 250) × 100 = 8%, avec protection 0-100
  return Math.min(100, Math.max(0, Math.round((xpGained / xpNeeded) * 100)));
};

/**
 * Calcule l'XP nécessaire dans le niveau actuel (pour l'affichage)
 * 
 * @param currentXP - L'XP total actuel
 * @param currentLevel - Le niveau actuel
 * @returns L'XP gagné dans le niveau actuel (ex: 20 XP sur 250 nécessaires)
 */
export const getXPInCurrentLevel = (currentXP: number, currentLevel: number): number => {
  const xpForCurrentLevel = (currentLevel - 1) * (currentLevel - 1) * 50;
  return Math.max(0, currentXP - xpForCurrentLevel);
};

/**
 * Calcule l'XP nécessaire pour compléter le niveau actuel
 * 
 * @param currentXP - L'XP total actuel
 * @param currentLevel - Le niveau actuel
 * @returns L'XP nécessaire pour passer au niveau suivant
 */
export const getXPNeededForNextLevel = (currentXP: number, currentLevel: number): number => {
  const xpForCurrentLevel = (currentLevel - 1) * (currentLevel - 1) * 50;
  const xpForNextLevel = getXPForNextLevel(currentLevel);
  return xpForNextLevel - xpForCurrentLevel;
};
