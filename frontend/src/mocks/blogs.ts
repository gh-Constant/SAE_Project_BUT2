export interface Blog {
  id_blog?: number;
  author?: string;
  avatar?: string;
  is_sellable?: boolean;
  is_purchased?: boolean;
  price?: number;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  id_location: number;
}

export const BLOGS: Blog[] = [
  { id_blog: 1, title: 'Le menu des grandes faims est arrive', content: '<p>La Rotisserie du Lion sert des assiettes completes toute la journee. Viande rotie, legumes braises et galettes au miel sont pretes des l ouverture.</p>', created_at: '2026-06-18T08:00:00Z', updated_at: '2026-06-18T08:00:00Z', id_location: 14, is_sellable: false },
  { id_blog: 2, title: 'Carnet de recettes a l hydromel', content: '<p>Un petit guide premium avec trois recettes testees pendant le festival: sauce a l hydromel, poires pochees et marinade de banquet.</p>', created_at: '2026-06-19T09:30:00Z', updated_at: '2026-06-19T09:30:00Z', id_location: 14, is_sellable: true, price: 250 },
  { id_blog: 3, title: 'Comment choisir son accord mets et boisson', content: '<p>Au Cellier des Voyageurs, on vous explique comment associer tourtes, ragouts et hydromels selon vos gouts.</p>', created_at: '2026-06-20T10:15:00Z', updated_at: '2026-06-20T10:15:00Z', id_location: 15, is_sellable: false },
  { id_blog: 4, title: 'Guide pratique pour entretenir son equipement de tir', content: '<p>Marie partage ses gestes de pro pour entretenir cuir, corde et pieces en bois apres une journee d animation.</p>', created_at: '2026-06-20T14:00:00Z', updated_at: '2026-06-20T14:00:00Z', id_location: 16, is_sellable: true, price: 700 },
  { id_blog: 5, title: 'Dans la forge des lanternes, tout commence par un croquis', content: '<p>Avant de marteler le metal, chaque lanterne est pensee pour raconter une histoire. Voici comment naissent les pieces exposees sur le stand.</p>', created_at: '2026-06-21T09:00:00Z', updated_at: '2026-06-21T09:00:00Z', id_location: 17, is_sellable: false },
  { id_blog: 6, title: 'Lire un blason sans se tromper', content: '<p>Ce carnet premium vous apprend a reconnaitre les formes, couleurs et symboles les plus frequents dans les blasons du festival.</p>', created_at: '2026-06-22T11:00:00Z', updated_at: '2026-06-22T11:00:00Z', id_location: 18, is_sellable: true, price: 500 },
  { id_blog: 7, title: 'Trois objets a observer avant de quitter l atelier', content: '<p>Entre le carquois grave, la lanterne ajouree et le panneau heraldique, plusieurs pieces cachent de petits details a reperer sur place.</p>', created_at: '2026-06-23T08:30:00Z', updated_at: '2026-06-23T08:30:00Z', id_location: 17, is_sellable: false }
];
