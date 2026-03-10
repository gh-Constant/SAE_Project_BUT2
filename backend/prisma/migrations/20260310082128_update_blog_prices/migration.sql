-- AlterTable
ALTER TABLE `blogs` ADD COLUMN `is_sellable` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `price` DECIMAL(15, 2) NULL;
