/*
  Warnings:

  - The primary key for the `activities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `endTime` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `activities` table. All the data in the column will be lost.
  - The primary key for the `locations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `staticCode` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `locations` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `locations` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(15,2)`.
  - The primary key for the `products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `products` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(15,2)`.
  - The primary key for the `quests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `quests` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `quests` table. All the data in the column will be lost.
  - You are about to drop the column `xpReward` on the `quests` table. All the data in the column will be lost.
  - The primary key for the `roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `roles` table. All the data in the column will be lost.
  - The primary key for the `userQuests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `userQuests` table. All the data in the column will be lost.
  - You are about to drop the column `questId` on the `userQuests` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `userQuests` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `avatar_type` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `prestataireTypeId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `xp` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to drop the `locationServices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prestataireTypes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `services` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_activity` to the `activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_location` to the `activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_location` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_prestataire` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_prestataire` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_product` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_location` to the `quests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_quest` to the `quests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_role` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_quest` to the `userQuests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `userQuests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_role` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `activities` DROP FOREIGN KEY `fk_activities_locationId`;

-- DropForeignKey
ALTER TABLE `locationServices` DROP FOREIGN KEY `fk_locationServices_locationId`;

-- DropForeignKey
ALTER TABLE `locationServices` DROP FOREIGN KEY `fk_locationServices_serviceId`;

-- DropForeignKey
ALTER TABLE `locations` DROP FOREIGN KEY `fk_locations_userId`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `fk_products_locationId`;

-- DropForeignKey
ALTER TABLE `quests` DROP FOREIGN KEY `fk_quests_locationId`;

-- DropForeignKey
ALTER TABLE `userQuests` DROP FOREIGN KEY `fk_userQuests_questId`;

-- DropForeignKey
ALTER TABLE `userQuests` DROP FOREIGN KEY `fk_userQuests_userId`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `fk_users_prestataireTypeId`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `fk_users_roleId`;

-- DropIndex
DROP INDEX `fk_activities_locationId` ON `activities`;

-- DropIndex
DROP INDEX `staticCode` ON `locations`;

-- DropIndex
DROP INDEX `userId` ON `locations`;

-- DropIndex
DROP INDEX `fk_products_locationId` ON `products`;

-- DropIndex
DROP INDEX `fk_quests_locationId` ON `quests`;

-- DropIndex
DROP INDEX `name` ON `roles`;

-- DropIndex
DROP INDEX `fk_userQuests_questId` ON `userQuests`;

-- DropIndex
DROP INDEX `unique_user_quest` ON `userQuests`;

-- DropIndex
DROP INDEX `email` ON `users`;

-- DropIndex
DROP INDEX `fk_users_prestataireTypeId` ON `users`;

-- DropIndex
DROP INDEX `fk_users_roleId` ON `users`;

-- AlterTable
ALTER TABLE `activities` DROP PRIMARY KEY,
    DROP COLUMN `endTime`,
    DROP COLUMN `id`,
    DROP COLUMN `locationId`,
    DROP COLUMN `startTime`,
    ADD COLUMN `end_time` DATETIME(0) NULL,
    ADD COLUMN `id_activity` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `id_location` INTEGER NOT NULL,
    ADD COLUMN `start_time` DATETIME(0) NULL,
    MODIFY `title` VARCHAR(255) NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` DATETIME(0) NULL,
    ADD PRIMARY KEY (`id_activity`);

-- AlterTable
ALTER TABLE `locations` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `staticCode`,
    DROP COLUMN `userId`,
    ADD COLUMN `id_location` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `id_prestataire` INTEGER NOT NULL,
    ADD COLUMN `static_code` VARCHAR(255) NULL,
    MODIFY `price` DECIMAL(15, 2) NULL,
    MODIFY `available` BOOLEAN NULL,
    MODIFY `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` DATETIME(0) NULL,
    ADD PRIMARY KEY (`id_location`);

-- AlterTable
ALTER TABLE `products` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `imageUrl`,
    DROP COLUMN `locationId`,
    DROP COLUMN `stock`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `id_prestataire` INTEGER NOT NULL,
    ADD COLUMN `id_product` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `image` VARCHAR(255) NULL,
    ADD COLUMN `modified_at` DATETIME(0) NULL,
    MODIFY `name` VARCHAR(255) NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `price` DECIMAL(15, 2) NULL,
    MODIFY `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD PRIMARY KEY (`id_product`);

-- AlterTable
ALTER TABLE `quests` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `locationId`,
    DROP COLUMN `xpReward`,
    ADD COLUMN `id_location` INTEGER NOT NULL,
    ADD COLUMN `id_quest` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `xp_reward` INTEGER NULL,
    MODIFY `title` VARCHAR(255) NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` DATETIME(0) NULL,
    ADD PRIMARY KEY (`id_quest`);

-- AlterTable
ALTER TABLE `roles` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `id_role` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `name` VARCHAR(255) NULL,
    MODIFY `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` DATETIME(0) NULL,
    ADD PRIMARY KEY (`id_role`);

-- AlterTable
ALTER TABLE `userQuests` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `questId`,
    DROP COLUMN `userId`,
    ADD COLUMN `id_quest` INTEGER NOT NULL,
    ADD COLUMN `id_user` INTEGER NOT NULL,
    MODIFY `status` ENUM('accepted', 'completed', 'failed') NOT NULL DEFAULT 'accepted',
    MODIFY `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` DATETIME(0) NULL,
    ADD PRIMARY KEY (`id_user`, `id_quest`);

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    DROP COLUMN `avatar_type`,
    DROP COLUMN `id`,
    DROP COLUMN `is_active`,
    DROP COLUMN `prestataireTypeId`,
    DROP COLUMN `roleId`,
    ADD COLUMN `id_role` INTEGER NOT NULL,
    ADD COLUMN `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `firstname` VARCHAR(255) NULL,
    MODIFY `lastname` VARCHAR(255) NULL,
    MODIFY `email` VARCHAR(255) NULL,
    MODIFY `password_hashed` TEXT NULL,
    MODIFY `is_verified` BOOLEAN NULL,
    MODIFY `xp` DOUBLE NULL,
    MODIFY `level` INTEGER NULL,
    MODIFY `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` DATETIME(0) NULL,
    ADD PRIMARY KEY (`id_user`);

-- DropTable
DROP TABLE `locationServices`;

-- DropTable
DROP TABLE `prestataireTypes`;

-- DropTable
DROP TABLE `services`;

-- CreateTable
CREATE TABLE `commande` (
    `id_commande` INTEGER NOT NULL AUTO_INCREMENT,
    `date_commande` DATETIME(0) NULL,
    `date_collect` DATETIME(0) NULL,
    `total_price` DECIMAL(15, 2) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `id_user` INTEGER NOT NULL,
    `etat_commande` ENUM('waiting', 'payed', 'collected') NOT NULL DEFAULT 'waiting',

    INDEX `commande_id_user_idx`(`id_user`),
    PRIMARY KEY (`id_commande`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ligne_panier` (
    `id_product` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `quantite` INTEGER NULL,
    `price` DECIMAL(15, 2) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    INDEX `ligne_panier_id_user_idx`(`id_user`),
    PRIMARY KEY (`id_product`, `id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock` (
    `id_product` INTEGER NOT NULL,
    `id_service` INTEGER NOT NULL,
    `stock` INTEGER NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    INDEX `stock_id_service_idx`(`id_service`),
    PRIMARY KEY (`id_product`, `id_service`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ligne_commande` (
    `id_product` INTEGER NOT NULL,
    `id_commande` INTEGER NOT NULL,
    `quantite` INTEGER NULL,
    `price` DECIMAL(15, 2) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    INDEX `ligne_commande_id_commande_idx`(`id_commande`),
    PRIMARY KEY (`id_product`, `id_commande`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prestataire_types` (
    `id_prestataire_type` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id_prestataire_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prestataire` (
    `id_prestataire` INTEGER NOT NULL AUTO_INCREMENT,
    `name_prestation` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `id_prestataire_type` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,

    UNIQUE INDEX `prestataire_id_user_key`(`id_user`),
    INDEX `prestataire_id_prestataire_type_idx`(`id_prestataire_type`),
    PRIMARY KEY (`id_prestataire`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_types` (
    `id_service_type` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id_service_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sevices` (
    `id_service` INTEGER NOT NULL AUTO_INCREMENT,
    `serviceCode` VARCHAR(255) NULL,
    `name` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `id_prestataire` INTEGER NOT NULL,
    `id_service_type` INTEGER NOT NULL,
    `id_location` INTEGER NOT NULL,

    INDEX `sevices_id_prestataire_idx`(`id_prestataire`),
    INDEX `sevices_id_service_type_idx`(`id_service_type`),
    INDEX `sevices_id_location_idx`(`id_location`),
    PRIMARY KEY (`id_service`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `activities_id_location_idx` ON `activities`(`id_location`);

-- CreateIndex
CREATE INDEX `locations_id_prestataire_idx` ON `locations`(`id_prestataire`);

-- CreateIndex
CREATE INDEX `products_id_prestataire_idx` ON `products`(`id_prestataire`);

-- CreateIndex
CREATE INDEX `quests_id_location_idx` ON `quests`(`id_location`);

-- CreateIndex
CREATE INDEX `userQuests_id_quest_idx` ON `userQuests`(`id_quest`);

-- CreateIndex
CREATE INDEX `users_id_role_idx` ON `users`(`id_role`);

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_id_prestataire_fkey` FOREIGN KEY (`id_prestataire`) REFERENCES `prestataire`(`id_prestataire`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commande` ADD CONSTRAINT `commande_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ligne_panier` ADD CONSTRAINT `ligne_panier_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `products`(`id_product`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ligne_panier` ADD CONSTRAINT `ligne_panier_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock` ADD CONSTRAINT `stock_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `products`(`id_product`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock` ADD CONSTRAINT `stock_id_service_fkey` FOREIGN KEY (`id_service`) REFERENCES `sevices`(`id_service`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ligne_commande` ADD CONSTRAINT `ligne_commande_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `products`(`id_product`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ligne_commande` ADD CONSTRAINT `ligne_commande_id_commande_fkey` FOREIGN KEY (`id_commande`) REFERENCES `commande`(`id_commande`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prestataire` ADD CONSTRAINT `prestataire_id_prestataire_type_fkey` FOREIGN KEY (`id_prestataire_type`) REFERENCES `prestataire_types`(`id_prestataire_type`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prestataire` ADD CONSTRAINT `prestataire_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userQuests` ADD CONSTRAINT `userQuests_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userQuests` ADD CONSTRAINT `userQuests_id_quest_fkey` FOREIGN KEY (`id_quest`) REFERENCES `quests`(`id_quest`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quests` ADD CONSTRAINT `quests_id_location_fkey` FOREIGN KEY (`id_location`) REFERENCES `locations`(`id_location`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `locations` ADD CONSTRAINT `locations_id_prestataire_fkey` FOREIGN KEY (`id_prestataire`) REFERENCES `prestataire`(`id_prestataire`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activities` ADD CONSTRAINT `activities_id_location_fkey` FOREIGN KEY (`id_location`) REFERENCES `locations`(`id_location`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sevices` ADD CONSTRAINT `sevices_id_prestataire_fkey` FOREIGN KEY (`id_prestataire`) REFERENCES `prestataire`(`id_prestataire`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sevices` ADD CONSTRAINT `sevices_id_service_type_fkey` FOREIGN KEY (`id_service_type`) REFERENCES `service_types`(`id_service_type`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sevices` ADD CONSTRAINT `sevices_id_location_fkey` FOREIGN KEY (`id_location`) REFERENCES `locations`(`id_location`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_id_role_fkey` FOREIGN KEY (`id_role`) REFERENCES `roles`(`id_role`) ON DELETE RESTRICT ON UPDATE CASCADE;
