-- AlterTable
-- Suppression des colonnes non utilisées dans le formulaire de profil
ALTER TABLE `users` 
DROP COLUMN IF EXISTS `website`,
DROP COLUMN IF EXISTS `experience_years`,
DROP COLUMN IF EXISTS `social_media`,
DROP COLUMN IF EXISTS `specialties`,
DROP COLUMN IF EXISTS `languages`;

