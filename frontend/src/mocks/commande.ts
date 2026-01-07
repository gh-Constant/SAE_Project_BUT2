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

// Helper pour créer des dates passées
const daysAgo = (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
};

// Hardcoded demo orders for demo user (Alice, id: 2)
const DEMO_COMMANDES: CommandeMock[] = [
    // === Commandes PAID (environ 40%) ===
    {
        id: 1,
        date_commande: daysAgo(1),
        total_price: 47.00,
        id_user: 2,
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.PAID,
        qrToken: 'QR-001-PAID'
    },
    {
        id: 2,
        date_commande: daysAgo(3),
        total_price: 29.00,
        id_user: 2,
        id_prestataire: 1,
        id_location: 15,
        etat_commande: EtatCommande.PAID,
        qrToken: 'QR-002-PAID'
    },
    {
        id: 3,
        date_commande: daysAgo(5),
        total_price: 77.50,
        id_user: 2,
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.PAID,
        qrToken: 'QR-003-PAID'
    },
    {
        id: 4,
        date_commande: daysAgo(7),
        total_price: 12.00,
        id_user: 2,
        id_prestataire: 4,
        id_location: 16,
        etat_commande: EtatCommande.PAID,
        qrToken: 'QR-004-PAID'
    },
    {
        id: 5,
        date_commande: daysAgo(10),
        total_price: 95.00,
        id_user: 2,
        id_prestataire: 1,
        id_location: 15,
        etat_commande: EtatCommande.PAID,
        qrToken: 'QR-005-PAID'
    },
    {
        id: 6,
        date_commande: daysAgo(12),
        total_price: 22.00,
        id_user: 2,
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.PAID,
        qrToken: 'QR-006-PAID'
    },
    {
        id: 7,
        date_commande: daysAgo(15),
        total_price: 157.00,
        id_user: 2,
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.PAID,
        qrToken: 'QR-007-PAID'
    },

    // === Commandes COLLECTED (environ 30%) ===
    {
        id: 8,
        date_commande: daysAgo(2),
        date_collect: daysAgo(1),
        total_price: 35.50,
        id_user: 2,
        id_prestataire: 1,
        id_location: 15,
        etat_commande: EtatCommande.COLLECTED
    },
    {
        id: 9,
        date_commande: daysAgo(8),
        date_collect: daysAgo(7),
        total_price: 68.90,
        id_user: 2,
        id_prestataire: 4,
        id_location: 16,
        etat_commande: EtatCommande.COLLECTED
    },
    {
        id: 10,
        date_commande: daysAgo(14),
        date_collect: daysAgo(12),
        total_price: 110.00,
        id_user: 2,
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.COLLECTED
    },
    {
        id: 11,
        date_commande: daysAgo(20),
        date_collect: daysAgo(18),
        total_price: 45.00,
        id_user: 2,
        id_prestataire: 1,
        id_location: 15,
        etat_commande: EtatCommande.COLLECTED
    },
    {
        id: 12,
        date_commande: daysAgo(25),
        date_collect: daysAgo(23),
        total_price: 8.50,
        id_user: 2,
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.COLLECTED
    },

    // === Commandes WAITING (environ 30%) ===
    {
        id: 13,
        date_commande: daysAgo(0),
        total_price: 25.50,
        id_user: 2,
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.WAITING
    },
    {
        id: 14,
        date_commande: daysAgo(1),
        total_price: 7.00,
        id_user: 2,
        id_prestataire: 1,
        id_location: 15,
        etat_commande: EtatCommande.WAITING
    },
    {
        id: 15,
        date_commande: daysAgo(2),
        total_price: 37.80,
        id_user: 2,
        id_prestataire: 4,
        id_location: 16,
        etat_commande: EtatCommande.WAITING
    },
    {
        id: 16,
        date_commande: daysAgo(4),
        total_price: 55.00,
        id_user: 2,
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.WAITING
    },
    {
        id: 17,
        date_commande: daysAgo(6),
        total_price: 125.00,
        id_user: 2,
        id_prestataire: 1,
        id_location: 15,
        etat_commande: EtatCommande.WAITING
    },
    {
        id: 18,
        date_commande: daysAgo(9),
        total_price: 18.90,
        id_user: 2,
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.WAITING
    }
];

// Initialize from localStorage or fallback to demo data
function initializeCommandes(): CommandeMock[] {
    const stored = localStorage.getItem('mock_commandes');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // Convert date strings back to Date objects
            return parsed.map((cmd: any) => ({
                ...cmd,
                date_commande: new Date(cmd.date_commande),
                date_collect: cmd.date_collect ? new Date(cmd.date_collect) : undefined
            }));
        } catch (e) {
            console.warn('Failed to parse stored commandes, using demo data');
            return [...DEMO_COMMANDES];
        }
    }
    return [...DEMO_COMMANDES];
}

// Export mutable array that gets initialized
export const COMMANDES: CommandeMock[] = initializeCommandes();

// Save commandes to localStorage
export function saveCommandes() {
    localStorage.setItem('mock_commandes', JSON.stringify(COMMANDES));
}

// Reset to demo data (for testing)
export function resetCommandes() {
    localStorage.removeItem('mock_commandes');
    COMMANDES.length = 0;
    COMMANDES.push(...DEMO_COMMANDES);
}