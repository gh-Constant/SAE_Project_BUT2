/**
 * @file iconMarkers.ts
 *
 * @description
 * Contient toutes les icônes personnalisées utilisées sur la carte Leaflet.
 * Chaque icône est créée avec L.divIcon() et utilise Tailwind CSS pour le style.
 *
 * @utilité
 * - Centraliser la définition des icônes pour les réutiliser facilement dans toute l'application.
 * - Faciliter la maintenance et la modification du style des marqueurs.
 * - Séparer la logique des icônes de la logique de la carte pour garder le code propre et organisé.
 */

import L from 'leaflet';

/**
 * Helper function to create a medieval-themed marker using Tailwind CSS.
 *
 * @param content - The HTML content for the icon (e.g., <i class="..."></i> or <img ... />).
 * @param borderColor - The Tailwind class for the border color (default: border-dark-wood).
 * @param bgColor - The Tailwind class for the background color (default: bg-parchment).
 * @returns L.DivIcon
 */
const createMedievalMarker = (content: string, borderColor: string = 'border-dark-wood', bgColor: string = 'bg-parchment') => {
  return L.divIcon({
    html: `
      <div class="relative flex flex-col items-center justify-center filter drop-shadow-md hover:scale-110 transition-transform duration-200 group">
        <div class="w-8 h-8 ${bgColor} border-2 ${borderColor} rounded-full flex items-center justify-center z-10 shadow-sm overflow-hidden">
          ${content}
        </div>
        <div class="w-3 h-3 ${bgColor} border-r-2 border-b-2 ${borderColor} transform rotate-45 -mt-2 z-0"></div>
      </div>
    `,
    className: '!bg-transparent !border-none', // Override Leaflet defaults
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42]
  });
};

// --- Icons Definitions ---

export const ticketOfficeIcon = createMedievalMarker(
  '<i class="fa-solid fa-ticket text-blue-600 text-sm"></i>',
  'border-blue-900',
  'bg-blue-50'
);

export const witchHouseIcon = createMedievalMarker(
  '<i class="fas fa-hat-wizard text-purple-600 text-sm"></i>',
  'border-purple-900',
  'bg-purple-50'
);

export const sageIcon = createMedievalMarker(
  '<i class="fas fa-graduation-cap text-blue-600 text-sm"></i>',
  'border-blue-800',
  'bg-blue-50'
);

export const informationCenterIcon = createMedievalMarker(
  '<i class="fa-solid fa-circle-info text-amber-700 text-sm"></i>',
  'border-amber-900',
  'bg-amber-50'
);

export const trainingCampIcon = createMedievalMarker(
  '<img src="/images/icons/sword_red.png" alt="Sword icon" class="w-4 h-4 object-contain" />',
  'border-red-900',
  'bg-red-50'
);

export const archeryRangeIcon = createMedievalMarker(
  '<img src="/images/icons/bow_red.png" alt="Bow icon" class="w-4 h-4 object-contain" />',
  'border-red-900',
  'bg-red-50'
);

export const castleIcon = createMedievalMarker(
  '<i class="fas fa-chess-rook text-gray-600 text-sm"></i>',
  'border-gray-800',
  'bg-gray-50'
);

export const villageFoolIcon = createMedievalMarker(
  '<img src="/images/icons/fool_purple.png" alt="Fool icon" class="w-4 h-4 object-contain" />',
  'border-purple-900',
  'bg-purple-50'
);

export const childIcon = createMedievalMarker(
  '<img src="/images/icons/little-boy_blue.png" alt="Little boy icon" class="w-5 h-5 object-contain" />',
  'border-blue-900',
  'bg-blue-50'
);

export const farmerIcon = createMedievalMarker(
  '<img src="/images/icons/farmer_yellow.png" alt="Farmer icon" class="w-5 h-5 object-contain" />',
  'border-yellow-700',
  'bg-yellow-50'
);

export const lumberjackIcon = createMedievalMarker(
  '<img src="/images/icons/axe_brown.png" alt="Axe icon" class="w-4 h-4 object-contain" />',
  'border-amber-800',
  'bg-amber-50'
);

export const prestataireIcon = createMedievalMarker(
  '<i class="fas fa-store text-emerald-700 text-sm"></i>',
  'border-emerald-800',
  'bg-emerald-50'
);

export const clickIcon = createMedievalMarker(
  '<i class="fas fa-location-dot text-red-600 text-sm"></i>',
  'border-red-800',
  'bg-white'
);

export const toiletIcon = createMedievalMarker(
  '<i class="fa-solid fa-restroom text-emerald-700 text-sm"></i>',
  'border-emerald-800',
  'bg-emerald-50'
);

export const defaultIcon = createMedievalMarker(
  '<i class="fas fa-map-marker-alt text-gray-500 text-sm"></i>',
  'border-gray-600',
  'bg-white'
);

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
  default: defaultIcon,
};