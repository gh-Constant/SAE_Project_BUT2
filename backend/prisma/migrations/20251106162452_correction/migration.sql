/*
  Warnings:

  - You are about to drop the column `available` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `name_prestation` on the `prestataire` table. All the data in the column will be lost.
  - You are about to drop the column `serviceCode` on the `sevices` table. All the data in the column will be lost.
  - You are about to drop the column `id_role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_location_type` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_id_role_fkey`;

-- DropIndex
DROP INDEX `users_id_role_idx` ON `users`;

-- AlterTable
ALTER TABLE `locations` DROP COLUMN `available`,
    ADD COLUMN `banner_name` VARCHAR(255) NULL,
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `icon_name` VARCHAR(255) NULL,
    ADD COLUMN `id_location_type` INTEGER NOT NULL,
    ADD COLUMN `name` VARCHAR(255) NOT NULL,
    ADD COLUMN `position` JSON NULL,
    ADD COLUMN `purchased` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `prestataire` DROP COLUMN `name_prestation`,
    ADD COLUMN `name` VARCHAR(255) NULL,
    ADD COLUMN `presentation` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `sevices` DROP COLUMN `serviceCode`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `id_role`,
    ADD COLUMN `role` ENUM('admin', 'aventurier', 'prestataire') NOT NULL;

-- DropTable
DROP TABLE `roles`;

-- CreateTable
CREATE TABLE `location_type` (
    `id_location_type` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id_location_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `locations` ADD CONSTRAINT `locations_id_location_type_fkey` FOREIGN KEY (`id_location_type`) REFERENCES `location_type`(`id_location_type`) ON DELETE RESTRICT ON UPDATE CASCADE;
