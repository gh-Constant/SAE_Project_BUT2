/**
 * @file auth.middleware.ts
 * @description
 * Middleware d'authentification pour Express.js.
 * Fournit des fonctions pour vérifier les tokens JWT et authentifier les utilisateurs.
 *
 * @utilité
 * - Vérifie l'authenticité des tokens JWT dans les requêtes.
 * - Ajoute les informations utilisateur à la requête si le token est valide.
 * - Protège les routes sensibles contre les accès non autorisés.
 *
 * @exports
 * - AuthenticatedRequest : interface étendue de Request avec les infos utilisateur.
 * - authenticateToken : middleware principal pour vérifier les tokens JWT.
 * - optionalAuth : middleware optionnel qui ne bloque pas si pas de token.
 *
 * @remarques
 * - Utilise la clé secrète JWT_SECRET pour vérifier les tokens.
 * - Gère les erreurs de token expiré ou invalide avec des codes HTTP appropriés.
 * - Le middleware `authenticateToken` est requis pour les routes protégées.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Étendre l'interface Request d'Express pour inclure l'utilisateur
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization']; // Récupérer l'en-tête Authorization
  const token = authHeader && authHeader.split(' ')[1]; // Extraire le token après 'Bearer '

  if (!token) {
    res.status(401).json({ error: 'Access token required' }); // Token manquant
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string }; // Vérifier et décoder le token
    req.user = decoded; // Ajouter les infos utilisateur à la requête
    next(); // Passer au middleware suivant
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired' }); // Token expiré
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ error: 'Invalid token' }); // Token invalide
    } else {
      res.status(403).json({ error: 'Token verification failed' }); // Erreur de vérification
    }
  }
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']; // Récupérer l'en-tête Authorization
  const token = authHeader && authHeader.split(' ')[1]; // Extraire le token

  if (!token) {
    return next(); // Pas de token, continuer sans authentification
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string }; // Vérifier le token
    req.user = decoded; // Ajouter les infos utilisateur si valide
    next(); // Continuer avec l'utilisateur authentifié
  } catch (error) {
    next(); // Token invalide, continuer sans authentification
  }
};