-- =================================================================
-- I. CRÉATION ET SÉLECTION DE LA BASE DE DONNÉES
-- =================================================================
-- Crée la base de données uniquement si elle n'existe pas déjà.
-- REMPLACEZ 'votre_base_de_donnees' PAR LE NOM DE VOTRE BASE DE DONNÉES.
CREATE DATABASE IF NOT EXISTS `sae_project_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =================================================================
-- II. CRÉATION DES TABLES (SI ELLES N'EXISTENT PAS)
-- =================================================================

-- Table de référence pour les rôles des utilisateurs
CREATE TABLE IF NOT EXISTS `roles` (
                                       `id` INT NOT NULL AUTO_INCREMENT,
                                       `name` VARCHAR(255) NOT NULL UNIQUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB;

-- Table principale pour tous les utilisateurs
CREATE TABLE IF NOT EXISTS `users` (
                                       `id` INT NOT NULL AUTO_INCREMENT,
                                       `firstname` VARCHAR(255) NOT NULL,
    `lastname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password_hashed` TEXT NOT NULL,
    `roleId` INT NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `is_verified` BOOLEAN NOT NULL DEFAULT FALSE,
    `xp` BIGINT NOT NULL DEFAULT 0,
    `level` BIGINT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_users_roleId` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE RESTRICT
    ) ENGINE=InnoDB COMMENT='updated_at est géré par ON UPDATE CURRENT_TIMESTAMP';

-- Gère l'état (prix, propriétaire) des emplacements achetables
CREATE TABLE IF NOT EXISTS `locations` (
                                           `id` INT NOT NULL AUTO_INCREMENT,
                                           `staticCode` VARCHAR(255) NOT NULL UNIQUE,
    `price` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `available` BOOLEAN NOT NULL DEFAULT TRUE,
    `userId` INT UNIQUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_locations_userId` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB COMMENT='Les détails sont dans le code. ON DELETE SET NULL est appliqué sur la clé étrangère userId.';

-- Table de référence pour les types de services qu'un Artisan peut activer
CREATE TABLE IF NOT EXISTS `services` (
                                          `id` INT NOT NULL AUTO_INCREMENT,
                                          `serviceCode` VARCHAR(255) NOT NULL UNIQUE,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB;

-- Table de liaison (N:M) entre les emplacements et les services
CREATE TABLE IF NOT EXISTS `locationServices` (
                                                  `id` BIGINT NOT NULL AUTO_INCREMENT,
                                                  `locationId` INT NOT NULL,
                                                  `serviceId` INT NOT NULL,
                                                  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
                                                  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                  PRIMARY KEY (`id`),
    CONSTRAINT `unique_location_service` UNIQUE (`locationId`, `serviceId`),
    CONSTRAINT `fk_locationServices_locationId` FOREIGN KEY (`locationId`) REFERENCES `locations`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_locationServices_serviceId` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE RESTRICT
    ) ENGINE=InnoDB;

-- Articles vendus dans l'échoppe d'un emplacement
CREATE TABLE IF NOT EXISTS `products` (
                                          `id` BIGINT NOT NULL AUTO_INCREMENT,
                                          `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `stock` INT NOT NULL DEFAULT 0,
    `imageUrl` VARCHAR(255),
    `locationId` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_products_locationId` FOREIGN KEY (`locationId`) REFERENCES `locations`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB;

-- Quêtes proposées à un emplacement
CREATE TABLE IF NOT EXISTS `quests` (
                                        `id` BIGINT NOT NULL AUTO_INCREMENT,
                                        `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `xpReward` INT NOT NULL DEFAULT 10,
    `locationId` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_quests_locationId` FOREIGN KEY (`locationId`) REFERENCES `locations`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB;

-- Événements planifiés à un emplacement
CREATE TABLE IF NOT EXISTS `activities` (
                                            `id` BIGINT NOT NULL AUTO_INCREMENT,
                                            `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `startTime` TIMESTAMP NOT NULL,
    `endTime` TIMESTAMP NOT NULL,
    `locationId` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_activities_locationId` FOREIGN KEY (`locationId`) REFERENCES `locations`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB;

-- Journal de quêtes (liaison N:M entre les utilisateurs et les quêtes)
CREATE TABLE IF NOT EXISTS `userQuests` (
                                            `id` BIGINT NOT NULL AUTO_INCREMENT,
                                            `userId` INT NOT NULL,
                                            `questId` BIGINT NOT NULL,
                                            `status` ENUM('accepted', 'completed') NOT NULL DEFAULT 'accepted',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `unique_user_quest` UNIQUE (`userId`, `questId`),
    CONSTRAINT `fk_userQuests_userId` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_userQuests_questId` FOREIGN KEY (`questId`) REFERENCES `quests`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB;


-- =================================================================
-- IV. INSERTION DES DONNÉES INITIALES (SI ELLES N'EXISTENT PAS)
-- =================================================================
-- L'utilisation de 'INSERT IGNORE' empêche les erreurs si les rôles existent déjà
-- (grâce à la contrainte UNIQUE sur la colonne 'name').
INSERT IGNORE INTO `roles` (`name`) VALUES
('aventurier'),
('prestataire'),
('admin');