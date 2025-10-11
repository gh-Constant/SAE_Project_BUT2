/**
 * @file mock/locationMockService.ts
 * @description
 * Service de gestion des locations en mode mock pour le développement.
 * Simule les opérations de base de données avec des données fictives.

 * @utilité
 * - Permet de tester l'interface utilisateur sans backend réel
 * - Fournit des données de test cohérentes pour les locations
 * - Simule le comportement des marqueurs sur la carte
 * - Gère l'affichage conditionnel selon le rôle de l'utilisateur
 * - Supporte l'intégration avec le système de widgets

 * @exports
 * - locationMockService: Objet contenant les méthodes de service

 * @remarques
 * - Les données sont statiques et définies dans les fichiers mock
 * - L'intégration avec les widgets se fait via callback optionnel
 * - Supporte la différenciation entre utilisateurs prestataires et autres
 */

import L from 'leaflet';
import { locationsMock, LocationMock } from '@/mocks/locations';
import { iconMarkers } from '@/utils/map/iconsMarkers';

export const locationMockService = {
  /**
   * Récupère toutes les locations mock
   * @returns Promise résolue avec la liste complète des locations
   */
  getAllLocations(): Promise<LocationMock[]> {
    return new Promise((resolve) => {
      resolve([...locationsMock]);
    });
  },

  /**
   * Ajoute tous les marqueurs de location à la carte avec gestion des widgets
   * @param map Instance de la carte Leaflet
   * @param markers Tableau pour stocker les références des marqueurs
   * @param userRole Rôle de l'utilisateur ('prestataire' ou autre)
   * @param onMarkerClick Callback optionnel appelé lors du clic sur un marqueur
   */
  async addLocationsToMap(map: L.Map, markers: L.Marker[], userRole?: string, onMarkerClick?: (location: LocationMock) => void): Promise<void> {
    let locations = await this.getAllLocations();

    if (userRole === 'prestataire') {
      // Prestataire sees all locations
    } else {
      // Other users see story locations and purchased prestataire locations
      locations = locations.filter(location =>
        location.type === 'story' || (location.type === 'prestataire' && location.purchased)
      );
    }

    locations.forEach((location) => {
      const icon = iconMarkers[location.iconName] || iconMarkers['default'];

      const marker = L.marker(location.position, { icon });

      // Add click handler to open widget
      if (onMarkerClick) {
        marker.on('click', () => {
          onMarkerClick(location);
        });
      } else {
        // Fallback to popup if no click handler provided
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
  }
};