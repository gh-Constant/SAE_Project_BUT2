import { Umzug } from 'umzug';
import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
// @ts-ignore
import configJson from '../../config/config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const config = configJson[env];

let sequelize: Sequelize;
if (config.url) {
  sequelize = new Sequelize(config.url, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, '../../migrations/*.js'),
    resolve: ({ name, path: migrationPath, context }) => {
      if (!migrationPath) throw new Error(`Migration path is undefined for ${name}`);
      const migration = import(migrationPath);
      return {
        name,
        up: async () => (await migration).default.up(context, Sequelize),
        down: async () => (await migration).default.down(context, Sequelize),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: {
    async executed() {
      // Get list of executed migrations from SequelizeMeta table
      const [results] = await sequelize.query('SELECT name FROM "SequelizeMeta" ORDER BY name');
      return (results as any[]).map((r: any) => r.name);
    },
    async logMigration({ name }) {
      // Insert migration name into SequelizeMeta table
      await sequelize.query('INSERT INTO "SequelizeMeta" (name) VALUES (?)', {
        replacements: [name],
      });
    },
    async unlogMigration({ name }) {
      // Remove migration name from SequelizeMeta table
      await sequelize.query('DELETE FROM "SequelizeMeta" WHERE name = ?', {
        replacements: [name],
      });
    },
  },
  logger: console,
});

export const runMigrations = async () => {
  try {
    console.log('Running migrations...');
    await umzug.up();
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

export const rollbackMigrations = async (to?: string) => {
  try {
    console.log('Rolling back migrations...');
    await umzug.down({ to });
    console.log('Rollback completed successfully');
  } catch (error) {
    console.error('Rollback failed:', error);
    throw error;
  }
};