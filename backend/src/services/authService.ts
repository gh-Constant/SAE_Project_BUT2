/**
 * @file authService.ts
 * @description
 * Service d'authentification backend pour gérer la connexion, l'inscription et la validation des tokens JWT.
 * Fournit les fonctions de base pour l'authentification des utilisateurs avec Prisma et bcrypt.
 *
 * @utilité
 * - Gère le hashage des mots de passe avec bcrypt.
 * - Crée et valide les tokens JWT pour l'authentification.
 * - Interagit avec la base de données via Prisma pour les opérations utilisateur.
 * - Mappe les rôles string vers les IDs de base de données.
 *
 * @exports
 * - login : fonction de connexion utilisateur.
 * - register : fonction d'inscription utilisateur.
 * - verifyToken : fonction de vérification de token JWT.
 * - getUserFromToken : fonction pour récupérer l'utilisateur depuis un token.
 *
 * @remarques
 * - Utilise bcrypt pour le hashage sécurisé des mots de passe.
 * - Les tokens JWT expirent après 1 heure.
 * - Gestion des erreurs spécifiques pour tokens expirés ou invalides.
 * - TODO: Ajouter la génération de token lors de l'inscription peutétre.
 */

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from "../prisma.js";

// Mapping des rôles string vers les IDs de base de données
const roleMap: { [key: string]: number } = {
  'adventurer': 1, // Rôle aventurier
  'artisan': 2,    // Rôle artisan
};

export async function login(email: string, password: string) {
  // Recherche l'utilisateur par email dans la base de données
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) throw new Error("Utilisateur non trouvé");

  // Vérifie le mot de passe hashé avec bcrypt
  const validPassword = await bcrypt.compare(password, user.passwordHashed);
  if (!validPassword) throw new Error("Mot de passe invalide");

  // Génère un token JWT avec l'ID et l'email utilisateur
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!, // Clé secrète depuis les variables d'environnement
    { expiresIn: "1h" } // Token valide 1 heure
  );

  return { user, token }; // Retourne l'utilisateur et son token
}

export async function register(firstName: string, lastName: string, email: string, password: string, role: string) {
  // Vérifie si l'utilisateur existe déjà
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error("Utilisateur déjà existant");

  // Mappe le rôle string vers l'ID numérique
  const roleId = roleMap[role];
  if (!roleId) throw new Error("Rôle invalide");

  // Hash le mot de passe avec bcrypt (coût 10)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crée le nouvel utilisateur dans la base de données
  return prisma.user.create({
    data: {
      firstname: firstName,
      lastname: lastName,
      email,
      passwordHashed: hashedPassword,
      roleId
    }
  });
}

export async function verifyToken(token: string) {
  try {
    // Décode et vérifie le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string };

    // Vérifie que l'utilisateur existe toujours en base
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      throw new Error("User not found");
    }

    return { user, token }; // Retourne l'utilisateur et le token validé
  } catch (error) {
    // Gestion spécifique des erreurs JWT
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    throw error; // Erreur générique
  }
}

export async function getUserFromToken(token: string) {
  try {
    // Décode le token pour obtenir l'ID utilisateur
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string };

    // Récupère l'utilisateur depuis la base de données
    return await prisma.user.findUnique({
      where: { id: decoded.id }
    });
  } catch (error) {
    return null; // Retourne null en cas d'erreur (token invalide)
  }
}

