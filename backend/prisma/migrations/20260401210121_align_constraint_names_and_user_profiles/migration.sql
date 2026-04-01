-- DropForeignKey
ALTER TABLE `ligne_panier` DROP FOREIGN KEY `ligne_panier_id_product_fkey`;

-- DropForeignKey
ALTER TABLE `ligne_panier` DROP FOREIGN KEY `ligne_panier_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `user_profiles` DROP FOREIGN KEY `user_profiles_id_user_fkey`;

-- DropIndex
DROP INDEX `user_profiles_id_user_key` ON `user_profiles`;

-- AddForeignKey
ALTER TABLE `ligne_panier` ADD CONSTRAINT `fk_ligne_panier_product` FOREIGN KEY (`id_product`) REFERENCES `products`(`id_product`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ligne_panier` ADD CONSTRAINT `fk_ligne_panier_user` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
