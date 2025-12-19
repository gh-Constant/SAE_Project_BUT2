import { Request, Response } from 'express';
import * as questService from '../services/questService.js';

export const getStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await questService.getQuestStatistics();
    return res.json(stats);
  } catch (error) {
    console.error('Failed to get quest statistics:', error);
    return res.status(500).json({ error: 'Failed to fetch quest statistics' });
  }
};

export const createQuest = async (req: Request, res: Response) => {
  try {
    const { title, description, xp_reward, id_location } = req.body;
    // Assuming location ownership check is done in middleware or here
    // For now, relying on basic validaton
    const quest = await questService.createQuest({ title, description, xp_reward, id_location });
    return res.status(201).json(quest);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create quest' });
  }
};

export const getQuestsByLocation = async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.params.locationId);
    const quests = await questService.getQuestsByLocation(locationId);
    return res.json(quests);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch quests' });
  }
};

export const getUserQuests = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - Assuming auth middleware adds user to req
    const userId = req.user?.id; 
    if (!userId) {
       return res.status(401).json({ error: 'Unauthorized' });
    }
    const quests = await questService.getUserQuests(userId);
    return res.json(quests);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch user quests' });
  }
};

export const acceptQuest = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user?.id;
    const questId = parseInt(req.params.questId);
    
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const result = await questService.acceptQuest(userId, questId);
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to accept quest' });
  }
};

export const completeQuest = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user?.id;
    const questId = parseInt(req.params.questId);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // DEBUG CHECK
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Not allowed in production' });
    }

    const result = await questService.completeQuest(userId, questId);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to complete quest' });
  }
};

export const cancelQuest = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user?.id;
    const questId = parseInt(req.params.questId);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    await questService.cancelQuest(userId, questId);
    return res.json({ success: true });
  } catch (error) {
    console.error('Failed to cancel quest:', error);
    return res.status(500).json({ error: 'Failed to cancel quest' });
  }
};

export const getAllQuests = async (req: Request, res: Response) => {
  try {
    const quests = await questService.getAllQuests();
    return res.json(quests);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch all quests' });
  }
};

export const updateQuest = async (req: Request, res: Response) => {
  try {
    const questId = parseInt(req.params.questId);
    const { title, description, xp_reward } = req.body;
    
    const quest = await questService.updateQuest(questId, { title, description, xp_reward });
    return res.json(quest);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update quest' });
  }
};

export const deleteQuest = async (req: Request, res: Response) => {
  try {
    const questId = parseInt(req.params.questId);
    await questService.deleteQuest(questId);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete quest' });
  }
};
