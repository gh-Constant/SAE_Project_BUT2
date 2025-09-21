import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { getDatabaseConfig, createDatabasePool, testDatabaseConnection } from '../config/database.js';

// Database service class
export class DatabaseService {
  private pool: mysql.Pool | null = null;
  private config = getDatabaseConfig();

  // Initialize database connection
  async initialize(): Promise<void> {
    try {
      this.pool = createDatabasePool(this.config);
      const isConnected = await testDatabaseConnection(this.pool);

      if (isConnected) {
        console.log('🔧 Initializing database schema...');
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
      const sqlFilePath = path.resolve(process.cwd(), 'backend/database/database.sql');
      const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

      // Split SQL content by statements (basic approach)
      const statements = this.splitSqlStatements(sqlContent);

      // Execute each statement
      for (const statement of statements) {
        if (statement.trim()) {
          await this.pool.execute(statement);
        }
      }

      console.log('✅ Database schema initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize database schema:', error);
      throw error;
    }
  }

  // Split SQL content into individual statements
  private splitSqlStatements(sqlContent: string): string[] {
    const statements: string[] = [];
    let currentStatement = '';
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < sqlContent.length; i++) {
      const char = sqlContent[i];
      const prevChar = sqlContent[i - 1];

      // Handle string literals
      if ((char === '"' || char === "'") && prevChar !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = '';
        }
      }

      // Handle statement separators
      if (!inString && char === ';') {
        currentStatement += char;
        statements.push(currentStatement.trim());
        currentStatement = '';
      } else {
        currentStatement += char;
      }
    }

    // Add remaining statement if any
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }

    return statements;
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
      const [rows] = await this.pool.execute(sql, params);
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