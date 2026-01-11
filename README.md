# SAEProjectBUT2

## Prérequis

Avant de commencer, installez toutes les dépendances du projet :
\`npm install\` (dans le répertoire racine)

## 1. Démarrer le projet (Frontend uniquement)

### Mode Mock (Sans Backend)
C'est la méthode la plus simple pour voir le frontend et développer sans avoir besoin de base de données ou de backend.
- Commande : \`npm run frontend:dev:mock\`

---

## 2. Démarrer le projet complet (Backend + Frontend)

Pour faire fonctionner le site normalement avec la base de données.

### Étape A : Configurer la Base de Données

Vous avez deux options :

**Option 1 : Via Docker (Recommandé)**
Si vous avez Docker installé, lancez simplement :
\`docker-compose up -d\`

**Option 2 : Via MySQL Local**
Si vous n'utilisez pas Docker, vous devez avoir un serveur MySQL qui tourne sur votre machine.
- Configurez le fichier \`.env\` avec vos informations de connexion MySQL.

### Étape B : Initialiser Prisma
Une fois la base de données (Docker ou Locale) prête, lancez ces commandes pour créer les tables et générer le client :

1. Générer le client Prisma :
   \`npx prisma generate\`

2. Pousser le schéma vers la base de données :
   \`npx prisma db push\` (ou \`npx prisma migrate dev\` pour un environnement de dév strict)

### Étape C : Lancer les serveurs

1. **Démarrer le Backend :**
   \`npm run backend:dev\`

2. **Démarrer le Frontend (Mode Normal) :**
   \`npm run frontend:dev\`
