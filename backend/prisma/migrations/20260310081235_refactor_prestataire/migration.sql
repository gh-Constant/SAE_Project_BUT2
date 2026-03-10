/*
  Warnings:

  - You are about to drop the `blogs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `commande` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event_reservations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ligne_commande` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ligne_panier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `location_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `locations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prestataire_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sevices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userQuests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `blogs` DROP FOREIGN KEY `blogs_id_location_fkey`;

-- DropForeignKey
ALTER TABLE `commande` DROP FOREIGN KEY `commande_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `event_reservations` DROP FOREIGN KEY `event_reservations_id_event_fkey`;

-- DropForeignKey
ALTER TABLE `event_reservations` DROP FOREIGN KEY `event_reservations_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_id_location_fkey`;

-- DropForeignKey
ALTER TABLE `ligne_commande` DROP FOREIGN KEY `ligne_commande_id_commande_fkey`;

-- DropForeignKey
ALTER TABLE `ligne_commande` DROP FOREIGN KEY `ligne_commande_id_product_fkey`;

-- DropForeignKey
ALTER TABLE `ligne_panier` DROP FOREIGN KEY `ligne_panier_id_product_fkey`;

-- DropForeignKey
ALTER TABLE `ligne_panier` DROP FOREIGN KEY `ligne_panier_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `locations` DROP FOREIGN KEY `locations_id_location_type_fkey`;

-- DropForeignKey
ALTER TABLE `locations` DROP FOREIGN KEY `locations_id_prestataire_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_id_prestataire_fkey`;

-- DropForeignKey
ALTER TABLE `quests` DROP FOREIGN KEY `quests_id_location_fkey`;

-- DropForeignKey
ALTER TABLE `sevices` DROP FOREIGN KEY `sevices_id_location_fkey`;

-- DropForeignKey
ALTER TABLE `sevices` DROP FOREIGN KEY `sevices_id_prestataire_fkey`;

-- DropForeignKey
ALTER TABLE `sevices` DROP FOREIGN KEY `sevices_id_service_type_fkey`;

-- DropForeignKey
ALTER TABLE `stock` DROP FOREIGN KEY `stock_id_product_fkey`;

-- DropForeignKey
ALTER TABLE `stock` DROP FOREIGN KEY `stock_id_service_fkey`;

-- DropForeignKey
ALTER TABLE `userQuests` DROP FOREIGN KEY `userQuests_id_quest_fkey`;

-- DropForeignKey
ALTER TABLE `userQuests` DROP FOREIGN KEY `userQuests_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_id_prestataire_type_fkey`;

-- DropTable
DROP TABLE `blogs`;

-- DropTable
DROP TABLE `commande`;

-- DropTable
DROP TABLE `event_reservations`;

-- DropTable
DROP TABLE `events`;

-- DropTable
DROP TABLE `ligne_commande`;

-- DropTable
DROP TABLE `ligne_panier`;

-- DropTable
DROP TABLE `location_type`;

-- DropTable
DROP TABLE `locations`;

-- DropTable
DROP TABLE `prestataire_types`;

-- DropTable
DROP TABLE `products`;

-- DropTable
DROP TABLE `quests`;

-- DropTable
DROP TABLE `service_types`;

-- DropTable
DROP TABLE `sevices`;

-- DropTable
DROP TABLE `stock`;

-- DropTable
DROP TABLE `userQuests`;

-- DropTable
DROP TABLE `users`;
