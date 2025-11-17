export interface ServiceTypeMock {
    id: number;
    name: string;
}

export enum ServiceType {
  SHOP_SERVICE_TYPE_ID = 1,
  RESERVATION_SERVICE_TYPE_ID = 2,
  BLOG_SERVICE_TYPE_ID = 3,
  RESTAURANT_SERVICE_TYPE_ID = 4,
  QUEST_SERVICE_TYPE_ID = 5,
  QUIZ_SERVICE_TYPE_ID = 6,
}

export const SERVICE_TYPES: ServiceTypeMock[] = [
  { id: ServiceType.SHOP_SERVICE_TYPE_ID, name: 'shop' },
  { id: ServiceType.RESERVATION_SERVICE_TYPE_ID, name: 'reservation' },
  { id: ServiceType.BLOG_SERVICE_TYPE_ID, name: 'blog' },
  { id: ServiceType.RESTAURANT_SERVICE_TYPE_ID, name: 'restaurant' },
  { id: ServiceType.QUEST_SERVICE_TYPE_ID, name: 'quest' },
  { id: ServiceType.QUIZ_SERVICE_TYPE_ID, name: 'quiz' },
];