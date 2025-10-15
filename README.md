# SAEProjectBUT2

## Configuration du Backend et de la Base de Données

1. Installer les dépendances : `npm install` (dans le répertoire racine)
2. Configurer la base de données :
   - **Option 1 : Utiliser Docker Compose (recommandé pour le développement)**
     - Exécuter `docker-compose up -d` pour démarrer MYSQL
     - Copier `.env.example` vers `.env` et mettre à jour les informations d'authentification si nécessaire (par défaut : `mysql://sae_user:sae_password@localhost:3306/sae_project_db`)
   - **Option 2 : Base de données auto-hébergée**
     - Configurer votre propre base de données MYSQL
     - Copier `.env.example` vers `.env` et remplir le `DATABASE_URL` ou les variables individuelles de base de données

## Comment démarrer le frontend

1. Installer les dépendances : `npm install` (dans le répertoire racine)
2. Lancer le serveur de développement : `npm run frontend:dev`
   - Pour démarrer sans backend : `npm run frontend:dev:mock` (Premier livrable)
3. Vérifier les types : `npm run frontend:typecheck`

## Comment démarrer le backend

1. Démarrer la base de données (voir section ci-dessus)
2. Installer les dépendances : `npm install` (dans le répertoire racine)
3. Lancer le serveur de développement : `npm run backend:dev`
4. Tester la connexion à la base de données : `curl http://localhost:3000/api/roles`

   💡 *Note : Le déploiement sur le vrai site internet ne marche pas s'il y a des erreurs de types.*

⚠️ **Pour chaque page, vous devez faire les traductions avec i18n dans le dossier locales**

⚠️ **Pour chaque marqueur prédéfini, vous devez les mettre dans /utils/predefinedmarkers.ts**
test
