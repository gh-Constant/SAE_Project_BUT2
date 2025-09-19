# SAEProjectBUT2

## Comment démarrer le frontend

1. Installer les dépendances : `npm install`
2. Lancer le serveur de développement : `npm run frontend:dev`
   - Pour démarrer sans backend : `npm run frontend:dev -- --mode=nobackend` (Premier livrable)
3. Vérifier les types : `npm run frontend:typecheck`

## Comment démarrer le backend

1. Démarrer la base de données (voir section ci-dessus)
2. Installer les dépendances : `npm install`
3. Lancer le serveur de développement : `npm run backend:dev`
4. Tester la connexion à la base de données : `curl http://localhost:3000/test-users`

   💡 *Note : Le déploiement sur le vrai site internet ne marche pas s'il y a des erreurs de types.*

⚠️ **Pour chaque page, vous devez faire les traductions avec i18n dans le dossier locales**

⚠️ **Pour chaque marqueur prédéfini, vous devez les mettre dans /utils/predefinedmarkers.ts**
