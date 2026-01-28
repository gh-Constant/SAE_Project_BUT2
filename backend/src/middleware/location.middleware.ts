import { Response, NextFunction } from 'express';
import prisma from '../prisma.js';
import { AuthenticatedRequest } from './auth.middleware.js';

/**
 * Middleware to check if the authenticated user owns the location specified in the request body.
 * Assumes id_location is in req.body.
 */
export const checkLocationOwnership = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id_location } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (!id_location) {
      res.status(400).json({ error: 'Location ID is required' });
      return;
    }

    const location = await prisma.location.findUnique({
      where: { id_location: Number(id_location) },
    });

    if (!location) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    if (location.id_prestataire !== userId) {
      res.status(403).json({ error: 'You do not own this location' });
      return;
    }

    next();
  } catch (error) {
    console.error('Location ownership check error:', error);
    res.status(500).json({ error: 'Internal server error during location ownership check' });
  }
};

/**
 * Middleware to check if the authenticated user owns the location associated with the blog specified in route params.
 * Assumes blog ID is in req.params.id.
 */
export const checkBlogLocationOwnership = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const blogId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (isNaN(blogId)) {
      res.status(400).json({ error: 'Invalid blog ID' });
      return;
    }

    const blog = await prisma.blog.findUnique({
      where: { id_blog: blogId },
    });

    if (!blog) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }

    const location = await prisma.location.findUnique({
      where: { id_location: blog.id_location },
    });

    if (!location || location.id_prestataire !== userId) {
      res.status(403).json({ error: 'You do not own the location for this blog' });
      return;
    }

    next();
  } catch (error) {
    console.error('Blog location ownership check error:', error);
    res.status(500).json({ error: 'Internal server error during blog location ownership check' });
  }
};

/**
 * Middleware to check if the authenticated user owns the location associated with the quest specified in route params.
 * Assumes quest ID is in req.params.questId.
 */
export const checkQuestLocationOwnership = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const questId = parseInt(req.params.questId);

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (isNaN(questId)) {
      res.status(400).json({ error: 'Invalid quest ID' });
      return;
    }

    const quest = await prisma.quest.findUnique({
      where: { id_quest: questId },
    });

    if (!quest) {
      res.status(404).json({ error: 'Quest not found' });
      return;
    }

    const location = await prisma.location.findUnique({
      where: { id_location: quest.id_location },
    });

    if ((!location || location.id_prestataire !== userId) && req.user?.role !== 'admin') {
      res.status(403).json({ error: 'You do not own the location for this quest' });
      return;
    }

    next();
  } catch (error) {
    console.error('Quest location ownership check error:', error);
    res.status(500).json({ error: 'Internal server error during quest location ownership check' });
  }
};

/**
 * Middleware to check if a location is available for purchase.
 * Checks if location exists and is not already purchased.
 * Location ID is in req.params.id.
 */
export const checkLocationAvailable = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const locationId = parseInt(req.params.id);

    if (isNaN(locationId)) {
      res.status(400).json({ error: 'Invalid location ID' });
      return;
    }

    const location = await prisma.location.findUnique({
      where: { id_location: locationId },
    });

    if (!location) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    // Check if location is already purchased
    if (location.purchased) {
      res.status(400).json({ error: 'Location is already purchased' });
      return;
    }

    next();
  } catch (error) {
    console.error('Location availability check error:', error);
    res.status(500).json({ error: 'Internal server error during location availability check' });
  }
};

/**
 * Middleware pour vérifier que l'utilisateur est le propriétaire du produit.
 * Pour UPDATE/DELETE de produits.
 */
export const checkProductOwnership = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const productId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({ error: 'Utilisateur non authentifié' });
      return;
    }

    if (isNaN(productId)) {
      res.status(400).json({ error: 'ID produit invalide' });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id_product: productId },
    });

    if (!product) {
      res.status(404).json({ error: 'Produit non trouvé' });
      return;
    }

    // Vérifier que le prestataire est propriétaire du produit
    if (product.id_prestataire !== userId) {
      res.status(403).json({ error: 'Vous n\'êtes pas le propriétaire de ce produit' });
      return;
    }

    next();
  } catch (error) {
    console.error('Erreur vérification propriété produit:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la vérification' });
  }
};

/**
 * Middleware pour vérifier que l'id_prestataire dans le body correspond à l'utilisateur connecté.
 * Pour CREATE de produits.
 */
export const checkPrestataireMatch = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id_prestataire } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Utilisateur non authentifié' });
      return;
    }

    // Si id_prestataire est fourni, il doit correspondre à l'utilisateur connecté
    if (id_prestataire && Number(id_prestataire) !== userId) {
      res.status(403).json({ error: 'Vous ne pouvez créer des produits que pour vous-même' });
      return;
    }

    // Injecter l'id_prestataire si non fourni
    if (!id_prestataire) {
      req.body.id_prestataire = userId;
    }

    next();
  } catch (error) {
    console.error('Erreur vérification prestataire:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la vérification' });
  }
};
