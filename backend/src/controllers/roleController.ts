/**
 * @file roleController.ts
 * @description
 * Contrôleur pour gérer les opérations liées aux rôles dans l'application.
 * Fournit des endpoints pour récupérer les rôles depuis la base de données.
 *
 * @utilité
 * - Centralise la logique liée aux rôles.
 * - Fournit une interface unique pour accéder aux rôles.
 * - Facilite l'intégration avec d'autres modules de l'application qui dépendent des rôles.
 *
 * @exports
 * - roleController : objet contenant les fonctions de gestion des rôles.
 *
 * @remarques
 * - Utilise databaseService pour interagir avec la base de données.
 * - Les erreurs sont capturées et renvoyées avec un code HTTP 500.
 */

import { Request, Response } from 'express';
import { databaseService } from '../services/databaseService.js';

/**
 * Contrôleur pour les opérations sur les rôles.
 */
export const roleController = {
  /**
   * GET /roles
   * Récupère tous les rôles de la base de données.
   * @param _req - Objet request d'Express (non utilisé ici)
   * @param res - Objet response d'Express
   * @returns {Promise<void>} Envoie la liste des rôles ou une erreur
   *
   * @remarques
   * - Effectue une requête SQL simple pour sélectionner toutes les lignes de la table "roles".
   * - Les erreurs sont capturées et renvoyées avec un message explicite.
   */
  async getAllRoles(_req: Request, res: Response): Promise<void> {
    try {
      // Interrogation de la base de données pour récupérer tous les rôles
      const roles = await databaseService.query('SELECT * FROM roles');
      res.status(200).json(roles);
    } catch (error) {
      // Gestion des erreurs et réponse HTTP 500
      res.status(500).json({
        message: 'Failed to retrieve roles',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};
