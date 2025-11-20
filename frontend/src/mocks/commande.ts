export enum EtatCommande {
    WAITING = 'waiting',
    PAYED = 'payed',
    COLLECTED = 'collected',
}

export interface CommandeMock {
    id: number;
    date_commande: Date;
    date_collect?: Date;
    total_price: number;
    
    id_user: number;
    id_prestataire: number; // Prestataire concerné par cette commande
    etat_commande: EtatCommande;
}

export const COMMANDES: CommandeMock[] = [
];