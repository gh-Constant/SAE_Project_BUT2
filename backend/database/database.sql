-- =================================================================
-- I. FONCTION ET TRIGGER POUR LA MISE À JOUR AUTOMATIQUE DE 'updated_at'
-- =================================================================
-- Cette fonction met à jour la colonne 'updated_at' avec l'heure actuelle.
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =================================================================
-- II. CRÉATION DES TABLES
-- =================================================================

-- Table de référence pour les rôles des utilisateurs
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "pk_roles" PRIMARY KEY ("id")
);

-- Table principale pour tous les utilisateurs
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firstname" VARCHAR(255) NOT NULL,
    "lastname" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password_hashed" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
    "is_verified" BOOLEAN NOT NULL DEFAULT FALSE,
    "xp" BIGINT NOT NULL DEFAULT 0,
    "level" BIGINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "pk_users" PRIMARY KEY ("id")
);
COMMENT ON TABLE "users" IS 'updated_at est géré par le trigger set_timestamp_trigger';

-- Gère l'état (prix, propriétaire) des emplacements achetables
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "staticCode" VARCHAR(255) NOT NULL UNIQUE,
    "price" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    "available" BOOLEAN NOT NULL DEFAULT TRUE,
    "userId" UUID UNIQUE, -- L'Artisan propriétaire
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "pk_locations" PRIMARY KEY ("id")
);
COMMENT ON TABLE "locations" IS 'Les détails (nom, description, image) sont dans le code, liés par staticCode. ON DELETE SET NULL est appliqué sur la clé étrangère userId.';

-- Table de référence pour les types de services qu'un Artisan peut activer
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "serviceCode" VARCHAR(255) NOT NULL UNIQUE,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "pk_services" PRIMARY KEY ("id")
);

-- Table de liaison (N:M) entre les emplacements et les services
CREATE TABLE "locationServices" (
    "id" BIGSERIAL NOT NULL,
    "locationId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "pk_locationServices" PRIMARY KEY ("id"),
    CONSTRAINT "unique_location_service" UNIQUE ("locationId", "serviceId")
);

-- Articles vendus dans l'échoppe d'un emplacement
CREATE TABLE "products" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" VARCHAR(255),
    "locationId" INTEGER NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "pk_products" PRIMARY KEY ("id")
);

-- Quêtes proposées à un emplacement
CREATE TABLE "quests" (
    "id" BIGSERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 10,
    "locationId" INTEGER NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "pk_quests" PRIMARY KEY ("id")
);

-- Événements planifiés à un emplacement
CREATE TABLE "activities" (
    "id" BIGSERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "endTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "locationId" INTEGER NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "pk_activities" PRIMARY KEY ("id")
);

-- Journal de quêtes (liaison N:M entre les utilisateurs et les quêtes)
CREATE TABLE "userQuests" (
    "id" BIGSERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "questId" BIGINT NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'accepted' CHECK (status IN ('accepted', 'completed')),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "pk_userQuests" PRIMARY KEY ("id"),
    CONSTRAINT "unique_user_quest" UNIQUE ("userId", "questId")
);

-- =================================================================
-- III. DÉFINITION DES CLÉS ÉTRANGÈRES
-- =================================================================

ALTER TABLE "users" ADD CONSTRAINT "fk_users_roleId" FOREIGN KEY("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT;

ALTER TABLE "locations" ADD CONSTRAINT "fk_locations_userId" FOREIGN KEY("userId") REFERENCES "users"("id") ON DELETE SET NULL;

ALTER TABLE "locationServices" ADD CONSTRAINT "fk_locationServices_locationId" FOREIGN KEY("locationId") REFERENCES "locations"("id") ON DELETE CASCADE;
ALTER TABLE "locationServices" ADD CONSTRAINT "fk_locationServices_serviceId" FOREIGN KEY("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT;

ALTER TABLE "products" ADD CONSTRAINT "fk_products_locationId" FOREIGN KEY("locationId") REFERENCES "locations"("id") ON DELETE CASCADE;

ALTER TABLE "quests" ADD CONSTRAINT "fk_quests_locationId" FOREIGN KEY("locationId") REFERENCES "locations"("id") ON DELETE CASCADE;

ALTER TABLE "activities" ADD CONSTRAINT "fk_activities_locationId" FOREIGN KEY("locationId") REFERENCES "locations"("id") ON DELETE CASCADE;

ALTER TABLE "userQuests" ADD CONSTRAINT "fk_userQuests_userId" FOREIGN KEY("userId") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "userQuests" ADD CONSTRAINT "fk_userQuests_questId" FOREIGN KEY("questId") REFERENCES "quests"("id") ON DELETE CASCADE;


-- =================================================================
-- IV. CRÉATION DES TRIGGERS POUR 'updated_at'
-- =================================================================

CREATE TRIGGER set_timestamp_trigger BEFORE UPDATE ON "roles" FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_trigger BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_trigger BEFORE UPDATE ON "locations" FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_trigger BEFORE UPDATE ON "services" FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_trigger BEFORE UPDATE ON "locationServices" FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_trigger BEFORE UPDATE ON "products" FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_trigger BEFORE UPDATE ON "quests" FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_trigger BEFORE UPDATE ON "activities" FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_trigger BEFORE UPDATE ON "userQuests" FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();