-- CreateTable
CREATE TABLE `contact_messages` (
    `id_contact` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id_location` INTEGER NOT NULL,

    INDEX `contact_messages_id_location_idx`(`id_location`),
    PRIMARY KEY (`id_contact`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contact_messages` ADD CONSTRAINT `contact_messages_id_location_fkey` FOREIGN KEY (`id_location`) REFERENCES `locations`(`id_location`) ON DELETE RESTRICT ON UPDATE CASCADE;
