
import { Request, Response } from 'express';
import prisma from '../prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

// Interface pour les données de mise à jour d'une location
interface LocationUpdateData {
  name?: string;
  description?: string;
  price?: number;
  has_water_access?: boolean;
  has_electricity?: boolean;
  has_toilets?: boolean;
  is_accessible_pmr?: boolean;
  purchased?: boolean;
  id_prestataire?: number | null;
  id_location_type?: number;
}

type LocationStatus = 'AVAILABLE' | 'PENDING' | 'APPROVED';

const PRESTATAIRE_LOCATION_TYPE_ID = 1;

const getLocationStatus = (loc: {
  id_location_type: number;
  id_prestataire: number | null;
  purchased: boolean;
}): LocationStatus => {
  if (loc.id_location_type !== PRESTATAIRE_LOCATION_TYPE_ID) {
    return 'APPROVED';
  }
  if (!loc.id_prestataire) {
    return 'AVAILABLE';
  }
  return loc.purchased ? 'APPROVED' : 'PENDING';
};

type LocationWithRelations = {
  id_location: number;
  name: string;
  description: string | null;
  static_code: string | null;
  price: unknown;
  has_water_access?: boolean;
  has_electricity?: boolean;
  has_toilets?: boolean;
  is_accessible_pmr?: boolean;
  purchased: boolean;
  position: unknown;
  icon_name: string | null;
  banner_name: string | null;
  id_prestataire: number | null;
  id_location_type: number;
  prestataire?: {
    user?: {
      id_user: number;
      firstname: string;
      lastname: string;
      avatar_url: string | null;
      avatar_type: string | null;
    } | null;
  } | null;
};

const mapLocationForFrontend = (loc: LocationWithRelations) => ({
  id: loc.id_location,
  name: loc.name,
  description: loc.description,
  static_code: loc.static_code,
  price: Number(loc.price),
  has_water_access: Boolean(loc.has_water_access),
  has_electricity: Boolean(loc.has_electricity),
  has_toilets: Boolean(loc.has_toilets),
  is_accessible_pmr: Boolean(loc.is_accessible_pmr),
  purchased: loc.purchased,
  status: getLocationStatus(loc),
  position: loc.position,
  icon_name: loc.icon_name,
  banner_image: loc.banner_name,
  id_prestataire: loc.id_prestataire,
  id_location_type: loc.id_location_type,
  prestataire: loc.prestataire?.user
    ? {
      id_user: loc.prestataire.user.id_user,
      firstname: loc.prestataire.user.firstname,
      lastname: loc.prestataire.user.lastname,
      avatar_url: loc.prestataire.user.avatar_url,
      avatar_type: loc.prestataire.user.avatar_type,
    }
    : null
});

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

    const mappedLocations = locations.map((loc) => mapLocationForFrontend(loc));

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

    res.json(mapLocationForFrontend(location));
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
};

export const updateLocation = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    has_water_access,
    has_electricity,
    has_toilets,
    is_accessible_pmr,
    purchased,
    id_prestataire,
    id_location_type,
  } = req.body;

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
    if (has_water_access !== undefined) updateData.has_water_access = has_water_access;
    if (has_electricity !== undefined) updateData.has_electricity = has_electricity;
    if (has_toilets !== undefined) updateData.has_toilets = has_toilets;
    if (is_accessible_pmr !== undefined) updateData.is_accessible_pmr = is_accessible_pmr;
    if (purchased !== undefined) updateData.purchased = purchased;
    if (id_prestataire !== undefined) updateData.id_prestataire = id_prestataire;
    if (id_location_type !== undefined) updateData.id_location_type = id_location_type;

    // Keep status logic coherent for provider locations:
    // owner with purchased=false => pending, owner with purchased=true => approved, no owner => available
    if (id_prestataire !== undefined && Number(id_location_type ?? existingLocation.id_location_type) === PRESTATAIRE_LOCATION_TYPE_ID) {
      if (!id_prestataire) {
        updateData.id_prestataire = null;
        updateData.purchased = false;
      } else if (purchased === undefined) {
        updateData.purchased = true;
      }
    }

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

    res.json(mapLocationForFrontend(updatedLocation));
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
};

export const purchaseLocation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.id ?? Number(req.body.userId);

  if (!userId) {
    res.status(401).json({ error: 'Authentication required' });
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

    if (location.id_location_type !== PRESTATAIRE_LOCATION_TYPE_ID) {
      res.status(400).json({ error: 'This location is not purchasable by providers' });
      return;
    }

    if (location.id_prestataire) {
      res.status(400).json({ error: 'Location already requested or purchased' });
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
        data: { purchased: false, id_prestataire: Number(userId) },
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

    res.json(mapLocationForFrontend(result));
  } catch (error) {
    console.error('Error purchasing location:', error);
    res.status(500).json({ error: 'Failed to purchase location' });
  }
};

export const validatePurchase = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const locationId = Number(req.params.id);
  if (Number.isNaN(locationId)) {
    res.status(400).json({ error: 'Invalid location ID' });
    return;
  }

  try {
    const location = await prisma.location.findUnique({
      where: { id_location: locationId }
    });

    if (!location) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    if (!location.id_prestataire) {
      res.status(400).json({ error: 'No pending purchase for this location' });
      return;
    }

    const updated = await prisma.location.update({
      where: { id_location: locationId },
      data: { purchased: true },
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

    res.json(mapLocationForFrontend(updated));
  } catch (error) {
    console.error('Error validating purchase:', error);
    res.status(500).json({ error: 'Failed to validate purchase' });
  }
};

export const rejectPurchase = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const locationId = Number(req.params.id);
  if (Number.isNaN(locationId)) {
    res.status(400).json({ error: 'Invalid location ID' });
    return;
  }

  try {
    const location = await prisma.location.findUnique({
      where: { id_location: locationId }
    });

    if (!location) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    if (!location.id_prestataire) {
      res.status(400).json({ error: 'No pending purchase for this location' });
      return;
    }

    const updated = await prisma.location.update({
      where: { id_location: locationId },
      data: {
        purchased: false,
        id_prestataire: null
      },
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

    res.json(mapLocationForFrontend(updated));
  } catch (error) {
    console.error('Error rejecting purchase:', error);
    res.status(500).json({ error: 'Failed to reject purchase' });
  }
};

export const removeOwner = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  return rejectPurchase(req, res);
};

export const updateOwner = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const locationId = Number(req.params.id);
  const userId = Number(req.body.userId);

  if (Number.isNaN(locationId) || Number.isNaN(userId)) {
    res.status(400).json({ error: 'Invalid location ID or user ID' });
    return;
  }

  try {
    const [location, user] = await Promise.all([
      prisma.location.findUnique({ where: { id_location: locationId } }),
      prisma.user.findUnique({ where: { id_user: userId }, select: { id_user: true, role: true } })
    ]);

    if (!location) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    if (!user || user.role !== 'prestataire') {
      res.status(400).json({ error: 'Owner must be an existing prestataire' });
      return;
    }

    const updated = await prisma.location.update({
      where: { id_location: locationId },
      data: {
        id_prestataire: userId,
        purchased: true
      },
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

    res.json(mapLocationForFrontend(updated));
  } catch (error) {
    console.error('Error updating location owner:', error);
    res.status(500).json({ error: 'Failed to update owner' });
  }
};

export const deleteLocation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const locationId = Number(req.params.id);
  if (Number.isNaN(locationId)) {
    res.status(400).json({ error: 'Invalid location ID' });
    return;
  }

  try {
    const location = await prisma.location.findUnique({
      where: { id_location: locationId }
    });

    if (!location) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }

    await prisma.location.update({
      where: { id_location: locationId },
      data: {
        purchased: false,
        id_prestataire: null
      }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting location owner assignment:', error);
    res.status(500).json({ error: 'Failed to delete location' });
  }
};

