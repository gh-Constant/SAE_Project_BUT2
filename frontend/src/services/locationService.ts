import { locationMockService } from './mock/locationMockService';
import { LocationMock } from '@/mocks/locations';
import L from 'leaflet';
import { iconMarkers, defaultIcon } from '@/utils/map/iconsMarkers';
import { LocationType } from '@/mocks/locationTypes';

const isMockEnabled = import.meta.env.VITE_NO_BACKEND === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const locationServiceImpl = {
  getAllLocations: async (): Promise<LocationMock[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/locations`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    return await response.json();
  },

  getLocationById: async (id: number): Promise<LocationMock> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/locations/${id}`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch location');
    }
    return await response.json();
  },

  purchaseLocation: async (locationId: number, userId: number): Promise<LocationMock> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/locations/${locationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        purchased: true,
        id_prestataire: userId
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to purchase location');
    }
    
    return await response.json();
  },

  addLocationsToMap: async (map: L.Map, markers: L.Marker[], userRole?: string, onMarkerClick?: (location: LocationMock) => void): Promise<void> => {
    let locations = await locationServiceImpl.getAllLocations();

    if (userRole === 'prestataire') {
      // Prestataire sees all locations
    } else {
      // Other users see story locations and purchased prestataire locations
      locations = locations.filter(location =>
        location.id_location_type === LocationType.STORY_LOCATION_TYPE_ID || (location.id_location_type === LocationType.PRESTATAIRE_LOCATION_TYPE_ID && location.purchased)
      );
    }

    locations.forEach((location) => {
      const iconName = location.icon_name || 'default';
      const icon = iconMarkers[iconName] || defaultIcon;

      // Ensure position is valid [lat, lng]
      if (!location.position || !Array.isArray(location.position) || location.position.length !== 2) {
        return;
      }

      const marker = L.marker(location.position as [number, number], { icon });

      if (onMarkerClick) {
        marker.on('click', () => {
          onMarkerClick(location);
        });
      } else {
        marker.bindPopup(`
          <strong>${location.name}</strong><br/>
          ${location.description}<br/>
          ${location.price ? `Price: ${location.price} gold` : ''}<br/>
          ${location.purchased ? '🟢 Purchased' : '🔴 Available'}
        `);
      }

      marker.addTo(map);
      markers.push(marker);
    });
  },

  updateLocation: async (location: LocationMock): Promise<LocationMock> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/locations/${location.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(location)
    });
    if (!response.ok) throw new Error('Failed to update location');
    return await response.json();
  },

  deleteLocation: async (locationId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/locations/${locationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete location');
  },

  validatePurchase: async (locationId: number): Promise<LocationMock> => {
    // Mock implementation call (will be handled by mockService if enabled)
    // In real app, this would be a PATCH to /locations/{id}/validate
     const response = await fetch(`${API_BASE_URL}/api/v1/locations/${locationId}/validate`, {
        method: 'POST',
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return response.json();
  },

  rejectPurchase: async (locationId: number): Promise<LocationMock> => {
      const response = await fetch(`${API_BASE_URL}/api/v1/locations/${locationId}/reject`, {
        method: 'POST',
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return response.json();
  },

  removeOwner: async (locationId: number): Promise<LocationMock> => {
       const response = await fetch(`${API_BASE_URL}/api/v1/locations/${locationId}/owner`, {
        method: 'DELETE',
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return response.json();
  },

  updateOwner: async (locationId: number, userId: number): Promise<LocationMock> => {
       const response = await fetch(`${API_BASE_URL}/api/v1/locations/${locationId}/owner`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
             'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ userId })
    });
    return response.json();
  }
};

export const locationService = isMockEnabled ? locationMockService : locationServiceImpl;