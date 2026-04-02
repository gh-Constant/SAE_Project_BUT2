import { LOCATIONS } from './locations';

// Helper to get location by id
const getLocation = (id: number) => LOCATIONS.find(l => l.id === id);

// Matches backend/src/seeds/quests.ts - hardcoded with IDs and location info
export const QUESTS = [
  // Merchant Stall #5 (location id: 14, prestataire 1)
  { id_quest: 1, title: "Livraison Inter-Stands", description: "Apporter un panier à l'échoppe de la Place.", xp_reward: 60, id_location: 14, validation_code: 'QUEST:NEW:LOC:14:CODE:PRESTA_STALL_5:11111111-1111-4111-8111-111111111111', location: getLocation(14) },
  { id_quest: 2, title: "Rangement Express", description: "Aider le marchand à trier ses caisses vides pendant 5 minutes.", xp_reward: 40, id_location: 14, validation_code: 'QUEST:NEW:LOC:14:CODE:PRESTA_STALL_5:22222222-2222-4222-8222-222222222222', location: getLocation(14) },
  { id_quest: 3, title: "Le Mot Secret", description: "Dire le mot de passe du jour au vendeur.", xp_reward: 50, id_location: 14, validation_code: 'QUEST:NEW:LOC:14:CODE:PRESTA_STALL_5:33333333-3333-4333-8333-333333333333', location: getLocation(14) },
  { id_quest: 4, title: "Vitrine Éclatante", description: "Nettoyer la vitre de présentation pour qu'elle brille.", xp_reward: 30, id_location: 14, validation_code: 'QUEST:NEW:LOC:14:CODE:PRESTA_STALL_5:44444444-4444-4444-8444-444444444444', location: getLocation(14) },
  { id_quest: 5, title: "Inventaire Participatif", description: "Compter le nombre de produits rouges sur l'étalage pour le stock.", xp_reward: 45, id_location: 14, validation_code: 'QUEST:NEW:LOC:14:CODE:PRESTA_STALL_5:55555555-5555-4555-8555-555555555555', location: getLocation(14) },

  // Merchant Stall #6 (location id: 15, prestataire 1)
  { id_quest: 6, title: "L'Objet Intrus", description: "Trouver l'objet anachronique caché dans la décoration du stand.", xp_reward: 50, id_location: 15, validation_code: 'QUEST:NEW:LOC:15:CODE:PRESTA_STALL_6:66666666-6666-4666-8666-666666666666', location: getLocation(15) },
  { id_quest: 7, title: "L'Origine du Monde", description: "Découvrir la provenance exacte de la matière première principale.", xp_reward: 55, id_location: 15, validation_code: 'QUEST:NEW:LOC:15:CODE:PRESTA_STALL_6:77777777-7777-4777-8777-777777777777', location: getLocation(15) },
  { id_quest: 8, title: "Le Marchand", description: "Discuter avec le marchand sur les produits.", xp_reward: 20, id_location: 15, validation_code: 'QUEST:NEW:LOC:15:CODE:PRESTA_STALL_6:88888888-8888-4888-8888-888888888888', location: getLocation(15) },
  { id_quest: 9, title: "Le Gardien du Temps", description: "Relever l'heure exacte d'ouverture affichée sur le petit panneau caché.", xp_reward: 10, id_location: 15, validation_code: 'QUEST:NEW:LOC:15:CODE:PRESTA_STALL_6:99999999-9999-4999-8999-999999999999', location: getLocation(15) },
  { id_quest: 10, title: "Le Mot Secret", description: "Obtenir le mot de passe du jour en discutant avec le vendeur.", xp_reward: 10, id_location: 15, validation_code: 'QUEST:NEW:LOC:15:CODE:PRESTA_STALL_6:aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1', location: getLocation(15) },
  
  // Merchant Stall #7 (location id: 16, prestataire 4)
  { id_quest: 11, title: "Reporter d'un Jour", description: "Interviewer le marchand sur l'histoire de sa boutique (3 questions).", xp_reward: 50, id_location: 16, validation_code: 'QUEST:NEW:LOC:16:CODE:PRESTA_STALL_7:bbbbbbb1-bbbb-4bbb-8bbb-bbbbbbbbbbb1', location: getLocation(16) },
  { id_quest: 12, title: "Mur des Avis", description: "Dire son avis sur le stand.", xp_reward: 20, id_location: 16, validation_code: 'QUEST:NEW:LOC:16:CODE:PRESTA_STALL_7:ccccccc1-cccc-4ccc-8ccc-ccccccccccc1', location: getLocation(16) },
  { id_quest: 13, title: "Compteur", description: "Compter le nombre de personne se présentant au stand.", xp_reward: 30, id_location: 16, validation_code: 'QUEST:NEW:LOC:16:CODE:PRESTA_STALL_7:ddddddd1-dddd-4ddd-8ddd-ddddddddddd1', location: getLocation(16) },
  { id_quest: 14, title: "Dessinateur Amateur", description: "Faire un croquis rapide du stand et l'offrir au marchand.", xp_reward: 55, id_location: 16, validation_code: 'QUEST:NEW:LOC:16:CODE:PRESTA_STALL_7:eeeeeee1-eeee-4eee-8eee-eeeeeeeeeee1', location: getLocation(16) },
  { id_quest: 15, title: "Souvenir Digital", description: "Prendre en photo le stand.", xp_reward: 25, id_location: 16, validation_code: 'QUEST:NEW:LOC:16:CODE:PRESTA_STALL_7:fffffff1-ffff-4fff-8fff-fffffffffff1', location: getLocation(16) },
];
