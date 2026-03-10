-- CreateTable
CREATE TABLE `conversations` (
    `id_conversation` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,
    `id_user` INTEGER NOT NULL,
    `id_location` INTEGER NOT NULL,

    INDEX `conversations_id_user_idx`(`id_user`),
    INDEX `conversations_id_location_idx`(`id_location`),
    PRIMARY KEY (`id_conversation`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id_message` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `read` BOOLEAN NOT NULL DEFAULT false,
    `id_conversation` INTEGER NOT NULL,
    `sender_id` INTEGER NOT NULL,

    INDEX `messages_id_conversation_idx`(`id_conversation`),
    INDEX `messages_sender_id_idx`(`sender_id`),
    PRIMARY KEY (`id_message`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_id_location_fkey` FOREIGN KEY (`id_location`) REFERENCES `locations`(`id_location`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_id_conversation_fkey` FOREIGN KEY (`id_conversation`) REFERENCES `conversations`(`id_conversation`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
