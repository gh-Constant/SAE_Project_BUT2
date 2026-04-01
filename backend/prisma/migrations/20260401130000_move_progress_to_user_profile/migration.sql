-- Move level/xp progression from users to user_profiles.
ALTER TABLE `user_profiles`
    ADD COLUMN `level` INTEGER NULL,
    ADD COLUMN `xp` DOUBLE NULL;

INSERT INTO `user_profiles` (`id_user`, `level`, `xp`, `created_at`, `updated_at`)
SELECT
    u.`id_user`,
    CASE WHEN u.`role` = 'aventurier' THEN u.`level` ELSE NULL END,
    CASE WHEN u.`role` = 'aventurier' THEN u.`xp` ELSE NULL END,
    NOW(),
    NOW()
FROM `users` u
ON DUPLICATE KEY UPDATE
    `level` = VALUES(`level`),
    `xp` = VALUES(`xp`),
    `updated_at` = NOW();

SET @check_exists := (
    SELECT COUNT(*)
    FROM information_schema.table_constraints
    WHERE table_schema = DATABASE()
      AND table_name = 'users'
      AND constraint_name = 'users_aventurier_progress_check'
      AND constraint_type = 'CHECK'
);

SET @drop_check_sql := IF(
    @check_exists > 0,
    'ALTER TABLE `users` DROP CHECK `users_aventurier_progress_check`',
    'SELECT 1'
);

PREPARE stmt FROM @drop_check_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

ALTER TABLE `users`
    DROP COLUMN `level`,
    DROP COLUMN `xp`;
