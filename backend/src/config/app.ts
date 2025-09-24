/**
 * @file app.ts
 * @description
 * Configuration principale de l'application.
 * Fournit les paramètres d'environnement, la configuration CORS et les paramètres spécifiques à l'API.
 *
 * @utilité
 * - Centralise toutes les variables de configuration de l'application.
 * - Définit le comportement de CORS pour les environnements de développement et de production.
 * - Fournit des paramètres pour la version et le préfixe de l'API ainsi que le rate limiting.
 *
 * @exports
 * - config : configuration générale de l'application (host, port, environnement).
 * - corsOptions : configuration CORS utilisée par le middleware cors.
 * - apiConfig : configuration spécifique à l'API (préfixe, version, rate limiting).
 *
 * @remarques
 * - Les valeurs par défaut sont fournies si les variables d'environnement ne sont pas définies.
 * - corsOptions autorise plusieurs origines pour supporter local/dev et production HTTP/HTTPS.
 * - apiConfig peut être étendu pour inclure d'autres paramètres liés à l'API.
 */

import { CorsOptions } from 'cors';

/**
 * Configuration générale de l'application (pas de la base de données).
 */
export const config = {
  host: process.env.HOST ?? 'localhost',
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

/**
 * Configuration CORS pour le middleware `cors`.
 */
export const corsOptions: CorsOptions = {
  origin: [
    'http://localhost:4200',                    // Frontend local en développement     // Frontend on same port as backend
    'https://livrable.constantsuchet.fr',       // Frontend production HTTPS
    'http://livrable.constantsuchet.fr'         // Frontend production HTTP
  ],
  credentials: true,                            // Autorise l'envoi de cookies
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Méthodes autorisées
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Headers autorisés
};

/**
 * Configuration spécifique à l'API.
 */
export const apiConfig = {
  prefix: '/api',                               // Préfixe pour toutes les routes API
  version: 'v1',                                // Version de l'API
  rateLimit: {                                  // Paramètres pour limiter les requêtes
    windowMs: 15 * 60 * 1000,                   // Fenêtre de 15 minutes
    max: 100,                                   // Maximum 100 requêtes par fenêtre
  },
} as const;
