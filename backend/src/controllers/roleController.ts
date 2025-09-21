import { Request, Response } from 'express';
import { databaseService } from '../services/databaseService.js';

/**
 * Controller to handle role-related operations.
 */
export const roleController = {
  /**
   * Get all roles from the database.
   * @param _req - Express request object
   * @param res - Express response object
   */
  async getAllRoles(_req: Request, res: Response): Promise<void> {
    try {
      // Query the database to get all roles
      const roles = await databaseService.query('SELECT * FROM roles');
      res.status(200).json(roles);
    } catch (error) {
      // Handle errors and send a 500 response
      res.status(500).json({
        message: 'Failed to retrieve roles',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};