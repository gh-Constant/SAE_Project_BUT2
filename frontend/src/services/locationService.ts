/**
 * @file locationService.ts
 * @description
 * Service de gestion des locations qui choisit entre le mode mock et le mode réel.
 * Fournit les fonctions pour récupérer et gérer les locations.
 *
 * @utilité
 * - Permet de tester l'application avec des données mock sans backend.
 * - Prépare l'intégration avec un vrai backend plus tard.
 * - Fournit une interface unique pour les opérations sur les locations.
 *
 * @exports
 * - locationService : service de locations utilisé dans l'application.
 *
 * @remarques
 * - Pour l'instant, utilise toujours le mode mock même si le backend est activé.
 */

import { locationMockService } from './mock/locationMockService';

// Pour l'instant, on utilise toujours le service mock
export const locationService = locationMockService;

// Log pour savoir qu'on utilise le mode mock
console.log('Location service initialized: MOCK mode');