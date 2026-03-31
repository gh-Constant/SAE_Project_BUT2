-- AlterTable
ALTER TABLE `locations`
    ADD COLUMN `has_water_access` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `has_electricity` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `has_toilets` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_accessible_pmr` BOOLEAN NOT NULL DEFAULT false;
