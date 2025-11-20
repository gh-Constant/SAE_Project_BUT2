/**
 * @file roleController.ts
 * @description
 * Contrôleur pour gérer les opérations liées aux rôles dans l'application.
 * Fournit des endpoints pour récupérer les rôles (maintenant un enum).
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
 * - Role est maintenant un enum, pas une table de base de données.
 * - Les erreurs sont capturées et renvoyées avec un code HTTP 500.
 */

import { Request, Response } from 'express';
import prisma, { Role } from '../prisma.js';

/**
 * Contrôleur pour les opérations sur les rôles.
 */
export const roleController = {
  /**
   * GET /roles
   * Récupère tous les rôles disponibles (depuis l'enum).
   * @param _req - Objet request d'Express (non utilisé ici)
   * @param res - Objet response d'Express
   * @returns {Promise<void>} Envoie la liste des rôles ou une erreur
   */
  async getAllRoles(_req: Request, res: Response): Promise<void> {
    try {
      // Les rôles sont maintenant un enum, on retourne toutes les valeurs
      const roles = Object.values(Role);
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to retrieve roles',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  /**
   * GET /roles/name/:name
   * Vérifie si un rôle existe par son nom.
   * @param req - Objet request d'Express avec le nom du rôle
   * @param res - Objet response d'Express
   * @returns {Promise<void>} Envoie le rôle ou une erreur 404
   */
  async getRoleByName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;

      // Vérifier si le nom correspond à un rôle valide
      const roleValues = Object.values(Role);
      const role = roleValues.find(r => r === name);

      if (!role) {
        res.status(404).json({
          message: 'Role not found',
        });
        return;
      }

      res.status(200).json({ role });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to retrieve role',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  /**
   * GET /roles/user/:userId
   * Récupère le rôle d'un utilisateur spécifique par son ID.
   * @param req - Objet request d'Express avec l'ID de l'utilisateur
   * @param res - Objet response d'Express
   * @returns {Promise<void>} Envoie le rôle de l'utilisateur ou une erreur 404
   */
  async getUserRole(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const id = parseInt(userId, 10);

      if (isNaN(id)) {
        res.status(400).json({
          message: 'Invalid user ID',
        });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id_user: id },
        select: { role: true },
      });

      if (!user) {
        res.status(404).json({
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({ role: user.role });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to retrieve user role',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};
