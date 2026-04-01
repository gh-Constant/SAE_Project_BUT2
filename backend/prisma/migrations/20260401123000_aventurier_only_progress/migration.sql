-- Make progression fields nullable for non-aventurier users and enforce role consistency.
UPDATE `users`
SET `xp` = NULL,
    `level` = NULL
WHERE `role` <> 'aventurier';

ALTER TABLE `users`
    MODIFY `xp` DOUBLE NULL,
    MODIFY `level` INTEGER NULL;

ALTER TABLE `users`
    ADD CONSTRAINT `users_aventurier_progress_check`
    CHECK (
        (`role` = 'aventurier' AND `xp` IS NOT NULL AND `level` IS NOT NULL)
        OR
        (`role` <> 'aventurier' AND `xp` IS NULL AND `level` IS NULL)
    );
