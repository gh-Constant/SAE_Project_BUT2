import { PRESTATAIRE_USER_ID } from './users';

export interface LocationMock {
  id: number;
  staticCode: string;
  name: string;
  description: string;
  price: number;
  purchased: boolean;
  userId: number | null;
  type?: 'prestataire' | 'story';
  position: [number, number];
  iconName: string;
  bannerImage: string;
}

export const locationsMock: LocationMock[] = [
  // === Main Quest Locations ===
  {
    id: 1,
    staticCode: 'HOUSE_START',
    name: "The Adventurer's House",
    description:
      'Your humble abode where your journey begins. A cozy house with all the basic amenities an adventurer needs to rest and prepare for their quests.',
    price: 0,
    purchased: true, // Assuming the player starts with the house
    userId: null,
    type: 'story',
    position: [1747, 5072],
    iconName: 'house',
    bannerImage: 'images/locations/biletterie.png'
  },
  {
    id: 2,
    staticCode: 'WITCH_HUT',
    name: "The Witch's Hut",
    description:
      'A mysterious dwelling shrouded in purple mist. The witch Morgana crafts powerful potions and enchantments for those brave enough to seek her services.',
    price: 0,
    purchased: false,
    userId: null,
    type: 'story',
    position: [910, 4330],
    iconName: 'witchHouse',
    bannerImage: 'images/locations/sorcerer.png'
  },
  {
    id: 3,
    staticCode: 'SAGE_TOWER',
    name: "The Great Sage's Tower",
    description:
      'A towering library filled with ancient tomes and scrolls. The sage Eldric shares wisdom and teaches powerful spells to worthy students.',
    price: 0,
    purchased: false,
    userId: null,
    type: 'story',
    position: [1344, 3572],
    iconName: 'sage',
    bannerImage: 'images/locations/great_sage.jpg'
  },
  {
    id: 4,
    staticCode: 'TRAINING_GROUNDS',
    name: 'The Training Grounds',
    description:
      'A military training camp where warriors hone their combat skills. Captain Thorne offers rigorous training programs for all skill levels.',
    price: 0,
    purchased: false,
    userId: null,
    type: 'story',
    position: [1580, 4488],
    iconName: 'trainingCamp',
    bannerImage: 'images/locations/training_camp.png'
  },
  {
    id: 5,
    staticCode: 'ROYAL_CASTLE',
    name: 'The Royal Castle',
    description:
      'The magnificent seat of power in the kingdom. The castle houses the royal family and serves as the center of governance and justice.',
    price: 0,
    purchased: false,
    userId: null,
    type: 'story',
    position: [2856, 3770],
    iconName: 'castle',
    bannerImage: 'images/medieval_image.jpg'
  },

  // === Prestataire / Buyable Locations ===
  {
    id: 10,
    staticCode: 'PRESTA_STALL_1',
    name: 'Merchant Stall #1',
    description:
      'A prime location in the marketplace. Perfect for selling your wares to the many travelers passing through.',
    price: 150,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [1958, 1899],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 11,
    staticCode: 'PRESTA_STALL_2',
    name: 'Merchant Stall #2',
    description: 'A well-positioned stall in the heart of the market district.',
    price: 150,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [1984, 1893],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 12,
    staticCode: 'PRESTA_STALL_3',
    name: 'Merchant Stall #3',
    description:
      'Currently occupied by a local blacksmith selling tools and weapons.',
    price: 120,
    purchased: true,
    userId: PRESTATAIRE_USER_ID,
    type: 'prestataire',
    position: [2064, 1733],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 13,
    staticCode: 'PRESTA_STALL_4',
    name: 'Merchant Stall #4',
    description:
      'A bustling spot in the marketplace, ideal for attracting customers.',
    price: 130,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [2148, 1569],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  },
  {
    id: 14,
    staticCode: 'PRESTA_STALL_5',
    name: 'Merchant Stall #5',
    description:
      'A popular location among travelers, known for its high foot traffic.',
    price: 140,
    purchased: false,
    userId: null,
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
    purchased: false,
    userId: null,
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
    purchased: false,
    userId: null,
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
    position: [2082, 2465],
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
    position: [2280, 1405],
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
    position: [2164, 1193],
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
    position: [1170, 1973],
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
  {
    id: 41,
    staticCode: 'PRESTA_STALL_32',
    name: 'Merchant Stall #32',
    description:
      'A charming stall with a great view of the castle, perfect for attracting tourists.',
    price: 355,
    purchased: false,
    userId: null,
    type: 'prestataire',
    position: [1008, 2165],
    iconName: 'prestataire',
    bannerImage: 'images/locations/buyable.png'
  }
];