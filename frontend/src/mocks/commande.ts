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

// Helper pour créer des dates pendant le festival (20/06/2026 - 05/07/2026)
const daysAgo = (dayOffset: number): Date => {
    const festivalStart = new Date('2026-06-20T10:00:00');
    const date = new Date(festivalStart);
    date.setDate(festivalStart.getDate() + dayOffset);
    return date;
};

// Hardcoded demo orders for demo user (Alice, id: 2)
const DEMO_COMMANDES: CommandeMock[] = [
    // === Commandes PAID (environ 40%) ===
    {
        id: 1,
        date_commande: daysAgo(1),
        total_price: 4700,
        id_user: 2,
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.PAID,
        qrToken: 'QR-001-PAID'
    },
    {
        id: 2,
        date_commande: daysAgo(3),
        total_price: 2900,
        id_user: 2,
        id_prestataire: 1,
        id_location: 15,
        etat_commande: EtatCommande.PAID,
        qrToken: 'QR-002-PAID'
    },
    {
        id: 3,
        date_commande: daysAgo(5),
        total_price: 7750,
        id_user: 2,
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.PAID,
        qrToken: 'QR-003-PAID'
    },
    {
        id: 4,
        date_commande: daysAgo(7),
        total_price: 1200,
        id_user: 2,
        id_prestataire: 4,
        id_location: 16,
        etat_commande: EtatCommande.PAID,
        qrToken: 'QR-004-PAID'
    },
    {
        id: 5,
        date_commande: daysAgo(10),
        total_price: 9500,
        id_user: 2,
        id_prestataire: 1,
        id_location: 15,
        etat_commande: EtatCommande.PAID,
        qrToken: 'QR-005-PAID'
    },
    {
        id: 6,
        date_commande: daysAgo(12),
        total_price: 2200,
        id_user: 2,
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.PAID,
        qrToken: 'QR-006-PAID'
    },
    {
        id: 7,
        date_commande: daysAgo(15),
        total_price: 15700,
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
        total_price: 3550,
        id_user: 2,
        id_prestataire: 1,
        id_location: 15,
        etat_commande: EtatCommande.COLLECTED
    },
    {
        id: 9,
        date_commande: daysAgo(8),
        date_collect: daysAgo(7),
        total_price: 6890,
        id_user: 2,
        id_prestataire: 4,
        id_location: 16,
        etat_commande: EtatCommande.COLLECTED
    },
    {
        id: 10,
        date_commande: daysAgo(14),
        date_collect: daysAgo(12),
        total_price: 11000,
        id_user: 2,
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.COLLECTED
    },
    {
        id: 11,
        date_commande: daysAgo(20),
        date_collect: daysAgo(18),
        total_price: 4500,
        id_user: 2,
        id_prestataire: 1,
        id_location: 15,
        etat_commande: EtatCommande.COLLECTED
    },
    {
        id: 12,
        date_commande: daysAgo(25),
        date_collect: daysAgo(23),
        total_price: 850,
        id_user: 2,
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.COLLECTED
    },

    // === Commandes WAITING (environ 30%) ===
    {
        id: 13,
        date_commande: daysAgo(0),
        total_price: 2550,
        id_user: 2,
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.WAITING
    },
    {
        id: 14,
        date_commande: daysAgo(1),
        total_price: 700,
        id_user: 2,
        id_prestataire: 1,
        id_location: 15,
        etat_commande: EtatCommande.WAITING
    },
    {
        id: 15,
        date_commande: daysAgo(2),
        total_price: 3780,
        id_user: 2,
        id_prestataire: 4,
        id_location: 16,
        etat_commande: EtatCommande.WAITING
    },
    {
        id: 16,
        date_commande: daysAgo(4),
        total_price: 5500,
        id_user: 2,
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.WAITING
    },
    {
        id: 17,
        date_commande: daysAgo(6),
        total_price: 12500,
        id_user: 2,
        id_prestataire: 1,
        id_location: 15,
        etat_commande: EtatCommande.WAITING
    },
    {
        id: 18,
        date_commande: daysAgo(9),
        total_price: 1890,
        id_user: 2,
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.WAITING
    },

    // === Commandes New Adventurers ===
    {
        id: 19,
        date_commande: daysAgo(1),
        total_price: 3000,
        id_user: 11, // Lucas
        id_prestataire: 1, // Gérard (Flèches are sold there?) or Marie. Assuming Gérard based on products.
        id_location: 14,
        etat_commande: EtatCommande.PAID,
        qrToken: 'QR-019-PAID'
    },
    {
        id: 20,
        date_commande: daysAgo(0),
        total_price: 5500,
        id_user: 11, // Lucas
        id_prestataire: 1, 
        id_location: 15,
        etat_commande: EtatCommande.WAITING
    },
    {
        id: 21,
        date_commande: daysAgo(2),
        date_collect: daysAgo(1),
        total_price: 850,
        id_user: 12, // Sophie
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.COLLECTED
    },
    {
        id: 22,
        date_commande: daysAgo(5),
        total_price: 7000,
        id_user: 13, // Antoine
        id_prestataire: 1,
        id_location: 15,
        etat_commande: EtatCommande.PAID,
        qrToken: 'QR-022-PAID'
    },
    {
        id: 23,
        date_commande: daysAgo(0),
        total_price: 3500,
        id_user: 13, // Antoine
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.WAITING
    },
    {
        id: 24,
        date_commande: daysAgo(3),
        total_price: 2550,
        id_user: 13, // Antoine
        id_prestataire: 1,
        id_location: 15,
        etat_commande: EtatCommande.PAID,
        qrToken: 'QR-024-PAID'
    },
    {
        id: 25,
        date_commande: daysAgo(4),
        date_collect: daysAgo(2),
        total_price: 4500,
        id_user: 14, // Clara
        id_prestataire: 1,
        id_location: 15,
        etat_commande: EtatCommande.COLLECTED
    },
    {
        id: 26,
        date_commande: daysAgo(1),
        total_price: 5100,
        id_user: 15, // Marc
        id_prestataire: 1,
        id_location: 14,
        etat_commande: EtatCommande.PAID,
        qrToken: 'QR-026-PAID'
    },
    {
        id: 27,
        date_commande: daysAgo(0),
        total_price: 2200,
        id_user: 15, // Marc
        id_prestataire: 1,
        id_location: 15,
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