export interface QuestMock {
  id: number;
  title: string;
  description?: string;
  xpReward: number;
  id_location: number;
}

export const QUESTS: QuestMock[] = [
  // Château Principal (id: 1)
  { id: 1, title: "Récupérer l'épée du roi", description: "Retrouver l'épée légendaire du roi dans les donjons du château.", xpReward: 150, id_location: 1 },
  { id: 2, title: "Protéger le trône", description: "Monter la garde devant la salle du trône pendant la cérémonie.", xpReward: 75, id_location: 1 },
  { id: 3, title: "Livrer un message royal", description: "Apporter un message urgent au conseiller du roi.", xpReward: 25, id_location: 1 },
  
  // Forge du Village (id: 2)
  { id: 4, title: "Collecter du minerai", description: "Rapporter 10 unités de minerai de fer de la mine.", xpReward: 50, id_location: 2 },
  { id: 5, title: "Forger une épée", description: "Aider le forgeron à créer une épée pour les gardes.", xpReward: 100, id_location: 2 },
  
  // Taverne du Dragon Noir (id: 3)
  { id: 6, title: "Servir les clients", description: "Aider le tavernier pendant l'heure de pointe.", xpReward: 30, id_location: 3 },
  { id: 7, title: "Résoudre une bagarre", description: "Calmer une dispute entre deux clients mécontents.", xpReward: 45, id_location: 3 },
  { id: 8, title: "Trouver le voleur", description: "Identifier qui a volé la bourse du marchand.", xpReward: 80, id_location: 3 },
  
  // Tour des Mages (id: 4)
  { id: 9, title: "Collecter des herbes magiques", description: "Récolter 5 herbes rares pour les potions.", xpReward: 60, id_location: 4 },
  { id: 10, title: "Apprenti du mage", description: "Assister le mage dans ses expériences pendant une journée.", xpReward: 120, id_location: 4 },
  { id: 11, title: "Décrypter un parchemin", description: "Traduire un ancien parchemin magique.", xpReward: 200, id_location: 4 },
  
  // Marché Central (id: 5)
  { id: 12, title: "Livraison express", description: "Livrer 5 colis avant la fermeture du marché.", xpReward: 35, id_location: 5 },
  { id: 13, title: "Négocier un prix", description: "Obtenir une réduction de 20% sur un objet rare.", xpReward: 40, id_location: 5 },
  
  // Écuries Royales (id: 6)
  { id: 14, title: "Soigner un cheval", description: "Aider le palefrenier à soigner un cheval blessé.", xpReward: 55, id_location: 6 },
  { id: 15, title: "Course de chevaux", description: "Participer à la course annuelle et finir dans le top 3.", xpReward: 175, id_location: 6 },
  
  // Bibliothèque Ancienne (id: 7)
  { id: 16, title: "Ranger les archives", description: "Classer les documents historiques par époque.", xpReward: 20, id_location: 7 },
  { id: 17, title: "Recherche historique", description: "Trouver des informations sur la bataille de 1347.", xpReward: 65, id_location: 7 },
  
  // Port des Marchands (id: 8)
  { id: 18, title: "Décharger un navire", description: "Aider à décharger les marchandises du nouveau navire.", xpReward: 45, id_location: 8 },
  { id: 19, title: "Escorter un marchand", description: "Accompagner un marchand jusqu'à la ville voisine.", xpReward: 90, id_location: 8 },
  { id: 20, title: "Pêche miraculeuse", description: "Attraper le poisson légendaire du port.", xpReward: 250, id_location: 8 },
];