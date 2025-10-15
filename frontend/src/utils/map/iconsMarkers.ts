/**
 * @file iconMarkers.ts
 *
 * @description
 * Contient toutes les icônes personnalisées utilisées sur la carte Leaflet.
 * Chaque icône est créée avec L.divIcon() et peut inclure du HTML/CSS pour personnaliser son apparence.
 *
 * @utilité
 * - Centraliser la définition des icônes pour les réutiliser facilement dans toute l'application.
 * - Faciliter la maintenance et la modification du style des marqueurs.
 * - Séparer la logique des icônes de la logique de la carte pour garder le code propre et organisé.
 */

import L from 'leaflet';

export const ticketOfficeIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid black; background: white; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><i class="fa-solid fa-ticket" style="color: #007bff;"></i></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid white; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'ticket-office-marker',
  iconSize: [24, 26],
  iconAnchor: [10, 26]
});

export const witchHouseIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid #4a0e4e; background: #2d1b2d; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><i class="fas fa-hat-wizard" style="color: #9c27b0;"></i></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid #2d1b2d; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'witch-house-marker',
  iconSize: [24, 26],
  iconAnchor: [10, 26]
});

export const sageIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid #1e3a8a; background: #f0f9ff; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><i class="fas fa-graduation-cap" style="color: #2563eb;"></i></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid #f0f9ff; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'sage-marker',
  iconSize: [24, 26],
  iconAnchor: [10, 26]
});

export const informationCenterIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid #7c2d12; background: #f3f1e8ff; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><i class="fa-solid fa-circle-info" style="color: #2563eb;"></i></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid #fef3c7; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'information-center-marker',
  iconSize: [24, 26],
  iconAnchor: [10, 26]
});

export const trainingCampIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid #991b1b; background: #fee2e2; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><img src="/images/icons/sword_red.png" alt="Sword icon" style="width: 14px; height: 14px; display: block; margin: 3px;" /></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid #fee2e2; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'training-camp-marker',
  iconSize: [24, 26],
  iconAnchor: [10, 26]
});

export const archeryRangeIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid #991b1b; background: #fee2e2; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><img src="/images/icons/bow_red.png" alt="Bow icon" style="width: 14px; height: 14px; display: block; margin: 3px;" /></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid #fee2e2; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'archery-range-marker',
  iconSize: [24, 26],
  iconAnchor: [10, 26]
});

export const castleIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid #374151; background: #f9fafb; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><i class="fas fa-chess-rook" style="color: #6b7280;"></i></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid #f9fafb; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'castle-marker',
  iconSize: [24, 26],
  iconAnchor: [10, 26]
});

export const villageFoolIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid #4a0e4e; background: #2d1b2d; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><img src="/images/icons/fool_purple.png" alt="Fool icon" style="width: 15px; height: 15px; display: block; margin: 3px;" /></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid #2d1b2d; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'village-fool-marker',
  iconSize: [24, 26],
  iconAnchor: [10, 26]
});

export const childIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid #1e3a8a; background: #f0f9ff; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><img src="/images/icons/little-boy_blue.png" alt="Little boy icon" style="width: 18px; height: 16px; display: block; margin: 1.5px;" /></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid #f0f9ff; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'village-fool-marker',
  iconSize: [24, 26],
  iconAnchor: [10, 26]
});

export const farmerIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid #9CA001; background: #f0f9ff; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><img src="/images/icons/farmer_yellow.png" alt="Farmer icon" style="width: 17px; height: 14px; display: block; margin: 2px;" /></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid #f0f9ff; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'farmer-marker',
  iconSize: [24, 26],
  iconAnchor: [10, 26]
});

export const lumberjackIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid #907800ff; background: #f0f9ff; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><img src="/images/icons/axe_brown.png" alt="Axe icon" style="width: 16px; height: 15px; display: block; margin: 2.5px;" /></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid #f0f9ff; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'lumberjack-marker',
  iconSize: [24, 26],
  iconAnchor: [10, 26]
});

export const prestataireIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid #059669; background: #ecfdf5; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><i class="fas fa-store" style="color: #047857;"></i></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid #ecfdf5; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'prestataire-marker',
  iconSize: [24, 26],
  iconAnchor: [10, 26]
});

export const clickIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid black; background: white; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><i class="fas fa-location-dot" style="color: #dc3545;"></i></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid white; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'click-marker',
  iconSize: [24, 26],
  iconAnchor: [10, 26]
});

export const toiletIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid #059669; background: #ecfdf5; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><i class="fa-solid fa-restroom" style="color: #047857;"></i></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid #ecfdf5; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'toilet-marker',
  iconSize: [24, 26],
  iconAnchor: [10, 26]
});

// Ajouter une icône par défaut
export const defaultIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid #666; background: white; border-radius: 3px; padding: 2px 4px; margin-bottom: 6px;"><i class="fas fa-map-marker-alt" style="color: #666;"></i></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid white; position: absolute; bottom: -6px; left: 6px;"></div>',
  className: 'default-marker',
  iconSize: [24, 26],
  iconAnchor: [10, 26]
});

export const iconMarkers: Record<string, L.DivIcon> = {
  ticketOffice: ticketOfficeIcon,
  witchHouse: witchHouseIcon,
  sage: sageIcon,
  informationCenter: informationCenterIcon,
  trainingCamp: trainingCampIcon,
  archeryRange: archeryRangeIcon,
  castle: castleIcon,
  child: childIcon,
  villageFool: villageFoolIcon,
  farmer: farmerIcon,
  lumberjack: lumberjackIcon,
  prestataire: prestataireIcon,
  toilet: toiletIcon,
  default: defaultIcon, // Ajouter l'icône par défaut au Record
};