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

export const houseIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid black; background: white; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><i class="fas fa-house" style="color: #007bff;"></i></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid white; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'house-marker',
  iconSize: [20, 26],
  iconAnchor: [10, 26]
});

export const witchHouseIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid #4a0e4e; background: #2d1b2d; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><i class="fas fa-hat-wizard" style="color: #9c27b0;"></i></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid #2d1b2d; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'witch-house-marker',
  iconSize: [20, 26],
  iconAnchor: [10, 26]
});

export const sageIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid #1e3a8a; background: #f0f9ff; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><i class="fas fa-graduation-cap" style="color: #2563eb;"></i></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid #f0f9ff; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'sage-marker',
  iconSize: [20, 26],
  iconAnchor: [10, 26]
});

export const trainingCampIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid #7c2d12; background: #fef3c7; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><i class="fas fa-flag" style="color: #dc2626;"></i></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid #fef3c7; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'training-camp-marker',
  iconSize: [20, 26],
  iconAnchor: [10, 26]
});

export const castleIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid #374151; background: #f9fafb; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><i class="fas fa-chess-rook" style="color: #6b7280;"></i></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid #f9fafb; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'castle-marker',
  iconSize: [20, 26],
  iconAnchor: [10, 26]
});

export const clickIcon = L.divIcon({
  html: '<div style="position: relative; font-size: 14px; border: 1px solid black; background: white; border-radius: 3px; padding: 1px; margin-bottom: 6px;"><i class="fas fa-location-dot" style="color: #dc3545;"></i></div><div style="width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; border-top: 6px solid white; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);"></div>',
  className: 'click-marker',
  iconSize: [20, 26],
  iconAnchor: [10, 26]
});