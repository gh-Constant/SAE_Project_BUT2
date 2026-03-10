/*
  Warnings:

  - You are about to drop the `prestataire` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_prestataire_type` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `locations` DROP FOREIGN KEY `locations_id_prestataire_fkey`;

-- DropForeignKey
ALTER TABLE `prestataire` DROP FOREIGN KEY `prestataire_id_prestataire_type_fkey`;

-- DropForeignKey
ALTER TABLE `prestataire` DROP FOREIGN KEY `prestataire_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_id_prestataire_fkey`;

-- DropForeignKey
ALTER TABLE `sevices` DROP FOREIGN KEY `sevices_id_prestataire_fkey`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `id_prestataire_type` INTEGER NOT NULL,
    ADD COLUMN `presentation` LONGTEXT NULL;

-- DropTable
DROP TABLE `prestataire`;

-- AddForeignKey
ALTER TABLE `locations` ADD CONSTRAINT `locations_id_prestataire_fkey` FOREIGN KEY (`id_prestataire`) REFERENCES `users`(`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sevices` ADD CONSTRAINT `sevices_id_prestataire_fkey` FOREIGN KEY (`id_prestataire`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_id_prestataire_fkey` FOREIGN KEY (`id_prestataire`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_id_prestataire_type_fkey` FOREIGN KEY (`id_prestataire_type`) REFERENCES `prestataire_types`(`id_prestataire_type`) ON DELETE RESTRICT ON UPDATE CASCADE;
