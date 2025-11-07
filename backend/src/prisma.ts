// Singleton prisma instance
import { PrismaClient } from "@prisma/client";
export type { User, Quest, UserQuest, UserQuestStatus, ServiceType, LocationType, Location, Activity, Service, PrestataireType, Prestataire, EtatCommande, Product, Commande, LignePanier, Stock, LigneCommande  } from '@prisma/client'
export {Role, AvatarType} from '@prisma/client'

const prisma = new PrismaClient();

export default prisma;
