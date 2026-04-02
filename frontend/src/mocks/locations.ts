import { PRESTATAIRE_USER_ID_2 } from './users';
import { LocationType } from "./locationTypes";

export interface LocationMock {
  id: number;
  name: string;
  description?: string;
  presentation?: string; // Use Text editor
  static_code?: string;
  price: number;

  has_water_access?: boolean;
  has_electricity?: boolean;
  has_toilets?: boolean;
  is_accessible_pmr?: boolean;

  id_location_type: number;
  purchased: boolean;

  position: [number, number];
  icon_name?: string;
  banner_image?: string;

  status: 'AVAILABLE' | 'PENDING' | 'APPROVED';
  id_prestataire?: number; // Reference to user id
  prestataire?: { // User details from backend 
    id_user: number;
    firstname: string;
    lastname: string;
    avatar_url?: string;
    avatar_type?: string;
  };


}

export const LOCATIONS: LocationMock[] = [
  // === Main Quest Locations ===
  {
    id: 1,
    static_code: 'TICKET_OFFICE',
    name: "The Ticket Office",
    description:
      'A quaint wooden building adorned with colorful banners. The ticket officer, a jovial man named Garin, sells tickets to adventurers eager to explore the realm.',
    price: 0,
    purchased: true,
    status: 'APPROVED', // Always true for main quest locations
    id_prestataire: 0,
    id_location_type: LocationType.STORY_LOCATION_TYPE_ID,
    position: [1747, 5072],
    icon_name: 'ticketOffice',
    banner_image: 'images/locations/biletterie.png'
  },
  {
    id: 2,
    static_code: 'WITCH_HUT',
    name: "The Witch's Hut",
    description:
      'A mysterious dwelling shrouded in purple mist. The witch Morgana crafts powerful potions and enchantments for those brave enough to seek her services.',
    price: 0,
    purchased: true,
    status: 'APPROVED', // Always true for main quest locations
    id_prestataire: 0,
    id_location_type: LocationType.STORY_LOCATION_TYPE_ID,
    position: [910, 4330],
    icon_name: 'witchHouse',
    banner_image: 'images/locations/sorcerer.png'
  },
  {
    id: 3,
    static_code: 'SAGE_HOUSE',
    name: "The Great Sage's House",
    description:
      'A towering library filled with ancient tomes and scrolls. The sage Eldric shares wisdom and teaches powerful spells to worthy students.',
    price: 0,
    purchased: true,
    status: 'APPROVED', // Always true for main quest locations
    id_prestataire: 0,
    id_location_type: LocationType.STORY_LOCATION_TYPE_ID,
    position: [1344, 3572],
    icon_name: 'sage',
    banner_image: 'images/locations/great_sage.jpg'
  },
  {
    id: 4,
    static_code: 'INFORMATION_CENTER',
    name: 'The Information Center',
    description:
      'A bustling hub where adventurers gather to share news and seek guidance. The center is run by a knowledgeable clerk who provides maps and quest details.',
    price: 0,
    purchased: true,
    status: 'APPROVED', // Always true for main quest locations
    id_prestataire: 0,
    id_location_type: LocationType.STORY_LOCATION_TYPE_ID,
    position: [1580, 4488],
    icon_name: 'informationCenter',
    banner_image: 'images/medieval_image.jpg'
  },
  {
    id: 5,
    static_code: 'ROYAL_CASTLE',
    name: 'The Royal Castle',
    description:
      'The magnificent seat of power in the kingdom. The castle houses the royal family and serves as the center of governance and justice.',
    price: 0,
    purchased: true,
    status: 'APPROVED', // Always true for main quest locations
    id_prestataire: 0,
    id_location_type: LocationType.STORY_LOCATION_TYPE_ID,
    position: [2856, 3770],
    icon_name: 'castle',
    banner_image: 'images/medieval_image.jpg'
  },
  {
    id: 6,
    static_code: 'TRAINING_CAMP',
    name: 'The Training Camp',
    description:
      'A rugged encampment where warriors hone their combat skills. The camp is led by a grizzled veteran who trains recruits in the art of battle.',
    price: 0,
    purchased: true,
    status: 'APPROVED', // Always true for main quest locations
    id_prestataire: 0,
    id_location_type: LocationType.STORY_LOCATION_TYPE_ID,
    position: [1352, 2678],
    icon_name: 'trainingCamp',
    banner_image: 'images/locations/training_camp.jpg'
  },
  {
    id: 7,
    static_code: 'ARCHERY_RANGE',
    name: 'The Archery range',
    description:
      'A peaceful range where archers practice their marksmanship. The range is overseen by a skilled archer who offers lessons to aspiring bowmen.',
    price: 0,
    purchased: true,
    status: 'APPROVED', // Always true for main quest locations
    id_prestataire: 0,
    id_location_type: LocationType.STORY_LOCATION_TYPE_ID,
    position: [1528, 3304],
    icon_name: 'archeryRange',
    banner_image: 'images/locations/training_camp.jpg'
  },
  {
    id: 8,
    static_code: 'VILLAGE_FOOL',
    name: 'The Village Fool',
    description:
      'A villager known for his antics and humorous tales. Despite his foolish demeanor, he often provides unexpected insights.',
    price: 0,
    purchased: true,
    status: 'APPROVED', // Always true for main quest locations
    id_prestataire: 0,
    id_location_type: LocationType.STORY_LOCATION_TYPE_ID,
    position: [2556, 4647],
    icon_name: 'villageFool',
    banner_image: 'images/locations/training_camp.jpg'
  },
  {
    id: 9,
    static_code: 'CHILD',
    name: 'The Child',
    description:
      'A curious child who dreams of becoming a great adventurer one day. He often asks questions about the world beyond the village.',
    price: 0,
    purchased: true,
    status: 'APPROVED', // Always true for main quest locations
    id_prestataire: 0,
    id_location_type: LocationType.STORY_LOCATION_TYPE_ID,
    position: [1008, 2165],
    icon_name: 'child',
    banner_image: 'images/medieval_image.jpg'
  },
  {
    id: 10,
    static_code: 'FARMER',
    name: 'The Farmer',
    description:
      'A hardworking farmer who tends to the village fields. He provides food and supplies to adventurers passing through.',
    price: 0,
    purchased: true,
    status: 'APPROVED', // Always true for main quest locations
    id_prestataire: 0,
    id_location_type: LocationType.STORY_LOCATION_TYPE_ID,
    position: [2060, 1728],
    icon_name: 'farmer',
    banner_image: 'images/medieval_image.jpg'
  },
  {
    id: 11,
    static_code: 'LUMBERJACK',
    name: 'The Lumberjack',
    description:
      'A burly lumberjack who harvests wood from the nearby forest. He is known for his strength and skill with an axe.',
    price: 0,
    purchased: true,
    status: 'APPROVED', // Always true for main quest locations
    id_prestataire: 0,
    id_location_type: LocationType.STORY_LOCATION_TYPE_ID,
    position: [3040, 2724],
    icon_name: 'lumberjack',
    banner_image: 'images/medieval_image.jpg'
  },

  // === Prestataire / Buyable Locations ===
  {
    id: 14,
    static_code: 'PRESTA_STALL_5',
    name: 'La Rotisserie du Lion',
    description:
      'Stand de restauration chaude avec grande ardoise du jour et service en continu.',
    price: 14000,
    purchased: true,
    status: 'APPROVED',
    id_prestataire: 1,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [2254, 1897],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 15,
    static_code: 'PRESTA_STALL_6',
    name: 'Le Cellier des Voyageurs',
    description:
      'Comptoir de boissons, degustations et paniers gourmands a emporter.',
    price: 16000,
    purchased: true,
    status: 'APPROVED',
    id_prestataire: 1,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [2188, 2139],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 16,
    static_code: 'PRESTA_STALL_7',
    name: 'L Atelier de l Arbaletriere',
    description:
      'Atelier vivant de cuir et d accessoires de tir avec demonstrations.',
    price: 11000,
    purchased: true,
    status: 'APPROVED',
    id_prestataire: PRESTATAIRE_USER_ID_2,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [2006, 2383],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 17,
    static_code: 'PRESTA_STALL_8',
    name: 'La Forge des Lanternes',
    description:
      'Forge decorative et espace de presentation des pieces artisanales.',
    price: 11500,
    purchased: true,
    status: 'APPROVED',
    id_prestataire: PRESTATAIRE_USER_ID_2,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [2386, 3379],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 18,
    static_code: 'PRESTA_STALL_9',
    name: 'Le Bazar EnchantÃ©',
    description:
      'Known for its vibrant atmosphere and diverse range of products.',
    price: 12500,
    purchased: true,
    status: 'APPROVED',
    id_prestataire: PRESTATAIRE_USER_ID_2,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [2236, 2491],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 19,
    static_code: 'PRESTA_STALL_10',
    name: 'Le MarchÃ© des Merveilles',
    description:
      'A prime spot for attracting both locals and tourists alike.',
    price: 13500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [2346, 2271],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 20,
    static_code: 'PRESTA_STALL_11',
    name: 'Le Carrefour d\'Or',
    description:
      'Located at a busy intersection, ensuring a steady stream of potential customers.',
    price: 14500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [2142, 2949],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 21,
    static_code: 'PRESTA_STALL_12',
    name: 'La Halle du MarchÃ©',
    description:
      'A bustling area known for its lively market scene and diverse offerings.',
    price: 15500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [1946, 3171],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 22,
    static_code: 'PRESTA_STALL_13',
    name: 'L\'Auberge du Croissant',
    description:
      'Close to the tavern, this stall benefits from thirsty travelers looking for refreshments.',
    price: 16500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [2398, 2599],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 23,
    static_code: 'PRESTA_STALL_14',
    name: 'L\'Ã‰curie Royale',
    description:
      'A favored spot for its proximity to the stables and the smell of fresh hay.',
    price: 17500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [2556, 2025],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 24,
    static_code: 'PRESTA_STALL_15',
    name: 'Le BelvÃ©dÃ¨re',
    description:
      'Known for its excellent view of the market square, ideal for attracting attention.',
    price: 18500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [2616, 2273],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 25,
    static_code: 'PRESTA_STALL_16',
    name: 'La Fontaine d\'Argent',
    description:
      'A strategic location near the fountain, popular with both locals and tourists.',
    price: 19500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [2426, 1671],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 26,
    static_code: 'PRESTA_STALL_17',
    name: 'La Porte du MarchÃ©',
    description:
      'Close to the entrance of the market, ensuring high visibility for your goods.',
    price: 20500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [2324, 1517],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 27,
    static_code: 'PRESTA_STALL_18',
    name: 'Vue sur le ChÃ¢teau',
    description:
      'A charming stall with a great view of the castle, perfect for attracting tourists.',
    price: 21500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [2266, 1404],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 28,
    static_code: 'PRESTA_STALL_19',
    name: 'ScÃ¨ne du Troubadour',
    description:
      "Located near the bard's stage, enjoy the added benefit of musical entertainment.",
    price: 22500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [2226, 1295],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 29,
    static_code: 'PRESTA_STALL_20',
    name: 'TrÃ©sors d\'Orient',
    description:
      'A prime location for selling exotic goods from distant lands.',
    price: 23500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [1734, 3571],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 30,
    static_code: 'PRESTA_STALL_21',
    name: 'L\'Ã‰picerie MÃ©diÃ©vale',
    description:
      'Known for its vibrant colors and the enticing smell of delicious food.',
    price: 24500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [1802, 1897],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 31,
    static_code: 'PRESTA_STALL_22',
    name: 'Le Bazar Sympathique',
    description:
      'A popular spot for its variety of goods and friendly merchants.',
    price: 25500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [1856, 1999],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 32,
    static_code: 'PRESTA_STALL_23',
    name: 'L\'Arsenal du Guerrier',
    description:
      'Close to the blacksmith, attracting customers looking for weapons and armor.',
    price: 26500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [1914, 2113],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 33,
    static_code: 'PRESTA_STALL_24',
    name: 'L\'Ombre du Puits',
    description: 'A favored location for its shade and the nearby well.',
    price: 27500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [1694, 2113],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 34,
    static_code: 'PRESTA_STALL_25',
    name: 'Le Poste de Garde',
    description:
      'Known for its strategic location near the guard post, ensuring safety and visibility.',
    price: 28500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [1756, 2219],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 35,
    static_code: 'PRESTA_STALL_26',
    name: 'Arcanes & SortilÃ¨ges',
    description:
      'A prime spot for selling magical artifacts and rare ingredients.',
    price: 29500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [1808, 2333],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 37,
    static_code: 'PRESTA_STALL_28',
    name: 'La Boulangerie DorÃ©e',
    description:
      'A cozy stall, ideal for selling baked goods and sweet treats.',
    price: 31500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [1088, 1679],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 38,
    static_code: 'PRESTA_STALL_29',
    name: 'Le Panorama Royal',
    description:
      'Known for its excellent view of the market square, ideal for attracting attention.',
    price: 32500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [1282, 1625],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 39,
    static_code: 'PRESTA_STALL_30',
    name: 'La Fontaine des VÅ“ux',
    description:
      'A strategic location near the fountain, popular with both locals and tourists.',
    price: 33500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [1394, 2167],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },
  {
    id: 40,
    static_code: 'PRESTA_STALL_31',
    name: 'L\'EntrÃ©e du MarchÃ©',
    description:
      'Close to the entrance of the market, ensuring high visibility for your goods.',
    price: 34500,
    purchased: false,
    status: 'AVAILABLE',
    id_prestataire: undefined,
    id_location_type: LocationType.PRESTATAIRE_LOCATION_TYPE_ID,
    position: [1086, 2329],
    icon_name: 'prestataire',
    banner_image: 'images/locations/buyable.png'
  },

  // === Toilet Locations  ===
  {
    id: 47,
    static_code: 'TOILET_1',
    name: 'Toilet #1',
    description:
      'A toilet located near the marketplace for public convenience.',
    price: 0,
    purchased: true,
    status: 'APPROVED',
    id_prestataire: 0,
    id_location_type: LocationType.OTHER_LOCATION_TYPE_ID,
    position: [1760, 2860],
    icon_name: 'toilet',
    banner_image: 'images/medieval_image.jpg'
  },
  {
    id: 48,
    static_code: 'TOILET_2',
    name: 'Toilet #2',
    description:
      'A toilet located near the marketplace for public convenience.',
    price: 0,
    purchased: true,
    status: 'APPROVED',
    id_prestataire: 0,
    id_location_type: LocationType.OTHER_LOCATION_TYPE_ID,
    position: [1010, 1832],
    icon_name: 'toilet',
    banner_image: 'images/medieval_image.jpg'
  },
  {
    id: 49,
    static_code: 'TOILET_3',
    name: 'Toilet #3',
    description:
      'A toilet located near the marketplace for public convenience.',
    price: 0,
    purchased: true,
    status: 'APPROVED',
    id_prestataire: 0,
    id_location_type: LocationType.OTHER_LOCATION_TYPE_ID,
    position: [3200, 3288],
    icon_name: 'toilet',
    banner_image: 'images/medieval_image.jpg'
  },
  {
    id: 50,
    static_code: 'TOILET_4',
    name: 'Toilet #4',
    description:
      'A toilet located near the marketplace for public convenience.',
    price: 0,
    purchased: true,
    status: 'APPROVED',
    id_prestataire: 0,
    id_location_type: LocationType.OTHER_LOCATION_TYPE_ID,
    position: [2142, 1184],
    icon_name: 'toilet',
    banner_image: 'images/medieval_image.jpg'
  },
  {
    id: 51,
    static_code: 'TOILET_5',
    name: 'Toilet #5',
    description:
      'A toilet located near the marketplace for public convenience.',
    price: 0,
    purchased: true,
    status: 'APPROVED',
    id_prestataire: 0,
    id_location_type: LocationType.OTHER_LOCATION_TYPE_ID,
    position: [1820, 3348],
    icon_name: 'toilet',
    banner_image: 'images/medieval_image.jpg'
  },

];


export const locationsMock = LOCATIONS;

