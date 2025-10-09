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

export interface MarkerData {
  position: L.LatLngExpression;
  icon: L.DivIcon;
  popup: string;
  type: 'story' | 'prestataire';
  title: string;
  bannerImage: string;
  owner?: string;
  cost?: string | number;
  purchased?: boolean;
  description: string;
  additionalImages?: string[];
}

const predefinedMarkers: MarkerData[] = [
  {
    position: [1747, 5072] as L.LatLngExpression,
    icon: houseIcon,
    popup: 'House at 1747, 5072',
    type: 'story',
    title: 'The Adventurer\'s House',
    bannerImage: 'images/locations/biletterie.png', // No specific image provided, keeping original
    owner: 'The Hero',
    cost: 'Free',
    purchased: false,
    description: 'Your humble abode where your journey begins. A cozy house with all the basic amenities an adventurer needs to rest and prepare for their quests.'
  },
  {
    position: [910, 4330] as L.LatLngExpression,
    icon: witchHouseIcon,
    popup: 'Witch House at 910, 4330',
    type: 'story',
    title: 'The Witch\'s Hut',
    bannerImage: 'images/locations/sorcerer.png',
    owner: 'Morgana the Witch',
    cost: '50 gold per potion',
    purchased: false,
    description: 'A mysterious dwelling shrouded in purple mist. The witch Morgana crafts powerful potions and enchantments for those brave enough to seek her services.'
  },
  {
    position: [1344, 3572] as L.LatLngExpression,
    icon: sageIcon,
    popup: 'The Great Sage at 1344, 3572',
    type: 'story',
    title: 'The Great Sage\'s Tower',
    bannerImage: 'images/locations/great_sage.jpg',
    owner: 'Eldric the Wise',
    cost: 'Knowledge for Knowledge',
    purchased: false,
    description: 'A towering library filled with ancient tomes and scrolls. The sage Eldric shares wisdom and teaches powerful spells to worthy students.'
  },
  {
    position: [1580, 4488] as L.LatLngExpression,
    icon: trainingCampIcon,
    popup: 'Training Camp at 1580, 4488',
    type: 'story',
    title: 'The Training Grounds',
    bannerImage: 'images/locations/training_camp.png',
    owner: 'Captain Thorne',
    cost: '100 gold per session',
    purchased: false,
    description: 'A military training camp where warriors hone their combat skills. Captain Thorne offers rigorous training programs for all skill levels.'
  },
  {
    position: [2856, 3770] as L.LatLngExpression,
    icon: castleIcon,
    popup: 'Castle at 2856, 3770',
    type: 'story',
    title: 'The Royal Castle',
    bannerImage: 'images/medieval_image.jpg', // No specific image provided, keeping original
    owner: 'King Aldric III',
    cost: 'By Royal Invitation',
    purchased: false,
    description: 'The magnificent seat of power in the kingdom. The castle houses the royal family and serves as the center of governance and justice.'
  },
  {
    position: [1958, 1899] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1958, 1899',
    type: 'prestataire',
    title: 'Merchant Stall #1',
    bannerImage: 'images/locations/buyable.png',
    owner: 'Available',
    cost: '150 gold/day',
    purchased: false,
    description: 'A prime location in the marketplace. Perfect for selling your wares to the many travelers passing through.'
  },
  {
    position: [1984, 1893] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1984, 1893',
    type: 'prestataire',
    title: 'Merchant Stall #2',
    bannerImage: 'images/locations/buyable.png',
    cost: '150 gold/day',
    purchased: false,
    description: 'A well-positioned stall in the heart of the market district.'
  },
  {
    position: [2064, 1733] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2064, 1733',
    type: 'prestataire',
    title: 'Merchant Stall #3',
    bannerImage: 'images/locations/buyable.png',
    cost: '120 gold/day',
    purchased: true,
    description: 'Currently occupied by a local blacksmith selling tools and weapons.'
  },
  {
    position: [2148, 1569] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2148, 1569',
    type: 'prestataire',
    title: 'Merchant Stall #4',
    bannerImage: 'images/locations/buyable.png',
    cost: '130 gold/day',
    purchased: false,
    description: 'A bustling spot in the marketplace, ideal for attracting customers.'
  },
  {
    position: [2254, 1897] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2254, 1897',
    type: 'prestataire',
    title: 'Merchant Stall #5',
    bannerImage: 'images/locations/buyable.png',
    cost: '140 gold/day',
    purchased: false,
    description: 'A popular location among travelers, known for its high foot traffic.'
  },
  {
    position: [2188, 2139] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2188, 2139',
    type: 'prestataire',
    title: 'Merchant Stall #6',
    bannerImage: 'images/locations/buyable.png',
    cost: '160 gold/day',
    purchased: false,
    description: 'Situated near the town square, this stall benefits from constant visibility.'
  },
  {
    position: [2006, 2383] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2006, 2383',
    type: 'prestataire',
    title: 'Merchant Stall #7',
    bannerImage: 'images/locations/buyable.png',
    cost: '110 gold/day',
    purchased: false,
    description: 'A strategic location for merchants, close to the main road.'
  },
  {
    position: [2082, 2465] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2082, 2465',
    type: 'prestataire',
    title: 'Merchant Stall #8',
    bannerImage: 'images/locations/buyable.png',
    cost: '115 gold/day',
    purchased: false,
    description: 'A cozy stall, perfect for selling handmade goods and local crafts.'
  },
  {
    position: [2236, 2491] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2236, 2491',
    type: 'prestataire',
    title: 'Merchant Stall #9',
    bannerImage: 'images/locations/buyable.png',
    cost: '125 gold/day',
    purchased: false,
    description: 'Known for its vibrant atmosphere and diverse range of products.'
  },
  {
    position: [2346, 2271] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2346, 2271',
    type: 'prestataire',
    title: 'Merchant Stall #10',
    bannerImage: 'images/locations/buyable.png',
    cost: '135 gold/day',
    purchased: false,
    description: 'A prime spot for attracting both locals and tourists alike.'
  },
  {
    position: [2142, 2949] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2142, 2949',
    type: 'prestataire',
    title: 'Merchant Stall #11',
    bannerImage: 'images/locations/buyable.png',
    cost: '145 gold/day',
    purchased: false,
    description: 'Located at a busy intersection, ensuring a steady stream of potential customers.'
  },
  {
    position: [1946, 3171] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1946, 3171',
    type: 'prestataire',
    title: 'Merchant Stall #12',
    bannerImage: 'images/locations/buyable.png',
    cost: '155 gold/day',
    purchased: false,
    description: 'A bustling area known for its lively market scene and diverse offerings.'
  },
  {
    position: [2398, 2599] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2398, 2599',
    type: 'prestataire',
    title: 'Merchant Stall #13',
    bannerImage: 'images/locations/buyable.png',
    cost: '165 gold/day',
    purchased: false,
    description: 'Close to the tavern, this stall benefits from thirsty travelers looking for refreshments.'
  },
  {
    position: [2556, 2025] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2556, 2025',
    type: 'prestataire',
    title: 'Merchant Stall #14',
    bannerImage: 'images/locations/buyable.png',
    cost: '175 gold/day',
    purchased: false,
    description: 'A favored spot for its proximity to the stables and the smell of fresh hay.'
  },
  {
    position: [2616, 2273] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2616, 2273',
    type: 'prestataire',
    title: 'Merchant Stall #15',
    bannerImage: 'images/locations/buyable.png',
    cost: '185 gold/day',
    purchased: false,
    description: 'Known for its excellent view of the market square, ideal for attracting attention.'
  },
  {
    position: [2426, 1671] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2426, 1671',
    type: 'prestataire',
    title: 'Merchant Stall #16',
    bannerImage: 'images/locations/buyable.png',
    cost: '195 gold/day',
    purchased: false,
    description: 'A strategic location near the fountain, popular with both locals and tourists.'
  },
  {
    position: [2324, 1517] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2324, 1517',
    type: 'prestataire',
    title: 'Merchant Stall #17',
    bannerImage: 'images/locations/buyable.png',
    cost: '205 gold/day',
    purchased: false,
    description: 'Close to the entrance of the market, ensuring high visibility for your goods.'
  },
  {
    position: [2280, 1405] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2280, 1405',
    type: 'prestataire',
    title: 'Merchant Stall #18',
    bannerImage: 'images/locations/buyable.png',
    cost: '215 gold/day',
    purchased: false,
    description: 'A charming stall with a great view of the castle, perfect for attracting tourists.'
  },
  {
    position: [2226, 1295] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2226, 1295',
    type: 'prestataire',
    title: 'Merchant Stall #19',
    bannerImage: 'images/locations/buyable.png',
    cost: '225 gold/day',
    purchased: false,
    description: 'Located near the bard\'s stage, enjoy the added benefit of musical entertainment.'
  },
  {
    position: [2164, 1193] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2164, 1193',
    type: 'prestataire',
    title: 'Merchant Stall #20',
    bannerImage: 'images/locations/buyable.png',
    cost: '235 gold/day',
    purchased: false,
    description: 'A prime location for selling exotic goods from distant lands.'
  },
  {
    position: [1802, 1897] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1802, 1897',
    type: 'prestataire',
    title: 'Merchant Stall #21',
    bannerImage: 'images/locations/buyable.png',
    cost: '245 gold/day',
    purchased: false,
    description: 'Known for its vibrant colors and the enticing smell of delicious food.'
  },
  {
    position: [1856, 1999] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1856, 1999',
    type: 'prestataire',
    title: 'Merchant Stall #22',
    bannerImage: 'images/locations/buyable.png',
    cost: '255 gold/day',
    purchased: false,
    description: 'A popular spot for its variety of goods and friendly merchants.'
  },
  {
    position: [1914, 2113] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1914, 2113',
    type: 'prestataire',
    title: 'Merchant Stall #23',
    bannerImage: 'images/locations/buyable.png',
    cost: '265 gold/day',
    purchased: false,
    description: 'Close to the blacksmith, attracting customers looking for weapons and armor.'
  },
  {
    position: [1694, 2113] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1694, 2113',
    type: 'prestataire',
    title: 'Merchant Stall #24',
    bannerImage: 'images/locations/buyable.png',
    cost: '275 gold/day',
    purchased: false,
    description: 'A favored location for its shade and the nearby well.'
  },
  {
    position: [1756, 2219] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1756, 2219',
    type: 'prestataire',
    title: 'Merchant Stall #25',
    bannerImage: 'images/locations/buyable.png',
    cost: '285 gold/day',
    purchased: false,
    description: 'Known for its strategic location near the guard post, ensuring safety and visibility.'
  },
  {
    position: [1808, 2333] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1808, 2333',
    type: 'prestataire',
    title: 'Merchant Stall #26',
    bannerImage: 'images/locations/buyable.png',
    cost: '295 gold/day',
    purchased: false,
    description: 'A prime spot for selling magical artifacts and rare ingredients.'
  },
  {
    position: [1170, 1973] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1170, 1973',
    type: 'prestataire',
    title: 'Merchant Stall #27',
    bannerImage: 'images/locations/buyable.png',
    cost: '305 gold/day',
    purchased: false,
    description: 'Located at a busy crossroads, perfect for catching the attention of passersby.'
  },
  {
    position: [1088, 1679] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1088, 1679',
    type: 'prestataire',
    title: 'Merchant Stall #28',
    bannerImage: 'images/locations/buyable.png',
    cost: '315 gold/day',
    purchased: false,
    description: 'A cozy stall, ideal for selling baked goods and sweet treats.'
  },
  {
    position: [1282, 1625] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1282, 1625',
    type: 'prestataire',
    title: 'Merchant Stall #29',
    bannerImage: 'images/locations/buyable.png',
    cost: '325 gold/day',
    purchased: false,
    description: 'Known for its excellent view of the market square, ideal for attracting attention.'
  },
  {
    position: [1394, 2167] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1394, 2167',
    type: 'prestataire',
    title: 'Merchant Stall #30',
    bannerImage: 'images/locations/buyable.png',
    cost: '335 gold/day',
    purchased: false,
    description: 'A strategic location near the fountain, popular with both locals and tourists.'
  },
  {
    position: [1086, 2329] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1086, 2329',
    type: 'prestataire',
    title: 'Merchant Stall #31',
    bannerImage: 'images/locations/buyable.png',
    cost: '345 gold/day',
    purchased: false,
    description: 'Close to the entrance of the market, ensuring high visibility for your goods.'
  },
  {
    position: [1008, 2165] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1008, 2165',
    type: 'prestataire',
    title: 'Merchant Stall #32',
    bannerImage: 'images/locations/buyable.png',
    cost: '355 gold/day',
    purchased: false,
    description: 'A charming stall with a great view of the castle, perfect for attracting tourists.'
  },
  {
    position: [1008, 1841] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1008, 1841',
    type: 'prestataire',
    title: 'Merchant Stall #33',
    bannerImage: 'images/locations/buyable.png',
    cost: '365 gold/day',
    purchased: false,
    description: 'Located near the bard\'s stage, enjoy the added benefit of musical entertainment.'
  },
  {
    position: [1725, 3579] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1725, 3579',
    type: 'prestataire',
    title: 'Merchant Stall #34',
    bannerImage: 'images/locations/buyable.png',
    cost: '375 gold/day',
    purchased: false,
    description: 'A prime location for selling exotic goods from distant lands.'
  },
  {
    position: [1834, 3359] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 1834, 3359',
    type: 'prestataire',
    title: 'Merchant Stall #35',
    bannerImage: 'images/locations/buyable.png',
    cost: '385 gold/day',
    purchased: false,
    description: 'Known for its vibrant colors and the enticing smell of delicious food.'
  },
  {
    position: [2372, 3383] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2372, 3383',
    type: 'prestataire',
    title: 'Merchant Stall #36',
    bannerImage: 'images/locations/buyable.png',
    cost: '395 gold/day',
    purchased: false,
    description: 'A popular spot for its variety of goods and friendly merchants.'
  },
  {
    position: [3028, 2737] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 3028, 2737',
    type: 'prestataire',
    title: 'Merchant Stall #37',
    bannerImage: 'images/locations/buyable.png',
    cost: '405 gold/day',
    purchased: false,
    description: 'Close to the blacksmith, attracting customers looking for weapons and armor.'
  },
  {
    position: [2561, 4659] as L.LatLngExpression,
    icon: prestataireIcon,
    popup: 'Prestataire at 2561, 4659',
    type: 'prestataire',
    title: 'Merchant Stall #38',
    bannerImage: 'images/locations/buyable.png',
    cost: '415 gold/day',
    purchased: false,
    description: 'A favored location for its shade and the nearby well.'
  }
];

export function addPredefinedMarkers(map: L.Map, markers: L.Marker[], onMarkerClick?: (data: MarkerData) => void) {
  predefinedMarkers.forEach(markerData => {
    const marker = L.marker(markerData.position, { icon: markerData.icon })
      .addTo(map)
      .bindPopup(markerData.popup);

    if (onMarkerClick) {
      marker.on('click', () => {
        onMarkerClick(markerData);
      });
    }

    markers.push(marker);
  });
}