-- AlterTable
ALTER TABLE `users` MODIFY `password_hashed` TEXT NULL;

-- CreateTable
CREATE TABLE `oauth_accounts` (
    `id_oauth_account` INTEGER NOT NULL AUTO_INCREMENT,
    `provider` ENUM('google', 'discord') NOT NULL,
    `provider_user_id` VARCHAR(255) NOT NULL,
    `provider_email` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `id_user` INTEGER NOT NULL,

    INDEX `oauth_accounts_id_user_idx`(`id_user`),
    UNIQUE INDEX `oauth_accounts_provider_provider_user_id_key`(`provider`, `provider_user_id`),
    UNIQUE INDEX `oauth_accounts_id_user_provider_key`(`id_user`, `provider`),
    PRIMARY KEY (`id_oauth_account`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `oauth_accounts` ADD CONSTRAINT `oauth_accounts_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
