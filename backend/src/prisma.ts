// Singleton prisma instance
import { PrismaClient } from "@prisma/client";
export type { User, Prestataire, Quest, UserQuest, UserQuestStatus, ServiceType, LocationType, Location, Event, EventReservation, Service, PrestataireType, EtatCommande, Product, Commande, LignePanier, Stock, LigneCommande, OAuthAccount } from '@prisma/client'
export {Role, AvatarType, ReservationStatus, OAuthProvider} from '@prisma/client'

const prisma = new PrismaClient();

export default prisma;
