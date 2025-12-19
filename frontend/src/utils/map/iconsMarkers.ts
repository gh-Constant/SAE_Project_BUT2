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
 * @param extraClasses - Additional Tailwind classes to apply to the outer marker div.
 * @returns L.DivIcon
 */
const createMedievalMarker = (
  content: string, 
  borderColor = 'border-dark-wood', 
  bgColor = 'bg-parchment',
  extraClasses = ''
) => {
  return L.divIcon({
    html: `
      <div class="relative flex flex-col items-center justify-center filter drop-shadow-md hover:scale-110 transition-transform duration-200 group ${extraClasses}">
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

interface IconDefinition {
  content: string;
  borderColor: string;
  bgColor: string;
}

const iconDefinitions: Record<string, IconDefinition> = {
  ticketOffice: {
    content: '<i class="fa-solid fa-ticket text-blue-600 text-sm"></i>',
    borderColor: 'border-blue-900',
    bgColor: 'bg-blue-50'
  },
  witchHouse: {
    content: '<i class="fas fa-hat-wizard text-purple-600 text-sm"></i>',
    borderColor: 'border-purple-900',
    bgColor: 'bg-purple-50'
  },
  sage: {
    content: '<i class="fas fa-graduation-cap text-blue-600 text-sm"></i>',
    borderColor: 'border-blue-800',
    bgColor: 'bg-blue-50'
  },
  informationCenter: {
    content: '<i class="fa-solid fa-circle-info text-amber-700 text-sm"></i>',
    borderColor: 'border-amber-900',
    bgColor: 'bg-amber-50'
  },
  trainingCamp: {
    content: '<img src="/images/icons/sword_red.png" alt="Sword icon" class="w-4 h-4 object-contain" />',
    borderColor: 'border-red-900',
    bgColor: 'bg-red-50'
  },
  archeryRange: {
    content: '<img src="/images/icons/bow_red.png" alt="Bow icon" class="w-4 h-4 object-contain" />',
    borderColor: 'border-red-900',
    bgColor: 'bg-red-50'
  },
  castle: {
    content: '<i class="fas fa-chess-rook text-gray-600 text-sm"></i>',
    borderColor: 'border-gray-800',
    bgColor: 'bg-gray-50'
  },
  villageFool: {
    content: '<img src="/images/icons/fool_purple.png" alt="Fool icon" class="w-4 h-4 object-contain" />',
    borderColor: 'border-purple-900',
    bgColor: 'bg-purple-50'
  },
  child: {
    content: '<img src="/images/icons/little-boy_blue.png" alt="Little boy icon" class="w-5 h-5 object-contain" />',
    borderColor: 'border-blue-900',
    bgColor: 'bg-blue-50'
  },
  farmer: {
    content: '<img src="/images/icons/farmer_yellow.png" alt="Farmer icon" class="w-5 h-5 object-contain" />',
    borderColor: 'border-yellow-700',
    bgColor: 'bg-yellow-50'
  },
  lumberjack: {
    content: '<img src="/images/icons/axe_brown.png" alt="Axe icon" class="w-4 h-4 object-contain" />',
    borderColor: 'border-amber-800',
    bgColor: 'bg-amber-50'
  },
  prestataire: {
    content: '<i class="fas fa-store text-emerald-700 text-sm"></i>',
    borderColor: 'border-emerald-800',
    bgColor: 'bg-emerald-50'
  },
  toilet: {
    content: '<i class="fa-solid fa-restroom text-emerald-700 text-sm"></i>',
    borderColor: 'border-emerald-800',
    bgColor: 'bg-emerald-50'
  },
  default: {
    content: '<i class="fas fa-map-marker-alt text-gray-500 text-sm"></i>',
    borderColor: 'border-gray-600',
    bgColor: 'bg-white'
  }
};

/**
 * Gets an icon by name, with dynamic status styling.
 * @param name - Icon name
 * @param status - Item status: 'AVAILABLE' (Gray), 'PENDING' (Yellow), 'APPROVED' (Default)
 */
export const getIcon = (name: string, status: 'AVAILABLE' | 'PENDING' | 'APPROVED' = 'APPROVED') => {
  const def = iconDefinitions[name] || iconDefinitions['default'];
  
  const { content } = def;
  let { borderColor, bgColor } = def;
  let extraClasses = '';

  if (status === 'AVAILABLE') {
     // Grayed out style: Stone colors + grayscale
     borderColor = 'border-stone-400';
     bgColor = 'bg-stone-200';
     extraClasses = 'grayscale opacity-75'; 
  } else if (status === 'PENDING') {
     // Pending style: Yellow colors
     borderColor = 'border-yellow-500';
     bgColor = 'bg-yellow-50';
  }

  return createMedievalMarker(content, borderColor, bgColor, extraClasses);
};

// --- Icons Definitions (Legacy/Direct Export) ---

export const ticketOfficeIcon = getIcon('ticketOffice');
export const witchHouseIcon = getIcon('witchHouse');
export const sageIcon = getIcon('sage');
export const informationCenterIcon = getIcon('informationCenter');
export const trainingCampIcon = getIcon('trainingCamp');
export const archeryRangeIcon = getIcon('archeryRange');
export const castleIcon = getIcon('castle');
export const villageFoolIcon = getIcon('villageFool');
export const childIcon = getIcon('child');
export const farmerIcon = getIcon('farmer');
export const lumberjackIcon = getIcon('lumberjack');
export const prestataireIcon = getIcon('prestataire');
export const toiletIcon = getIcon('toilet');
export const defaultIcon = getIcon('default');

export const clickIcon = createMedievalMarker(
  '<i class="fas fa-location-dot text-red-600 text-sm"></i>',
  'border-red-800',
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