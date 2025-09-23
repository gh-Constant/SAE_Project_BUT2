import { Request, Response } from 'express';
import { login, register } from '../services/authService.js';

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  },

  async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password, role } = req.body;
      const user = await register(firstName, lastName, email, password, role);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
};