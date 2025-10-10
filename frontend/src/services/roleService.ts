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
export const ADMIN_ROLE_ID = 3;
export const PRESTATAIRE_ROLE_ID = 2;
export const AVENTURIER_ROLE_ID = 1;

// Utility functions
export function isAdmin(user: any): boolean {
  return user?.roleId === ADMIN_ROLE_ID;
}

export function isPrestataire(user: any): boolean {
  return user?.roleId === PRESTATAIRE_ROLE_ID;
}

export function isAventurier(user: any): boolean {
  return user?.roleId === AVENTURIER_ROLE_ID;
}