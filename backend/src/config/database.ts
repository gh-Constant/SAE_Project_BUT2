import mysql from 'mysql2/promise';

// Database configuration interface
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

// Get database configuration from environment variables
export const getDatabaseConfig = (): DatabaseConfig => {
  // Check if DATABASE_URL is provided
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    try {
      const url = new URL(databaseUrl);
      return {
        host: url.hostname,
        port: url.port ? parseInt(url.port, 10) : 3306,
        username: url.username,
        password: url.password,
        database: url.pathname.slice(1), // Remove leading slash
      };
    } catch (error) {
      console.warn('Invalid DATABASE_URL, falling back to individual variables:', error);
    }
  }

  // Fallback to individual environment variables
  return {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'sae_project_db',
  };
};

// Create database connection pool
export const createDatabasePool = (config: DatabaseConfig) => {
  return mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
  });
};

// Test database connection
export const testDatabaseConnection = async (pool: mysql.Pool): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Close database connection pool
export const closeDatabasePool = async (pool: mysql.Pool): Promise<void> => {
  try {
    await pool.end();
    console.log('✅ Database connection pool closed');
  } catch (error) {
    console.error('❌ Error closing database connection pool:', error);
  }
};