
import { Request, Response } from 'express';
import { userService } from '../services/userService.js';

export const userController = {
  /**
   * Récupère la liste de tous les utilisateurs
   */
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  },

  /**
   * Vérifie un utilisateur
   */
  verifyUser: async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      await userService.verifyUser(userId);
      res.json({ message: 'User verified successfully' });
    } catch (error) {
      console.error('Error verifying user:', error);
      res.status(500).json({ error: 'Failed to verify user' });
    }
  },

  /**
   * Supprime un utilisateur
   */
  deleteUser: async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      await userService.deleteUser(userId);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
};
