-- CreateTable
CREATE TABLE `user_profiles` (
    `id_user` INTEGER NOT NULL,
    `birth_date` DATETIME(3) NULL,
    `bio` TEXT NULL,
    `phone` CHAR(20) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    UNIQUE INDEX `user_profiles_id_user_key`(`id_user`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_profiles`
ADD CONSTRAINT `user_profiles_id_user_fkey`
FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`)
ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill existing account profile fields from users
INSERT INTO `user_profiles` (`id_user`, `birth_date`, `bio`, `phone`, `created_at`, `updated_at`)
SELECT `id_user`, `birth_date`, `bio`, `phone`, `created_at`, `updated_at`
FROM `users`;
