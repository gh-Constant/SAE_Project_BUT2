import { PRESTATAIRE_USER_ID, PRESTATAIRE_USER_ID_2 } from './users';

export interface LocationMock {
  id: number;
  staticCode: string;
  name: string;
  description: string;
  price: number;
  purchased: boolean;
  userId: number | null;
  type?: 'prestataire' | 'story' | 'other';
  position: [number, number];
  iconName: string;
  bannerImage: string;
}

export const locationsMock: LocationMock[] = [
  // === Main Quest Locations ===
  {
    id: 1,
    staticCode: 'TICKET_OFFICE',
    name: "The Ticket Office",
    description:
      'A quaint wooden building adorned with colorful banners. The ticket officer, a jovial man named Garin, sells tickets to adventurers eager to explore the realm.',
    price: 0,
    purchased: true, // Always true for main quest locations
    userId: null,
    type: 'story',
    position: [1747, 5072],
    iconName: 'ticketOffice',
    bannerImage: 'images/locations/biletterie.png'
  },
  {
    id: 2,
    staticCode: 'WITCH_HUT',
    name: "The Witch's Hut",
    description:
      'A mysterious dwelling shrouded in purple mist. The witch Morgana crafts powerful potions and enchantments for those brave enough to seek her services.',
    price: 0,
    purchased: true, // Always true for main quest locations
    userId: null,
    type: 'story',
    position: [910, 4330],
    iconName: 'witchHouse',
    bannerImage: 'images/locations/sorcerer.png'
  },
  {
    id: 3,
    staticCode: 'SAGE_HOUSE',
    name: "The Great Sage's House",
    description:
      'A towering library filled with ancient tomes and scrolls. The sage Eldric shares wisdom and teaches powerful spells to worthy students.',
    price: 0,
    purchased: true, // Always true for main quest locations
    userId: null,
    type: 'story',
    position: [1344, 3572],
    iconName: 'sage',
    bannerImage: 'images/locations/great_sage.jpg'
  },
  {
    id: 4,
    staticCode: 'INFORMATION_CENTER',
    name: 'The Information Center',
    description:
      'A bustling hub where adventurers gather to share news and seek guidance. The center is run by a knowledgeable clerk who provides maps and quest details.',
    price: 0,
    purchased: true, // Always true for main quest locations
    userId: null,
    type: 'story',
    position: [1580, 4488],
    iconName: 'informationCenter',
    bannerImage: 'images/medieval_image.jpg'
  },
  {
    id: 5,
    staticCode: 'ROYAL_CASTLE',
    name: 'The Royal Castle',
    description:
      'The magnificent seat of power in the kingdom. The castle houses the royal family and serves as the center of governance and justice.',
    price: 0,
    purchased: true, // Always true for main quest locations
    userId: null,
    type: 'story',
    position: [2856, 3770],
    iconName: 'castle',
    bannerImage: 'images/medieval_image.jpg'
  },
  {
    id: 6,
    staticCode: 'TRAINING_CAMP',
    name: 'The Training Camp',
    description:
      'A rugged encampment where warriors hone their combat skills. The camp is led by a grizzled veteran who trains recruits in the art of battle.',
    price: 0,
    purchased: true, // Always true for main quest locations
    userId: null,
    type: 'story',
    position: [1352, 2678],
    iconName: 'trainingCamp',
    bannerImage: 'images/locations/training_camp.jpg'
  },
  {
    id: 6,
    staticCode: 'ARCHERY_RANGE',
    name: 'The Archery range',
    description:
      'A peaceful range where archers practice their marksmanship. The range is overseen by a skilled archer who offers lessons to aspiring bowmen.',
    price: 0,
    purchased: true, // Always true for main quest locations
    userId: null,
    type: 'story',
    position: [1528, 3304],
    iconName: 'archeryRange',
    bannerImage: 'images/locations/training_camp.jpg'
  },
  {
    id: 7,
    staticCode: 'VILLAGE_FOOL',
    name: 'The Village Fool',
    description:
      'A villager known for his antics and humorous tales. Despite his foolish demeanor, he often provides unexpected insights.',
    price: 0,
    purchased: true, // Always true for main quest locations
    userId: null,
    type: 'story',
    position: [2556, 4647],
    iconName: 'villageFool',
    bannerImage: 'images/locations/training_camp.jpg'
  },
  {
    id: 8,
    staticCode: 'CHILD',
    name: 'The Child',
    description:
      'A curious child who dreams of becoming a great adventurer one day. He often asks questions about the world beyond the village.',
    price: 0,
    purchased: true, // Always true for main quest locations
    userId: null,
    type: 'story',
    position: [1008, 2165],
    iconName: 'child',
    bannerImage: 'images/medieval_image.jpg'
  },
  {
    id: 9,
    staticCode: 'FARMER',
    name: 'The Farmer',
    description:
      'A hardworking farmer who tends to the village fields. He provides food and supplies to adventurers passing through.',
    price: 0,
    purchased: true, // Always true for main quest locations
    userId: null,
    type: 'story',
    position: [2060, 1728],
    iconName: 'farmer',
    bannerImage: 'images/medieval_image.jpg'
  },
  {
    id: 10,
    staticCode: 'LUMBERJACK',
    name: 'The Lumberjack',
    description:
      'A burly lumberjack who harvests wood from the nearby forest. He is known for his strength and skill with an axe.',
    price: 0,
    purchased: true, // Always true for main quest locations
    userId: null,
    type: 'story',
    position: [3040, 2724],
    iconName: 'lumberjack',
    bannerImage: 'images/medieval_image.jpg'
  },

  // === Prestataire / Buyable Locations ===
  {
    id: 14,
    staticCode: 'PRESTA_STALL_5',
    name: 'Merchant Stall #5',
    description:
      'A popular location among travelers, known for its high foot traffic.',
    price: 140,
    purchased: true,
    userId: PRESTATAIRE_USER_ID,
    type: 'prestataire',
    position: [2254, 1897],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 15,
    staticCode: 'PRESTA_STALL_6',
    name: 'Merchant Stall #6',
    description:
      'Situated near the town square, this stall benefits from constant visibility.',
    price: 160,
    purchased: true,
    userId: PRESTATAIRE_USER_ID,
    type: 'prestataire',
    position: [2188, 2139],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 16,
    staticCode: 'PRESTA_STALL_7',
    name: 'Merchant Stall #7',
    description:
      'A strategic location for merchants, close to the main road.',
    price: 110,
    purchased: true,
    userId: PRESTATAIRE_USER_ID_2,
    type: 'prestataire',
    position: [2006, 2383],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 17,
    staticCode: 'PRESTA_STALL_8',
    name: 'Merchant Stall #8',
    description:
      'A cozy stall, perfect for selling handmade goods and local crafts.',
    price: 115,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [2386, 3379],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 18,
    staticCode: 'PRESTA_STALL_9',
    name: 'Merchant Stall #9',
    description:
      'Known for its vibrant atmosphere and diverse range of products.',
    price: 125,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [2236, 2491],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 19,
    staticCode: 'PRESTA_STALL_10',
    name: 'Merchant Stall #10',
    description:
      'A prime spot for attracting both locals and tourists alike.',
    price: 135,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [2346, 2271],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 20,
    staticCode: 'PRESTA_STALL_11',
    name: 'Merchant Stall #11',
    description:
      'Located at a busy intersection, ensuring a steady stream of potential customers.',
    price: 145,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [2142, 2949],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 21,
    staticCode: 'PRESTA_STALL_12',
    name: 'Merchant Stall #12',
    description:
      'A bustling area known for its lively market scene and diverse offerings.',
    price: 155,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [1946, 3171],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 22,
    staticCode: 'PRESTA_STALL_13',
    name: 'Merchant Stall #13',
    description:
      'Close to the tavern, this stall benefits from thirsty travelers looking for refreshments.',
    price: 165,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [2398, 2599],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 23,
    staticCode: 'PRESTA_STALL_14',
    name: 'Merchant Stall #14',
    description:
      'A favored spot for its proximity to the stables and the smell of fresh hay.',
    price: 175,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [2556, 2025],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 24,
    staticCode: 'PRESTA_STALL_15',
    name: 'Merchant Stall #15',
    description:
      'Known for its excellent view of the market square, ideal for attracting attention.',
    price: 185,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [2616, 2273],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 25,
    staticCode: 'PRESTA_STALL_16',
    name: 'Merchant Stall #16',
    description:
      'A strategic location near the fountain, popular with both locals and tourists.',
    price: 195,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [2426, 1671],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 26,
    staticCode: 'PRESTA_STALL_17',
    name: 'Merchant Stall #17',
    description:
      'Close to the entrance of the market, ensuring high visibility for your goods.',
    price: 205,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [2324, 1517],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 27,
    staticCode: 'PRESTA_STALL_18',
    name: 'Merchant Stall #18',
    description:
      'A charming stall with a great view of the castle, perfect for attracting tourists.',
    price: 215,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [2266, 1404],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 28,
    staticCode: 'PRESTA_STALL_19',
    name: 'Merchant Stall #19',
    description:
      "Located near the bard's stage, enjoy the added benefit of musical entertainment.",
    price: 225,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [2226, 1295],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 29,
    staticCode: 'PRESTA_STALL_20',
    name: 'Merchant Stall #20',
    description:
      'A prime location for selling exotic goods from distant lands.',
    price: 235,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [1734, 3571],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 30,
    staticCode: 'PRESTA_STALL_21',
    name: 'Merchant Stall #21',
    description:
      'Known for its vibrant colors and the enticing smell of delicious food.',
    price: 245,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [1802, 1897],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 31,
    staticCode: 'PRESTA_STALL_22',
    name: 'Merchant Stall #22',
    description:
      'A popular spot for its variety of goods and friendly merchants.',
    price: 255,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [1856, 1999],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 32,
    staticCode: 'PRESTA_STALL_23',
    name: 'Merchant Stall #23',
    description:
      'Close to the blacksmith, attracting customers looking for weapons and armor.',
    price: 265,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [1914, 2113],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 33,
    staticCode: 'PRESTA_STALL_24',
    name: 'Merchant Stall #24',
    description: 'A favored location for its shade and the nearby well.',
    price: 275,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [1694, 2113],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 34,
    staticCode: 'PRESTA_STALL_25',
    name: 'Merchant Stall #25',
    description:
      'Known for its strategic location near the guard post, ensuring safety and visibility.',
    price: 285,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [1756, 2219],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 35,
    staticCode: 'PRESTA_STALL_26',
    name: 'Merchant Stall #26',
    description:
      'A prime spot for selling magical artifacts and rare ingredients.',
    price: 295,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [1808, 2333],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 36,
    staticCode: 'PRESTA_STALL_27',
    name: 'Merchant Stall #27',
    description:
      'Located at a busy crossroads, perfect for catching the attention of passersby.',
    price: 305,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [0, 1],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 37,
    staticCode: 'PRESTA_STALL_28',
    name: 'Merchant Stall #28',
    description:
      'A cozy stall, ideal for selling baked goods and sweet treats.',
    price: 315,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [1088, 1679],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 38,
    staticCode: 'PRESTA_STALL_29',
    name: 'Merchant Stall #29',
    description:
      'Known for its excellent view of the market square, ideal for attracting attention.',
    price: 325,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [1282, 1625],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 39,
    staticCode: 'PRESTA_STALL_30',
    name: 'Merchant Stall #30',
    description:
      'A strategic location near the fountain, popular with both locals and tourists.',
    price: 335,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [1394, 2167],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 40,
    staticCode: 'PRESTA_STALL_31',
    name: 'Merchant Stall #31',
    description:
      'Close to the entrance of the market, ensuring high visibility for your goods.',
    price: 345,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [1086, 2329],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },

  // === Toilet Locations  ===
  {
    id: 47,
    staticCode: 'TOILET_1',
    name: 'Toilet #1',
    description:
      'A toilet located near the marketplace for public convenience.',
    price: 0,
    purchased: true,
    userId: null,
    type: 'other',
    position: [1760, 2860],
    iconName: 'toilet',
    bannerImage: 'images/medieval_image.jpg'
  },
  {
    id: 48,
    staticCode: 'TOILET_2',
    name: 'Toilet #2',
    description:
      'A toilet located near the marketplace for public convenience.',
    price: 0,
    purchased: true,
    userId: null,
    type: 'other',
    position: [1010, 1832],
    iconName: 'toilet',
    bannerImage: 'images/medieval_image.jpg'
  },
  {
    id: 49,
    staticCode: 'TOILET_3',
    name: 'Toilet #3',
    description:
      'A toilet located near the marketplace for public convenience.',
    price: 0,
    purchased: true,
    userId: null,
    type: 'other',
    position: [3200, 3288],
    iconName: 'toilet',
    bannerImage: 'images/medieval_image.jpg'
  },
  {
    id: 50,
    staticCode: 'TOILET_4',
    name: 'Toilet #4',
    description:
      'A toilet located near the marketplace for public convenience.',
    price: 0,
    purchased: true,
    userId: null,
    type: 'other',
    position: [2142, 1184],
    iconName: 'toilet',
    bannerImage: 'images/medieval_image.jpg'
  },
  {
    id: 51,
    staticCode: 'TOILET_5',
    name: 'Toilet #5',
    description:
      'A toilet located near the marketplace for public convenience.',
    price: 0,
    purchased: true,
    userId: null,
    type: 'other',
    position: [1820, 3348],
    iconName: 'toilet',
    bannerImage: 'images/medieval_image.jpg'
  },

];

