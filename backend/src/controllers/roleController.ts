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
import prisma from '../prisma.js';

/**
 * Contrôleur pour les opérations sur les rôles.
 */
export const roleController = {
  /**
   * GET /roles
   * Récupère tous les rôles de la base de données via Prisma.
   * @param _req - Objet request d'Express (non utilisé ici)
   * @param res - Objet response d'Express
   * @returns {Promise<void>} Envoie la liste des rôles ou une erreur
   */
  async getAllRoles(_req: Request, res: Response): Promise<void> {
    try {
      // Utilisation de Prisma pour récupérer les rôles
      const roles = await prisma.role.findMany();
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to retrieve roles',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};
