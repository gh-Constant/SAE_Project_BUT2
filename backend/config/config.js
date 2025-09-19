import dotenv from 'dotenv';

dotenv.config();

const getDevConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      url: process.env.DATABASE_URL,
      dialect: 'postgres',
    };
  } else {
    return {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      dialect: 'postgres',
    };
  }
};

const config = {
  development: getDevConfig(),
  test: getDevConfig(),
  production: {
    url: '',
    dialect: 'postgres',
  },
};

export default config;