/**
 * @file mock/locationMockService.ts
 * @description
 * Service de gestion des locations en mode mock.
 * Simule les opérations de base de données avec des données fictives.
 */

import L from 'leaflet';
import { locationsMock, LocationMock } from '@/mocks/locations';
import { iconMarkers, defaultIcon } from '@/utils/map/iconsMarkers';

export const locationMockService = {
  // Récupère toutes les locations
  getAllLocations(): Promise<LocationMock[]> {
    return new Promise((resolve) => {
      resolve([...locationsMock]);
    });
  },

  // Ajoute tous les marqueurs de location à la carte
  async addLocationsToMap(map: L.Map, markers: L.Marker[]): Promise<void> {
    const locations = await this.getAllLocations();
    locations.forEach((location) => {
      // Utiliser l'icône spécifiée ou l'icône par défaut si elle n'existe pas
      const icon = iconMarkers[location.iconName] || defaultIcon;

      const marker = L.marker(location.position, { icon }).bindPopup(`
        <strong>${location.name}</strong><br/>
        ${location.description}<br/>
        ${location.price ? `Price: ${location.price} gold` : ''}<br/>
        ${location.purchased ? '🟢 Purchased' : '🔴 Available'}
      `);

      marker.addTo(map);
      markers.push(marker);
    });
  }
};