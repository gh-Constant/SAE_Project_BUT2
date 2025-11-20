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
import { LOCATIONS, LocationMock } from '@/mocks/locations';
import { USERS } from '@/mocks/users';
import { iconMarkers, defaultIcon } from '@/utils/map/iconsMarkers';
import { LocationType } from '@/mocks/locationTypes';

export const locationMockService = {
  /**
   * Récupère toutes les locations mock
   * @returns Promise résolue avec la liste complète des locations
   */
  getAllLocations(): Promise<LocationMock[]> {
    return new Promise((resolve) => {
      resolve([...LOCATIONS]);
    });
  },

  /**
   * Récupère une location par son ID
   * @param id ID de la location à récupérer
   * @returns Promise résolue avec la location trouvée
   */
  getLocationById(id: number): Promise<LocationMock> {
    return new Promise((resolve, reject) => {
      const location = LOCATIONS.find(loc => loc.id === id);
      if (location) {
        resolve({ ...location });
      } else {
        reject(new Error('Location not found'));
      }
    });
  },

  /**
   * Achète une location pour un utilisateur
   * @param locationId ID de la location à acheter
   * @param userId ID de l'utilisateur qui achète
   * @returns Promise résolue avec la location mise à jour
   */
  purchaseLocation(locationId: number, userId: number): Promise<LocationMock> {
    return new Promise((resolve, reject) => {
      const location = LOCATIONS.find(loc => loc.id === locationId);
      if (!location) {
        reject(new Error('Location not found'));
        return;
      }

      // Find user details
      console.log('Looking for user with ID:', userId);
      console.log('Available users:', USERS.map(u => ({ id: u.id, name: `${u.firstname} ${u.lastname}` })));
      const user = USERS.find(u => u.id === userId);
      if (!user) {
        console.error('User not found for ID:', userId);
        reject(new Error('User not found'));
        return;
      }

      // Update location with purchase info
      location.purchased = true;
      location.id_prestataire = userId;
      location.prestataire = {
        id_user: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        avatar_url: user.avatar_url,
        avatar_type: user.avatar_type,
      };

      resolve({ ...location });
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
        location.id_location_type === LocationType.STORY_LOCATION_TYPE_ID || (location.id_location_type === LocationType.PRESTATAIRE_LOCATION_TYPE_ID && location.purchased)
      );
    }

    locations.forEach((location) => {
      // Utiliser l'icône spécifiée ou l'icône par défaut si elle n'existe pas
      const iconName = location.icon_name || 'default';
      const icon = iconMarkers[iconName] || defaultIcon;

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