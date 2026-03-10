-- AlterTable
ALTER TABLE `event_reservations` ADD COLUMN `id_schedule` INTEGER NULL;

-- AlterTable
ALTER TABLE `events` ADD COLUMN `type` ENUM('EVENT', 'ACTIVITY') NOT NULL DEFAULT 'EVENT',
    MODIFY `start_time` DATETIME(0) NULL,
    MODIFY `end_time` DATETIME(0) NULL;

-- CreateTable
CREATE TABLE `event_schedules` (
    `id_schedule` INTEGER NOT NULL AUTO_INCREMENT,
    `start_time` DATETIME(0) NOT NULL,
    `end_time` DATETIME(0) NOT NULL,
    `capacity` INTEGER NULL,
    `price` DECIMAL(15, 2) NULL,
    `sold` INTEGER NOT NULL DEFAULT 0,
    `id_event` INTEGER NOT NULL,

    INDEX `event_schedules_id_event_idx`(`id_event`),
    PRIMARY KEY (`id_schedule`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `event_reservations_id_schedule_idx` ON `event_reservations`(`id_schedule`);

-- AddForeignKey
ALTER TABLE `event_schedules` ADD CONSTRAINT `event_schedules_id_event_fkey` FOREIGN KEY (`id_event`) REFERENCES `events`(`id_event`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_reservations` ADD CONSTRAINT `event_reservations_id_schedule_fkey` FOREIGN KEY (`id_schedule`) REFERENCES `event_schedules`(`id_schedule`) ON DELETE SET NULL ON UPDATE CASCADE;
