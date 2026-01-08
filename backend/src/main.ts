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
import { createApp } from './app.js';
import { config } from './config/app.config.js';
import { seedPrestataireTypes } from './seeds/prestataireTypes.js';
import { seedLocationTypes } from './seeds/LocationTypes.js';
import { seedLocations } from './seeds/locations.js';
import { seedUsers } from './seeds/users.js';
import { seedServiceTypes } from './seeds/serviceTypes.js';
import { seedServices } from './seeds/services.js';
import { seedProducts } from './seeds/products.js';
import { seedEvents } from './seeds/events.js';
import { seedBlogs } from './seeds/blogs.js';
import { seedQuests } from './seeds/quests.js';
import { seedUserQuests } from './seeds/userQuests.js';
import { seedQuizzes } from './seeds/quizzes.js';
import { seedQuizAttempts } from './seeds/quizAttempts.js';
import { seedOrders } from './seeds/orders.js';

/**
 * Fonction principale pour démarrer le serveur.
 */
const startServer = async (): Promise<void> => {
  try {
    // Initialisation de la base avec les types de base
    await seedPrestataireTypes();
    await seedLocationTypes();
    await seedUsers(); // Users must be seeded BEFORE locations (FK constraint)
    await seedLocations();

    // New seeders
    await seedServiceTypes();
    await seedServices();
    await seedProducts();
    await seedEvents();
    await seedEvents();
    await seedBlogs();
    await seedQuests();
    await seedUserQuests();
    await seedQuizzes();
    await seedQuizAttempts();
    await seedOrders();


    // Création de l'application Express
    const app = createApp();

    // Démarrage du serveur
    const server = app.listen(config.port, config.host, () => {
      console.log(` Server running on http://${config.host}:${config.port}`);
      console.log(` Environment: ${config.nodeEnv}`);
      console.log(` Started at: ${new Date().toISOString()}`);
    });

    /**
     * Gestion de l'arrêt gracieux du serveur
     * @param signal - Signal reçu (SIGTERM ou SIGINT)
     */
    const gracefulShutdown = async (signal: string) => {
      console.log(` ${signal} received, shutting down gracefully...`);
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
