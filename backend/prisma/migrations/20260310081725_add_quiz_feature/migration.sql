-- CreateTable
CREATE TABLE `quizzes` (
    `id_quiz` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `image_url` VARCHAR(255) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,
    `id_location` INTEGER NOT NULL,
    `id_creator` INTEGER NOT NULL,

    INDEX `quizzes_id_location_idx`(`id_location`),
    INDEX `quizzes_id_creator_idx`(`id_creator`),
    PRIMARY KEY (`id_quiz`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_questions` (
    `id_question` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `image_url` VARCHAR(255) NULL,
    `order_index` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,
    `id_quiz` INTEGER NOT NULL,

    INDEX `quiz_questions_id_quiz_idx`(`id_quiz`),
    PRIMARY KEY (`id_question`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_answers` (
    `id_answer` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(500) NOT NULL,
    `is_correct` BOOLEAN NOT NULL DEFAULT false,
    `order_index` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,
    `id_question` INTEGER NOT NULL,

    INDEX `quiz_answers_id_question_idx`(`id_question`),
    PRIMARY KEY (`id_answer`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_quiz_attempts` (
    `id_attempt` INTEGER NOT NULL AUTO_INCREMENT,
    `score` INTEGER NOT NULL DEFAULT 0,
    `total_questions` INTEGER NOT NULL DEFAULT 0,
    `completed_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,
    `id_user` INTEGER NOT NULL,
    `id_quiz` INTEGER NOT NULL,

    INDEX `user_quiz_attempts_id_user_idx`(`id_user`),
    INDEX `user_quiz_attempts_id_quiz_idx`(`id_quiz`),
    PRIMARY KEY (`id_attempt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_quiz_answers` (
    `id_user_answer` INTEGER NOT NULL AUTO_INCREMENT,
    `is_correct` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id_attempt` INTEGER NOT NULL,
    `id_question` INTEGER NOT NULL,
    `id_answer` INTEGER NOT NULL,

    INDEX `user_quiz_answers_id_attempt_idx`(`id_attempt`),
    INDEX `user_quiz_answers_id_question_idx`(`id_question`),
    INDEX `user_quiz_answers_id_answer_idx`(`id_answer`),
    PRIMARY KEY (`id_user_answer`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `quizzes` ADD CONSTRAINT `quizzes_id_location_fkey` FOREIGN KEY (`id_location`) REFERENCES `locations`(`id_location`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quizzes` ADD CONSTRAINT `quizzes_id_creator_fkey` FOREIGN KEY (`id_creator`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_questions` ADD CONSTRAINT `quiz_questions_id_quiz_fkey` FOREIGN KEY (`id_quiz`) REFERENCES `quizzes`(`id_quiz`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_answers` ADD CONSTRAINT `quiz_answers_id_question_fkey` FOREIGN KEY (`id_question`) REFERENCES `quiz_questions`(`id_question`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_quiz_attempts` ADD CONSTRAINT `user_quiz_attempts_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_quiz_attempts` ADD CONSTRAINT `user_quiz_attempts_id_quiz_fkey` FOREIGN KEY (`id_quiz`) REFERENCES `quizzes`(`id_quiz`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_quiz_answers` ADD CONSTRAINT `user_quiz_answers_id_attempt_fkey` FOREIGN KEY (`id_attempt`) REFERENCES `user_quiz_attempts`(`id_attempt`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_quiz_answers` ADD CONSTRAINT `user_quiz_answers_id_question_fkey` FOREIGN KEY (`id_question`) REFERENCES `quiz_questions`(`id_question`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_quiz_answers` ADD CONSTRAINT `user_quiz_answers_id_answer_fkey` FOREIGN KEY (`id_answer`) REFERENCES `quiz_answers`(`id_answer`) ON DELETE CASCADE ON UPDATE CASCADE;
