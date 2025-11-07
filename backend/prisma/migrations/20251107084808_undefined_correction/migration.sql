/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `title` on table `activities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `end_time` on table `activities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start_time` on table `activities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date_commande` on table `commande` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_price` on table `commande` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantite` on table `ligne_commande` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `ligne_commande` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantite` on table `ligne_panier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `ligne_panier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `locations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `position` on table `locations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `prestataire` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `prestataire_types` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `service_types` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `sevices` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stock` on table `stock` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstname` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastname` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password_hashed` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `avatar_url` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_verified` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `xp` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `level` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `locations` DROP FOREIGN KEY `locations_id_prestataire_fkey`;

-- AlterTable
ALTER TABLE `activities` MODIFY `title` VARCHAR(255) NOT NULL,
    MODIFY `end_time` DATETIME(0) NOT NULL,
    MODIFY `start_time` DATETIME(0) NOT NULL;

-- AlterTable
ALTER TABLE `commande` MODIFY `date_commande` DATETIME(0) NOT NULL,
    MODIFY `total_price` DECIMAL(15, 2) NOT NULL;

-- AlterTable
ALTER TABLE `ligne_commande` MODIFY `quantite` INTEGER NOT NULL,
    MODIFY `price` DECIMAL(15, 2) NOT NULL;

-- AlterTable
ALTER TABLE `ligne_panier` MODIFY `quantite` INTEGER NOT NULL,
    MODIFY `price` DECIMAL(15, 2) NOT NULL;

-- AlterTable
ALTER TABLE `locations` MODIFY `price` DECIMAL(15, 2) NOT NULL,
    MODIFY `id_prestataire` INTEGER NULL,
    MODIFY `position` JSON NOT NULL;

-- AlterTable
ALTER TABLE `prestataire` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `prestataire_types` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `products` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `price` DECIMAL(15, 2) NOT NULL;

-- AlterTable
ALTER TABLE `service_types` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `sevices` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `stock` MODIFY `stock` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `avatar_type` ENUM('gallery', 'upload') NOT NULL DEFAULT 'gallery',
    MODIFY `firstname` VARCHAR(255) NOT NULL,
    MODIFY `lastname` VARCHAR(255) NOT NULL,
    MODIFY `email` VARCHAR(255) NOT NULL,
    MODIFY `password_hashed` TEXT NOT NULL,
    MODIFY `avatar_url` VARCHAR(255) NOT NULL,
    MODIFY `is_verified` BOOLEAN NOT NULL,
    MODIFY `xp` DOUBLE NOT NULL,
    MODIFY `level` INTEGER NOT NULL,
    MODIFY `birth_date` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);

-- AddForeignKey
ALTER TABLE `locations` ADD CONSTRAINT `locations_id_prestataire_fkey` FOREIGN KEY (`id_prestataire`) REFERENCES `prestataire`(`id_prestataire`) ON DELETE SET NULL ON UPDATE CASCADE;
