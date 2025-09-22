/**
 * @file predefinedMarkers.ts
 * @description
 * Contient les marqueurs prédéfinis à ajouter sur la carte Leaflet.
 * Chaque marqueur a une position, une icône personnalisée et un popup associé.
 *
 * @utilité
 * - Centraliser la définition des marqueurs fixes pour les réutiliser facilement dans toute l'application.
 * - Faciliter la gestion et la maintenance des marqueurs prédéfinis.
 * - Séparer les marqueurs prédéfinis de la logique de la carte principale pour garder le code propre et organisé.
 *
 * @exports
 * - addPredefinedMarkers(map: L.Map, markers: L.Marker[]): Fonction pour ajouter tous les marqueurs prédéfinis à une carte et les stocker dans un tableau.
 */

import L from 'leaflet';
import { houseIcon } from './iconsMarkers';

const predefinedMarkers = [
  {
    position: [1747, 5072] as L.LatLngExpression,
    icon: houseIcon,
    popup: 'House at 1747, 5072'
  }
];

export function addPredefinedMarkers(map: L.Map, markers: L.Marker[]) {
  predefinedMarkers.forEach(markerData => {
    const marker = L.marker(markerData.position, { icon: markerData.icon })
      .addTo(map)
      .bindPopup(markerData.popup);
    markers.push(marker);
  });
}