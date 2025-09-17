# SAEProjectBUT2

## Comment démarrer le frontend

1. Installer les dépendances : `npm install`
2. Lancer le serveur de développement : `npm run frontend:dev`
   - Pour démarrer sans backend : `npm run frontend:dev -- --mode=nobackend` (Premier livrable)
3. Vérifier les types : `npm run frontend:typecheck`

   💡 *Note : Le déploiement sur le vrai site internet ne marche pas s'il y a des erreurs de types.*

⚠️ **Pour chaque page, vous devez faire les traductions avec i18n dans le dossier locales**

⚠️ **Pour chaque marqueur prédéfini, vous devez les mettre dans /utils/predefinedmarkers.ts**
