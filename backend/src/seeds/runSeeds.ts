import 'dotenv/config';
import { seedPrestataireTypes } from './prestataireTypes.js';
import { seedLocationTypes } from './LocationTypes.js';
import { seedUsers } from './users.js';
import { seedPrestataires } from './prestataires.js';
import { seedLocations } from './locations.js';
import { seedServiceTypes } from './serviceTypes.js';
import { seedServices } from './services.js';
import { seedProducts } from './products.js';
import { seedEvents } from './events.js';
import { seedBlogs } from './blogs.js';
import { seedQuests } from './quests.js';
import { seedUserQuests } from './userQuests.js';
import { seedQuizzes } from './quizzes.js';
import { seedQuizAttempts } from './quizAttempts.js';
import { seedOrders } from './orders.js';
import { seedReservations } from './reservations.js';

const runSeeds = async () => {
  try {
    console.log('Starting backend seeds...');

    await seedPrestataireTypes();
    await seedLocationTypes();
    await seedUsers();
    await seedPrestataires();
    await seedLocations();

    await seedServiceTypes();
    await seedServices();
    await seedProducts();
    await seedEvents();
    await seedBlogs();
    await seedQuests();
    await seedUserQuests();
    await seedQuizzes();
    await seedQuizAttempts();
    await seedOrders();
    await seedReservations();

    console.log('All backend seeds completed.');
    process.exit(0);
  } catch (error) {
    console.error('Seed execution failed:', error);
    process.exit(1);
  }
};

runSeeds();
