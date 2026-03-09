
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Interface pour les données de mise à jour d'une location
interface LocationUpdateData {
  name?: string;
  description?: string;
  price?: number;
  purchased?: boolean;
  id_prestataire?: number | null;
}

export const getAllLocations = async (req: Request, res: Response) => {
  try {
    const locations = await prisma.location.findMany({
      include: {
        location_type: true,
        prestataire: {
          select: {
            user: {
              select: {
                id_user: true,
                firstname: true,
                lastname: true,
                avatar_url: true,
                avatar_type: true,
              }
            }
          }
        }
      }
    });

    // Transform data to match frontend expectations if needed
    // Frontend expects: id, name, description, static_code, price, purchased, position, icon_name, banner_image, id_prestataire, id_location_type, prestataire
    const mappedLocations = locations.map((loc: any) => ({
      id: loc.id_location,
      name: loc.name,
      description: loc.description,
      static_code: loc.static_code,
      price: Number(loc.price),
      purchased: loc.purchased,
      position: loc.position, // Assuming it's stored as [lat, lng] or similar JSON
      icon_name: loc.icon_name,
      banner_image: loc.banner_name, // Note: DB has banner_name, frontend expects banner_image
      id_prestataire: loc.id_prestataire,
      id_location_type: loc.id_location_type,
      prestataire: loc.prestataire?.user ? {
        id_user: loc.prestataire.user.id_user,
        firstname: loc.prestataire.user.firstname,
        lastname: loc.prestataire.user.lastname,
        avatar_url: loc.prestataire.user.avatar_url,
        avatar_type: loc.prestataire.user.avatar_type,
      } : null
    }));

    res.json(mappedLocations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

export const getLocationById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const location = await prisma.location.findUnique({
      where: { id_location: Number(id) },
      include: {
        location_type: true,
        prestataire: {
          select: {
            user: {
              select: {
                id_user: true,
                firstname: true,
                lastname: true,
                avatar_url: true,
                avatar_type: true,
              }
            }
          }
        }
      }
    });

    if (!location) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    const mappedLocation = {
      id: location.id_location,
      name: location.name,
      description: location.description,
      static_code: location.static_code,
      price: Number(location.price),
      purchased: location.purchased,
      position: location.position,
      icon_name: location.icon_name,
      banner_image: location.banner_name,
      id_prestataire: location.id_prestataire,
      id_location_type: location.id_location_type,
      prestataire: location.prestataire?.user ? {
        id_user: location.prestataire.user.id_user,
        firstname: location.prestataire.user.firstname,
        lastname: location.prestataire.user.lastname,
        avatar_url: location.prestataire.user.avatar_url,
        avatar_type: location.prestataire.user.avatar_type,
      } : null
    };

    res.json(mappedLocation);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
};

export const updateLocation = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, description, price, purchased, id_prestataire } = req.body;

  try {
    // Check if location exists
    const existingLocation = await prisma.location.findUnique({
      where: { id_location: Number(id) }
    });

    if (!existingLocation) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    // Build update data object (only include fields that are provided)
    const updateData: LocationUpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (purchased !== undefined) updateData.purchased = purchased;
    if (id_prestataire !== undefined) updateData.id_prestataire = id_prestataire;

    // Update the location
    const updatedLocation = await prisma.location.update({
      where: { id_location: Number(id) },
      data: updateData,
      include: {
        location_type: true,
        prestataire: {
          select: {
            user: {
              select: {
                id_user: true,
                firstname: true,
                lastname: true,
                avatar_url: true,
                avatar_type: true,
              }
            }
          }
        }
      }
    });

    // Map to frontend format
    const mappedLocation = {
      id: updatedLocation.id_location,
      name: updatedLocation.name,
      description: updatedLocation.description,
      static_code: updatedLocation.static_code,
      price: Number(updatedLocation.price),
      purchased: updatedLocation.purchased,
      position: updatedLocation.position,
      icon_name: updatedLocation.icon_name,
      banner_image: updatedLocation.banner_name,
      id_prestataire: updatedLocation.id_prestataire,
      id_location_type: updatedLocation.id_location_type,
      prestataire: updatedLocation.prestataire?.user ? {
        id_user: updatedLocation.prestataire.user.id_user,
        firstname: updatedLocation.prestataire.user.firstname,
        lastname: updatedLocation.prestataire.user.lastname,
        avatar_url: updatedLocation.prestataire.user.avatar_url,
        avatar_type: updatedLocation.prestataire.user.avatar_type,
      } : null
    };

    res.json(mappedLocation);
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
};

export const purchaseLocation = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  try {
    // Check if location exists and is available
    const location = await prisma.location.findUnique({
      where: { id_location: Number(id) }
    });

    if (!location) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    if (location.purchased) {
      res.status(400).json({ error: 'Location already purchased' });
      return;
    }

    // Check if user has enough gold
    const user = await prisma.user.findUnique({
      where: { id_user: Number(userId) },
      select: { gold: true, role: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.role !== 'prestataire') {
      res.status(403).json({ error: 'Only prestataires can purchase locations' });
      return;
    }

    if (user.gold < Number(location.price)) {
      res.status(400).json({ error: 'Not enough gold' });
      return;
    }

    // Perform purchase in transaction
    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id_user: Number(userId) },
        data: { gold: user.gold - Number(location.price) }
      });

      const updatedLocation = await tx.location.update({
        where: { id_location: Number(id) },
        data: { purchased: true, id_prestataire: Number(userId) },
        include: {
          location_type: true,
          prestataire: {
            select: {
              user: {
                select: { id_user: true, firstname: true, lastname: true, avatar_url: true, avatar_type: true }
              }
            }
          }
        }
      });

      return updatedLocation;
    });

    res.json({
      ...result,
      prestataire: result.prestataire?.user ?? null
    });
  } catch (error) {
    console.error('Error purchasing location:', error);
    res.status(500).json({ error: 'Failed to purchase location' });
  }
};

