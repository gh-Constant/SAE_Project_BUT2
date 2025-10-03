-- AlterTable
ALTER TABLE `users` ADD COLUMN `prestataireTypeId` INTEGER NULL;

-- CreateTable
CREATE TABLE `prestataireTypes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `fk_users_prestataireTypeId` ON `users`(`prestataireTypeId`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `fk_users_prestataireTypeId` FOREIGN KEY (`prestataireTypeId`) REFERENCES `prestataireTypes`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;
