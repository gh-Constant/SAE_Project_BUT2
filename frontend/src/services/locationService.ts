import { locationMockService } from './mock/locationMockService';
import { LocationMock } from '@/mocks/locations';
import L from 'leaflet';
import { getIcon } from '@/utils/map/iconsMarkers';
import { LocationType } from '@/mocks/locationTypes';
import i18n from '@/i18n';
import apiClient from './apiClient';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';

const locationServiceImpl = {
  getAllLocations: async (): Promise<LocationMock[]> => {
    try {
      const response = await apiClient.get('/locations');
      return response.data;
    } catch {
      throw new Error('Failed to fetch locations');
    }
  },

  getLocationById: async (id: number): Promise<LocationMock> => {
    try {
      const response = await apiClient.get(`/locations/${id}`);
      return response.data;
    } catch {
      throw new Error('Failed to fetch location');
    }
  },

  getLocationsByProviderId: async (providerId: number): Promise<LocationMock[]> => {
    // Note: In a real API, we might have a query param like ?provider_id=X or a dedicated endpoint
    // For now, sorting client-side or assuming an endpoint structure
    const allLocations = await locationServiceImpl.getAllLocations();
    return allLocations.filter(loc => loc.id_prestataire === providerId);
  },

  purchaseLocation: async (locationId: number, userId: number): Promise<LocationMock> => {
    try {
      const response = await apiClient.patch(`/locations/${locationId}`, {
        purchased: true,
        id_prestataire: userId
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to purchase location');
    }
  },

  addLocationsToMap: async (map: L.Map, markers: L.Marker[], userRole?: string, onMarkerClick?: (location: LocationMock) => void): Promise<void> => {
    let locations = await locationServiceImpl.getAllLocations();

    if (userRole === 'prestataire' || userRole === 'admin') {
      // Prestataire and Admin see all locations
    } else {
      // Other users see validated (APPROVED) locations
      locations = locations.filter(location =>
        location.id_location_type === LocationType.STORY_LOCATION_TYPE_ID ||
        location.id_location_type === LocationType.OTHER_LOCATION_TYPE_ID ||
        (location.purchased && location.id_prestataire && location.id_prestataire > 0)
      );
    }

    locations.forEach((location) => {
      const iconName = location.icon_name || 'default';

      let status: 'AVAILABLE' | 'PENDING' | 'APPROVED' = 'APPROVED';

      if (userRole === 'admin' && location.status === 'PENDING') {
        status = 'PENDING';
      } else if (!location.purchased && location.id_location_type !== LocationType.STORY_LOCATION_TYPE_ID) {
        status = 'AVAILABLE';
      }

      const icon = getIcon(iconName, status);

      // Ensure position is valid [lat, lng]
      if (!location.position || !Array.isArray(location.position) || location.position.length !== 2) {
        return;
      }

      const marker = L.marker(location.position as [number, number], { icon });

      if (iconName === 'toilet') {
        marker.bindPopup(i18n.global.t('map.toilet_popup'));
      } else if (onMarkerClick) {
        marker.on('click', () => {
          onMarkerClick(location);
        });
      } else {
        marker.bindPopup(`
          <strong>${location.name}</strong><br/>
          ${location.description}<br/>
          ${location.price ? `Price: ${location.price} gold` : ''}<br/>
          ${location.purchased ? ' Purchased' : ' Available'}
        `);
      }

      marker.addTo(map);
      markers.push(marker);
    });
  },

  updateLocation: async (location: LocationMock): Promise<LocationMock> => {
    try {
      const response = await apiClient.put(`/locations/${location.id}`, location);
      return response.data;
    } catch {
      throw new Error('Failed to update location');
    }
  },

  deleteLocation: async (locationId: number): Promise<void> => {
    try {
      await apiClient.delete(`/locations/${locationId}`);
    } catch {
      throw new Error('Failed to delete location');
    }
  },

  validatePurchase: async (locationId: number): Promise<LocationMock> => {
    const response = await apiClient.post(`/locations/${locationId}/validate`);
    return response.data;
  },

  rejectPurchase: async (locationId: number): Promise<LocationMock> => {
    const response = await apiClient.post(`/locations/${locationId}/reject`);
    return response.data;
  },

  removeOwner: async (locationId: number): Promise<LocationMock> => {
    const response = await apiClient.delete(`/locations/${locationId}/owner`);
    return response.data;
  },

  updateOwner: async (locationId: number, userId: number): Promise<LocationMock> => {
    const response = await apiClient.put(`/locations/${locationId}/owner`, { userId });
    return response.data;
  }
};

export const locationService = isMockEnabled ? locationMockService : locationServiceImpl;