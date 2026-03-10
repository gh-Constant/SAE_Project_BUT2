-- AlterTable
ALTER TABLE `users` ADD COLUMN `gold` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `reset_token` VARCHAR(255) NULL,
    ADD COLUMN `reset_token_expiry` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_reset_token_key` ON `users`(`reset_token`);

