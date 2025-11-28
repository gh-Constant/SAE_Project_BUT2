/**
 * @file roleService.ts
 * @description
 * Service pour gérer les rôles des utilisateurs.
 * Fournit les constantes et utilitaires pour les rôles.
 *
 * @utilité
 * - Centraliser les constantes de rôles
 * - Fournir des utilitaires pour vérifier les rôles
 *
 * @exports
 * - ADMIN_ROLE_ID : ID du rôle administrateur
 * - PRESTATAIRE_ROLE_ID : ID du rôle prestataire
 * - AVENTURIER_ROLE_ID : ID du rôle aventurier
 * - isAdmin : fonction pour vérifier si un utilisateur est admin
 * - isPrestataire : fonction pour vérifier si un utilisateur est prestataire
 * - isAventurier : fonction pour vérifier si un utilisateur est aventurier
 */

// Role constants
import { UserMock, Role } from '@/mocks/users';

// Utility functions
export function isAdmin(user: UserMock | null): boolean {
  return user?.role === Role.ADMIN_ROLE_ID;
}

export function isPrestataire(user: UserMock | null): boolean {
  return user?.role === Role.PRESTATAIRE_ROLE_ID;
}

export function isAventurier(user: UserMock | null): boolean {
  return user?.role === Role.AVENTURIER_ROLE_ID;
}