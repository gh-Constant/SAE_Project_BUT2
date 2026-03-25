/*
  Warnings:

  - A unique constraint covering the columns `[id_blog]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `id_blog` INTEGER NULL,
    ADD COLUMN `is_blog` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `user_blogs` (
    `id_user` INTEGER NOT NULL,
    `id_blog` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_user`, `id_blog`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `products_id_blog_key` ON `products`(`id_blog`);

-- AddForeignKey
ALTER TABLE `user_blogs` ADD CONSTRAINT `user_blogs_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_blogs` ADD CONSTRAINT `user_blogs_id_blog_fkey` FOREIGN KEY (`id_blog`) REFERENCES `blogs`(`id_blog`) ON DELETE RESTRICT ON UPDATE CASCADE;
