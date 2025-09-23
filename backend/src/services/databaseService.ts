/**
 * @file databaseService.ts
 * @description
 * Service pour gérer la connexion et les opérations sur la base de données MySQL.
 * Fournit des méthodes pour initialiser la base, exécuter des requêtes, gérer des transactions et fermer le pool.
 *
 * @utilité
 * - Centralise la logique de connexion et d'interaction avec la base de données.
 * - Permet d'exécuter des requêtes simples ou des transactions complexes.
 * - Facilite l'initialisation du schéma de la base depuis un fichier SQL.
 * - Fournit une interface unique pour accéder au pool MySQL.
 *
 * @exports
 * - DatabaseService : classe permettant de gérer les opérations sur la base.
 * - databaseService : instance singleton prête à l'emploi (c'est elle qu'on va surtout utilisé).
 *
 * @remarques
 * - L'initialisation doit être effectuée avant
 * - TODO: Les fichiers SQL sont recherchés dans plusieurs chemins à cause de certains problémes au déploiement (à changer)
 * - Les transactions utilisent `beginTransaction`, `commit` et `rollback` pour assurer l'intégrité des données.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { pool, testDatabaseConnection } from '../config/database.js';

// Equivalent ES module de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Service pour gérer les interactions avec la base de données MySQL.
 */
export class DatabaseService {
  public pool: mysql.Pool | null = null;

  /**
   * Initialise la connexion à la base et le schéma si la connexion est réussie.
   */
  async initialize(): Promise<void> {
    try {
      this.pool = pool;
      const isConnected = await testDatabaseConnection();

      if (isConnected) {
        console.log('🔧 Initializing database schema....');
        await this.initializeDatabase();
        console.log('✅ Database initialization completed');
      } else {
        throw new Error('Failed to establish database connection');
      }
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Initialise le schéma de la base à partir du fichier SQL.
   * Cherche le fichier dans plusieurs chemins possibles.
   */
  private async initializeDatabase(): Promise<void> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    try {
      const possiblePaths = [
        path.resolve(process.cwd(), 'database/database.sql'),
        path.resolve(process.cwd(), 'backend/database/database.sql'),
        path.resolve(__dirname, '../../database/database.sql')
      ];

      let sqlFilePath: string | null = null;
      for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
          sqlFilePath = filePath;
          break;
        }
      }

      if (!sqlFilePath) {
        throw new Error(`Could not find database.sql file in any of the expected locations: ${possiblePaths.join(', ')}`);
      }
      const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

      await this.pool.query(sqlContent);
      console.log('✅ Database schema initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize database schema:', error);
      throw error;
    }
  }

  /**
   * Retourne le pool de connexions MySQL.
   */
  getPool(): mysql.Pool {
    if (!this.pool) {
      throw new Error('Database pool not initialized. Call initialize() first.');
    }
    return this.pool;
  }

  /**
   * Ferme le pool de connexions.
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }


  // Probléme : Premiére requete plus lente, mais plus besoin de se soucier que le service ne soit pas initialisé
  private async ensureInitialized(): Promise<void> {
    if (!this.pool) {
      await this.initialize(); // initialise automatiquement si ce n'est pas fait
    }
  }

  /**
   * Exécute une requête SQL avec paramètres optionnels.
   * @param sql - Requête SQL
   * @param params - Paramètres optionnels pour la requête
   * @returns Résultat de la requête
   */
  async query(sql: string, params: any[] = []): Promise<any> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    try {
      await this.ensureInitialized();
      const [rows] = await this.pool!.query(sql, params);
      return rows;
    } catch (error) {
      console.error('❌ Database query failed:', error);
      throw error;
    }
  }

  /**
   * Exécute une transaction MySQL.
   * @param callback - Fonction recevant la connexion pour exécuter des requêtes transactionnelles
   * @returns Résultat de la transaction
   */
  async transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

// Export singleton prêt à l'emploi
export const databaseService = new DatabaseService();
