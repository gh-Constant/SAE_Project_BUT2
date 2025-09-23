/**
 * @file main.ts
 * @description
 * Point d'entrée principal de l'application.
 * Charge les variables d'environnement, initialise la base de données, crée l'application Express et démarre le serveur.
 * Gère également l'arrêt gracieux du serveur et la fermeture des connexions à la base de données.
 *
 * @utilité
 * - Centralise le démarrage de l'application et la configuration initiale.
 * - Assure que la base de données est prête avant de lancer le serveur.
 * - Fournit un mécanisme de shutdown gracieux pour fermer proprement le serveur et la base de données.
 *
 * @remarques
 * - Les signaux SIGTERM et SIGINT sont capturés pour effectuer un arrêt contrôlé.
 * - Toute erreur lors de l'initialisation de la base ou du serveur provoque l'arrêt du processus avec code 1.
 */

import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement depuis le fichier .env à la racine du projet
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { createApp } from './app.js';
import { config } from './config/app.js';
import { databaseService } from './services/databaseService.js';

/**
 * Fonction principale pour démarrer le serveur.
 */
const startServer = async (): Promise<void> => {
  try {
    // Initialisation de la base de données
    console.log('🔧 Initializing database connection...');
    await databaseService.initialize();

    // Création de l'application Express
    const app = createApp();

    // Démarrage du serveur
    const server = app.listen(config.port, config.host, () => {
      console.log(`🚀 Server running on http://${config.host}:${config.port}`);
      console.log(`📱 Environment: ${config.nodeEnv}`);
      console.log(`⏰ Started at: ${new Date().toISOString()}`);
    });

    /**
     * Gestion de l'arrêt gracieux du serveur
     * @param signal - Signal reçu (SIGTERM ou SIGINT)
     */
    const gracefulShutdown = async (signal: string) => {
      console.log(`🛑 ${signal} received, shutting down gracefully...`);

      try {
        // Fermeture de la connexion à la base de données
        await databaseService.close();
        console.log('✅ Database connection closed');
      } catch (error) {
        console.error('❌ Error closing database connection:', error);
      }

      // Fermeture du serveur
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    };

    // Écoute des signaux pour arrêt gracieux
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1); // Arrêt avec code d'erreur
  }
};

// Lancer le serveur
startServer();
