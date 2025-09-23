import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { pool, testDatabaseConnection } from '../config/database.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database service class
export class DatabaseService {
  public pool: mysql.Pool | null = null;

  // Initialize database connection
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

  // Initialize database schema from SQL file
  private async initializeDatabase(): Promise<void> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    try {
      // Read SQL file
      // Try multiple possible paths for the SQL file
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

      // Execute the entire SQL file
      await this.pool.query(sqlContent);

      console.log('✅ Database schema initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize database schema:', error);
      throw error;
    }
  }

  // Get database connection pool
  getPool(): mysql.Pool {
    if (!this.pool) {
      throw new Error('Database pool not initialized. Call initialize() first.');
    }
    return this.pool;
  }

  // Close database connection
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  // Execute a query
  async query(sql: string, params: any[] = []): Promise<any> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    try {
      const [rows] = await this.pool.query(sql, params);
      return rows;
    } catch (error) {
      console.error('❌ Database query failed:', error);
      throw error;
    }
  }

  // Execute a transaction
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

// Export singleton instance
export const databaseService = new DatabaseService();