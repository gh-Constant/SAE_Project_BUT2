export enum EtatCommande {
    WAITING = 'waiting',
    PAID = 'paid',
    COLLECTED = 'collected',
}

export interface CommandeMock {
    id: number;
    date_commande: Date;
    date_collect?: Date;
    total_price: number;

    id_user: number;
    id_prestataire: number; // Prestataire concerné par cette commande
    id_location: number; // Location (boutique) concernée par cette commande
    etat_commande: EtatCommande;
    qrToken?: string; // Token QR code pour les commandes payées
}

export const COMMANDES: CommandeMock[] = [
];