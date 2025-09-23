/**
 * @file database.ts
 * @description
 * Gestion de la connexion à la base de données MySQL via mysql2/promise.
 * Fournit un pool de connexions réutilisable et des fonctions utilitaires pour tester et fermer la connexion.
 *
 * @utilité
 * - Centralise la configuration et la création du pool de connexions MySQL.
 * - Permet de tester rapidement si la base de données est accessible.
 * - Facilite la fermeture propre du pool de connexions lors de l'arrêt de l'application.
 *
 * @exports
 * - pool : pool de connexions MySQL utilisé dans toute l'application.
 * - testDatabaseConnection : fonction pour vérifier la disponibilité de la base.
 * - closeDatabasePool : fonction pour fermer proprement le pool de connexions.
 *
 * @remarques
 * - La configuration de la base peut provenir de DATABASE_URL (ex: Heroku) ou des variables DB_HOST, DB_PORT, etc.
 * - Le pool est configuré avec une limite de 10 connexions et supporte l'exécution de multiples requêtes dans une seule instruction SQL.
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuration de la base selon l'environnement
let dbConfig;

if (process.env.DATABASE_URL) {
  // Mode production / cloud avec URI unique
  dbConfig = {
    uri: process.env.DATABASE_URL,
  };
} else {
  // Mode local avec paramètres individuels
  dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'sae_project_db',
  };
}

// Création du pool de connexions MySQL
export const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,  // attend si toutes les connexions sont occupées
  connectionLimit: 10,       // nombre maximum de connexions simultanées
  queueLimit: 0,             // pas de limite pour les requêtes en attente
  multipleStatements: true,  // permet d'exécuter plusieurs requêtes dans un seul appel
});

/**
 * Teste la connexion à la base de données.
 * @returns {Promise<boolean>} true si la connexion est réussie, false sinon
 */
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    await connection.ping(); // vérifie que la base répond
    connection.release();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

/**
 * Ferme proprement le pool de connexions.
 */
export const closeDatabasePool = async (): Promise<void> => {
  try {
    await pool.end();
    console.log('✅ Database connection pool closed');
  } catch (error) {
    console.error('❌ Error closing database connection pool:', error);
  }
};
