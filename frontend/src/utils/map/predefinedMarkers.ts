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
import { houseIcon, witchHouseIcon, sageIcon, trainingCampIcon, castleIcon, prestataireIcon } from './iconsMarkers';

const predefinedMarkers: { position: L.LatLngExpression; icon: L.DivIcon; popup: string; type: 'story' | 'prestataire' }[] = [
  {
    position: [1747, 5072] as L.LatLngExpression,
    icon: houseIcon,
    popup: 'House at 1747, 5072',
    type: 'story'
  },
  {
    position: [910, 4330] as L.LatLngExpression,
    icon: witchHouseIcon,
    popup: 'Witch House at 910, 4330',
    type: 'story'
  },
  {
    position: [1344, 3572] as L.LatLngExpression,
    icon: sageIcon,
    popup: 'The Great Sage at 1344, 3572',
    type: 'story'
  },
  {
    position: [1580, 4488] as L.LatLngExpression,
    icon: trainingCampIcon,
    popup: 'Training Camp at 1580, 4488',
    type: 'story'
  },
  {
    position: [2856, 3770] as L.LatLngExpression,
    icon: castleIcon,
    popup: 'Castle at 2856, 3770',
    type: 'story'
  },
  {
    position: [1958, 1899] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1958, 1899',
    type: 'prestataire'
  },
  {
    position: [1984, 1893] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1984, 1893',
    type: 'prestataire'
  },
  {
    position: [2064, 1733] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2064, 1733',
    type: 'prestataire'
  },
  {
    position: [2148, 1569] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2148, 1569',
    type: 'prestataire'
  },
  {
    position: [2254, 1897] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2254, 1897',
    type: 'prestataire'
  },
  {
    position: [2188, 2139] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2188, 2139',
    type: 'prestataire'
  },
  {
    position: [2006, 2383] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2006, 2383',
    type: 'prestataire'
  },
  {
    position: [2082, 2465] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2082, 2465',
    type: 'prestataire'
  },
  {
    position: [2236, 2491] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2236, 2491',
    type: 'prestataire'
  },
  {
    position: [2346, 2271] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2346, 2271',
    type: 'prestataire'
  },
  {
    position: [2142, 2949] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2142, 2949',
    type: 'prestataire'
  },
  {
    position: [1946, 3171] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1946, 3171',
    type: 'prestataire'
  },
  {
    position: [2398, 2599] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2398, 2599',
    type: 'prestataire'
  },
  {
    position: [2556, 2025] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2556, 2025',
    type: 'prestataire'
  },
  {
    position: [2616, 2273] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2616, 2273',
    type: 'prestataire'
  },
  {
    position: [2426, 1671] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2426, 1671',
    type: 'prestataire'
  },
  {
    position: [2324, 1517] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2324, 1517',
    type: 'prestataire'
  },
  {
    position: [2280, 1405] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2280, 1405',
    type: 'prestataire'
  },
  {
    position: [2226, 1295] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2226, 1295',
    type: 'prestataire'
  },
  {
    position: [2164, 1193] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2164, 1193',
    type: 'prestataire'
  },
  {
    position: [1802, 1897] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1802, 1897',
    type: 'prestataire'
  },
  {
    position: [1856, 1999] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1856, 1999',
    type: 'prestataire'
  },
  {
    position: [1914, 2113] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1914, 2113',
    type: 'prestataire'
  },
  {
    position: [1694, 2113] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1694, 2113',
    type: 'prestataire'
  },
  {
    position: [1756, 2219] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1756, 2219',
    type: 'prestataire'
  },
  {
    position: [1808, 2333] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1808, 2333',
    type: 'prestataire'
  },
  {
    position: [1170, 1973] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1170, 1973',
    type: 'prestataire'
  },
  {
    position: [1088, 1679] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1088, 1679',
    type: 'prestataire'
  },
  {
    position: [1282, 1625] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1282, 1625',
    type: 'prestataire'
  },
  {
    position: [1394, 2167] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1394, 2167',
    type: 'prestataire'
  },
  {
    position: [1086, 2329] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1086, 2329',
    type: 'prestataire'
  },
  {
    position: [1008, 2165] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1008, 2165',
    type: 'prestataire'
  },
  {
    position: [1008, 1841] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1008, 1841',
    type: 'prestataire'
  },
  {
    position: [1725, 3579] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1725, 3579',
    type: 'prestataire'
  },
  {
    position: [1834, 3359] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1834, 3359',
    type: 'prestataire'
  },
  {
    position: [2372, 3383] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2372, 3383',
    type: 'prestataire'
  },
  {
    position: [3028, 2737] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 3028, 2737',
    type: 'prestataire'
  },
  {
    position: [2561, 4659] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2561, 4659',
    type: 'prestataire'
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