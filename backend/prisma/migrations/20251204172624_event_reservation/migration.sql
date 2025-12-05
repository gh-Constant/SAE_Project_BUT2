-- CreateTable
CREATE TABLE `prestataire_types` (
    `id_prestataire_type` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id_prestataire_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userQuests` (
    `id_user` INTEGER NOT NULL,
    `id_quest` INTEGER NOT NULL,
    `status` ENUM('accepted', 'completed', 'failed') NOT NULL DEFAULT 'accepted',
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    INDEX `userQuests_id_quest_idx`(`id_quest`),
    PRIMARY KEY (`id_user`, `id_quest`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quests` (
    `id_quest` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `xp_reward` INTEGER NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `id_location` INTEGER NOT NULL,

    INDEX `quests_id_location_idx`(`id_location`),
    PRIMARY KEY (`id_quest`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_types` (
    `id_service_type` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id_service_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location_type` (
    `id_location_type` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id_location_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locations` (
    `id_location` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `static_code` VARCHAR(255) NULL,
    `price` DECIMAL(15, 2) NOT NULL,
    `purchased` BOOLEAN NOT NULL DEFAULT false,
    `position` JSON NOT NULL,
    `icon_name` VARCHAR(255) NULL,
    `banner_name` VARCHAR(255) NULL,
    `maximum_capacity` INTEGER NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `id_location_type` INTEGER NOT NULL,
    `id_prestataire` INTEGER NULL,

    INDEX `locations_id_prestataire_idx`(`id_prestataire`),
    PRIMARY KEY (`id_location`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blogs` (
    `id_blog` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `id_location` INTEGER NOT NULL,

    INDEX `blogs_id_location_idx`(`id_location`),
    PRIMARY KEY (`id_blog`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `events` (
    `id_event` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `start_time` DATETIME(0) NOT NULL,
    `end_time` DATETIME(0) NOT NULL,
    `price` DECIMAL(15, 2) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `sold` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `id_location` INTEGER NOT NULL,

    INDEX `events_id_location_idx`(`id_location`),
    PRIMARY KEY (`id_event`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_reservations` (
    `id_reservation` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `total_price` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,
    `id_user` INTEGER NOT NULL,
    `id_event` INTEGER NOT NULL,

    INDEX `event_reservations_id_user_idx`(`id_user`),
    INDEX `event_reservations_id_event_idx`(`id_event`),
    PRIMARY KEY (`id_reservation`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sevices` (
    `id_service` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `id_prestataire` INTEGER NOT NULL,
    `id_service_type` INTEGER NOT NULL,
    `id_location` INTEGER NOT NULL,

    INDEX `sevices_id_prestataire_idx`(`id_prestataire`),
    INDEX `sevices_id_service_type_idx`(`id_service_type`),
    INDEX `sevices_id_location_idx`(`id_location`),
    PRIMARY KEY (`id_service`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id_product` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `price` DECIMAL(15, 2) NOT NULL,
    `image` VARCHAR(255) NULL,
    `modified_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id_prestataire` INTEGER NOT NULL,

    INDEX `products_id_prestataire_idx`(`id_prestataire`),
    PRIMARY KEY (`id_product`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `commande` (
    `id_commande` INTEGER NOT NULL AUTO_INCREMENT,
    `date_commande` DATETIME(0) NOT NULL,
    `date_collect` DATETIME(0) NULL,
    `total_price` DECIMAL(15, 2) NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `id_user` INTEGER NOT NULL,
    `etat_commande` ENUM('waiting', 'payed', 'collected') NOT NULL DEFAULT 'waiting',

    INDEX `commande_id_user_idx`(`id_user`),
    PRIMARY KEY (`id_commande`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ligne_panier` (
    `id_product` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `quantite` INTEGER NOT NULL,
    `price` DECIMAL(15, 2) NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    INDEX `ligne_panier_id_user_idx`(`id_user`),
    PRIMARY KEY (`id_product`, `id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock` (
    `id_product` INTEGER NOT NULL,
    `id_service` INTEGER NOT NULL,
    `stock` INTEGER NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    INDEX `stock_id_service_idx`(`id_service`),
    PRIMARY KEY (`id_product`, `id_service`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ligne_commande` (
    `id_product` INTEGER NOT NULL,
    `id_commande` INTEGER NOT NULL,
    `quantite` INTEGER NOT NULL,
    `price` DECIMAL(15, 2) NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    INDEX `ligne_commande_id_commande_idx`(`id_commande`),
    PRIMARY KEY (`id_product`, `id_commande`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(255) NOT NULL,
    `lastname` VARCHAR(255) NOT NULL,
    `birth_date` DATETIME(3) NULL,
    `bio` TEXT NULL,
    `phone` CHAR(20) NULL,
    `email` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'aventurier', 'prestataire') NOT NULL,
    `avatar_url` VARCHAR(255) NOT NULL,
    `avatar_type` ENUM('gallery', 'upload') NOT NULL DEFAULT 'gallery',
    `level` INTEGER NOT NULL,
    `xp` DOUBLE NOT NULL,
    `is_verified` BOOLEAN NOT NULL,
    `password_hashed` TEXT NOT NULL,
    `presentation` LONGTEXT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,
    `id_prestataire_type` INTEGER NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `userQuests` ADD CONSTRAINT `userQuests_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userQuests` ADD CONSTRAINT `userQuests_id_quest_fkey` FOREIGN KEY (`id_quest`) REFERENCES `quests`(`id_quest`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quests` ADD CONSTRAINT `quests_id_location_fkey` FOREIGN KEY (`id_location`) REFERENCES `locations`(`id_location`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `locations` ADD CONSTRAINT `locations_id_location_type_fkey` FOREIGN KEY (`id_location_type`) REFERENCES `location_type`(`id_location_type`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `locations` ADD CONSTRAINT `locations_id_prestataire_fkey` FOREIGN KEY (`id_prestataire`) REFERENCES `users`(`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blogs` ADD CONSTRAINT `blogs_id_location_fkey` FOREIGN KEY (`id_location`) REFERENCES `locations`(`id_location`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_id_location_fkey` FOREIGN KEY (`id_location`) REFERENCES `locations`(`id_location`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_reservations` ADD CONSTRAINT `event_reservations_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_reservations` ADD CONSTRAINT `event_reservations_id_event_fkey` FOREIGN KEY (`id_event`) REFERENCES `events`(`id_event`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sevices` ADD CONSTRAINT `sevices_id_prestataire_fkey` FOREIGN KEY (`id_prestataire`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sevices` ADD CONSTRAINT `sevices_id_service_type_fkey` FOREIGN KEY (`id_service_type`) REFERENCES `service_types`(`id_service_type`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sevices` ADD CONSTRAINT `sevices_id_location_fkey` FOREIGN KEY (`id_location`) REFERENCES `locations`(`id_location`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_id_prestataire_fkey` FOREIGN KEY (`id_prestataire`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commande` ADD CONSTRAINT `commande_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ligne_panier` ADD CONSTRAINT `ligne_panier_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `products`(`id_product`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ligne_panier` ADD CONSTRAINT `ligne_panier_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock` ADD CONSTRAINT `stock_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `products`(`id_product`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock` ADD CONSTRAINT `stock_id_service_fkey` FOREIGN KEY (`id_service`) REFERENCES `sevices`(`id_service`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ligne_commande` ADD CONSTRAINT `ligne_commande_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `products`(`id_product`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ligne_commande` ADD CONSTRAINT `ligne_commande_id_commande_fkey` FOREIGN KEY (`id_commande`) REFERENCES `commande`(`id_commande`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_id_prestataire_type_fkey` FOREIGN KEY (`id_prestataire_type`) REFERENCES `prestataire_types`(`id_prestataire_type`) ON DELETE RESTRICT ON UPDATE CASCADE;
