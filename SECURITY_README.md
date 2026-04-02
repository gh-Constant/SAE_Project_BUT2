# Sécurisation du projet — Module R401
**Projet SAE "Les Terres du Lion"** — BUT Informatique, Semestre 4

---

## Contexte

Dans le cadre du module R401 (Sécurité Web), on a réalisé un audit de sécurité complet de notre projet et on a appliqué les corrections nécessaires en se basant sur le référentiel OWASP Top 10 (2021) et les bonnes pratiques vues en cours.

Le projet est une application web Node.js / Express avec un frontend Vue.js. L'API gère l'authentification JWT, un système de paiement Stripe, une base de données MySQL via Prisma, et tout un système de gamification (quêtes, gold, etc.).

---

## 1. Ce qu'on a fait et pourquoi

### 1.1 Ajout des middlewares de sécurité

**Fichier modifié :** `backend/src/app.ts`

La première chose qu'on a faite, c'est d'ajouter les middlewares de sécurité de base qui manquaient au projet. On s'est rendu compte que le serveur ne renvoyait aucun header de protection, qu'il n'y avait aucune limite sur le nombre de requêtes, et qu'il n'y avait rien contre la pollution de paramètres HTTP.

Concrètement, on a ajouté trois choses :

- **Helmet.js** — C'est un package qui ajoute automatiquement une dizaine de headers HTTP de sécurité d'un coup. Par exemple `X-Content-Type-Options: nosniff` empêche le navigateur de deviner le type MIME d'une ressource (ce qui peut mener à des attaques XSS), `X-Frame-Options: SAMEORIGIN` empêche notre site d'être embarqué dans une iframe sur un autre domaine (clickjacking), etc. Avant, le serveur ne renvoyait aucun de ces headers.

- **hpp** (HTTP Parameter Pollution) — Ce middleware nettoie les paramètres de requête dupliqués. Si quelqu'un envoie `?role=admin&role=user`, sans hpp Express crée un tableau `['admin', 'user']` ce qui peut poser problème si le code ne s'attend qu'à une string. hpp ne garde que la dernière valeur.

- **express-rate-limit** — On a mis en place deux niveaux de limitation :
  - **Global** : 100 requêtes max par fenêtre de 15 minutes, par IP. Ca suffit largement pour un usage normal mais ça bloque les bots et les scripts automatisés.
  - **Sur /auth/login** : 5 tentatives max par heure (fichier `authRoutes.ts`). C'est le plus important parce que c'est la porte d'entrée pour les attaques brute force. Si quelqu'un essaie de deviner un mot de passe en boucle, il est bloqué au bout de 5 essais.

### 1.2 Suppression des secrets en dur dans le code

**Fichiers modifiés :** `authService.ts`, `auth.middleware.ts`, `gold.controller.ts`

C'est probablement la faille la plus critique qu'on a trouvée. A plusieurs endroits dans le code, il y avait des fallbacks comme :

```javascript
// AVANT (dangereux)
jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret_key_change_in_prod', ...)
```

Le problème c'est que si la variable d'environnement `JWT_SECRET` n'est pas définie (par exemple quelqu'un qui clone le repo et lance le serveur sans configurer le `.env`), le serveur fonctionne quand même avec un secret visible dans le code source. N'importe qui qui lit le code sur GitHub peut alors fabriquer des faux tokens JWT et se faire passer pour n'importe quel utilisateur.

**Notre correction :** Le serveur vérifie au démarrage que `JWT_SECRET` est bien défini. Si ce n'est pas le cas, il refuse de démarrer et affiche un message d'erreur clair. On a fait pareil pour la clé Stripe.

```javascript
// APRES (sécurisé)
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET manquant dans les variables d\'environnement');
}
const JWT_SECRET: string = process.env.JWT_SECRET;
```

### 1.3 Renforcement de l'authentification et des mots de passe

**Fichiers modifiés :** `authService.ts`, `auth.controller.ts`

Le projet utilisait déjà bcrypt pour hasher les mots de passe, ce qui est bien — on n'a pas eu besoin de remplacer MD5 ou SHA1. Par contre on a quand même amélioré deux choses :

- **Passage de 10 à 12 salt rounds.** En cours on a vu que chaque round supplémentaire double le temps de calcul. Passer de 10 à 12, ça veut dire que le hash est environ 4 fois plus lent à calculer. Pour un utilisateur qui se connecte, la différence est imperceptible (~250ms au lieu de ~60ms). Mais pour un attaquant qui essaie des millions de combinaisons, ça change tout.

- **Expiration JWT passée de 1h à 2h.** C'est un compromis entre sécurité et confort d'utilisation. Un token qui expire trop vite force l'utilisateur à se reconnecter souvent, un token qui expire trop tard reste valide longtemps en cas de vol.

On a aussi vérifié que le payload JWT ne contient que `id`, `email` et `role`. Pas de mot de passe, pas d'infos personnelles — juste ce qu'il faut pour identifier l'utilisateur.

### 1.4 Protection des données sensibles dans les réponses API

**Fichiers modifiés :** `authService.ts`, `auth.controller.ts`

On a trouvé que les endpoints `/auth/login` et `/auth/register` renvoyaient l'objet utilisateur complet, y compris le champ `password_hashed`. Même si c'est un hash bcrypt et pas le mot de passe en clair, ça ne devrait jamais sortir du serveur. Un attaquant pourrait utiliser le hash pour des attaques offline (rainbow tables, etc.).

On utilise maintenant la destructuration ES6 pour retirer les champs sensibles avant d'envoyer la réponse :

```javascript
const { password_hashed, reset_token, reset_token_expiry, ...safeUser } = user;
return { user: safeUser, token };
```

### 1.5 Gestion des erreurs en production

**Fichiers modifiés :** `error.middleware.ts`, `auth.controller.ts`

En développement, c'est pratique d'avoir le message d'erreur complet et la stack trace pour débugger. Mais en production, ces informations donnent à un attaquant des détails sur la structure interne du code, les noms de fichiers, les versions des librairies, etc.

On a modifié le middleware d'erreur global pour qu'il renvoie un message générique en production (`"Une erreur est survenue"`) tout en loggant les détails côté serveur pour qu'on puisse quand même investiguer les bugs.

Dans les controllers, on a aussi remplacé les réponses qui renvoyaient directement `error.message` (erreurs 500) par des messages génériques. Les erreurs métier comme "Utilisateur non trouvé" (401) restent telles quelles parce que le frontend en a besoin.

### 1.6 Sécurisation de la configuration

**Fichiers modifiés :** `.gitignore`, `backend/.env.example`, `backend/src/config/app.config.ts`

On a découvert que le fichier `.env` n'était **pas dans le `.gitignore`**. C'est une faille assez grave parce que ça veut dire que les secrets (mot de passe de la base de données, clé JWT, clé Stripe, identifiants SMTP) pouvaient être commités par erreur dans le dépôt Git. Si le repo est public ou si quelqu'un accède à l'historique, tous les secrets sont exposés.

On a ajouté `.env`, `.env.local` et `.env.production` dans le `.gitignore`, et on a mis à jour le fichier `.env.example` pour que tous les membres de l'équipe sachent quelles variables configurer (notamment `STRIPE_SECRET_KEY` qui n'était pas documenté).

Côté CORS, on a aussi retiré l'origine HTTP en production. Tout doit passer par HTTPS, sinon les données transitent en clair sur le réseau.

---

## 2. Les vulnérabilités qu'on a corrigées (OWASP Top 10)

| Ref. OWASP | Nom | Ce qu'on a trouvé | Correction appliquée |
|:---:|---|---|---|
| A01 | Broken Access Control | `password_hashed` renvoyé au client dans les réponses `/login` et `/register` | Exclusion des champs sensibles via destructuration avant envoi |
| A02 | Cryptographic Failures | Secret JWT hardcodé en fallback (`'dev_secret_key_change_in_prod'`) visible dans le code source | Crash au démarrage si `JWT_SECRET` n'est pas configuré |
| A02 | Cryptographic Failures | bcrypt avec seulement 10 rounds | Passage à 12 rounds sur tous les appels `bcrypt.hash()` |
| A02 | Cryptographic Failures | `.env` absent du `.gitignore`, risque de fuite des secrets via Git | `.env` ajouté dans le `.gitignore` |
| A03 | Injection | Vérification de toutes les requêtes SQL du projet | Prisma utilise des requêtes paramétrées nativement, aucune injection trouvée |
| A04 | Insecure Design | Aucun rate limiting en place malgré une configuration déjà prévue | Rate limiting global (100/15min) + strict sur le login (5/h) |
| A05 | Security Misconfiguration | Aucun header de sécurité HTTP (pas de Helmet) | `helmet()` ajouté en premier middleware |
| A05 | Security Misconfiguration | Pas de protection contre la pollution de paramètres | `hpp()` ajouté |
| A05 | Security Misconfiguration | CORS qui autorisait le HTTP en production | Origine HTTP retirée, HTTPS uniquement |
| A05 | Security Misconfiguration | Clé Stripe avec fallback `'sk_test_dummy'` dans le code | Fallback supprimé, warning si la variable n'est pas définie |
| A09 | Security Logging Failures | Messages d'erreur internes (`error.message`, `error.stack`) envoyés au client | Messages génériques en prod, détails loggés côté serveur seulement |

**Note sur A03 (Injection SQL) :** On n'a trouvé aucune requête SQL construite par concaténation de chaînes dans le projet. Toutes les interactions avec la base de données passent par Prisma, qui utilise des requêtes paramétrées. C'est l'avantage d'utiliser un ORM moderne.

**Note sur le XSS :** Le backend est une API REST pure qui renvoie uniquement du JSON (`Content-Type: application/json`). Il n'y a pas de rendu HTML côté serveur, donc le risque de XSS côté backend est très faible. Le frontend Vue.js échappe automatiquement les variables dans les templates, ce qui protège du XSS côté client.

---

## 3. Ce qu'on aurait fait avec plus de temps

Si on avait eu plus de temps sur ce projet, voici ce qu'on aurait ajouté :

**Un reverse proxy NGINX.** Dans un vrai déploiement en production, on ne laisse pas Express gérer tout seul. On met un serveur NGINX devant qui s'occupe du SSL/TLS (terminaison HTTPS), du rate limiting au niveau réseau, de la compression gzip et des fichiers statiques. C'est plus performant et plus sécurisé que de tout faire au niveau de l'application.

**Des logs structurés avec Winston.** Pour l'instant, on log les erreurs avec `console.error` et c'est tout. En production, il faudrait un système de logs avec des niveaux (info, warn, error), des timestamps, une rotation automatique des fichiers et idéalement un envoi vers un service de monitoring externe. Winston est le standard dans l'écosystème Node.js pour ça.

**De la validation de schémas avec Zod ou Joi.** Les routes de l'API acceptent les données du body sans vraiment valider leur structure. On pourrait définir des schémas Zod pour chaque endpoint et rejeter les requêtes mal formées avant même qu'elles arrivent au controller. Ca éviterait des erreurs Prisma inattendues et ça rendrait l'API plus robuste.

---

## 4. Comment tester que la sécurisation fonctionne

### Vérifier les headers de sécurité
```bash
curl -I http://localhost:3000/api/v1/auth/login
```
On doit voir apparaitre les headers ajoutés par Helmet : `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection`, etc. Avant notre modification, ces headers n'apparaissaient pas.

### Tester le rate limiting sur le login
```bash
for i in {1..6}; do
  echo "Tentative $i : $(curl -s -o /dev/null -w '%{http_code}' \
    -X POST http://localhost:3000/api/v1/auth/login \
    -H 'Content-Type: application/json' \
    -d '{"email":"test@test.com","password":"wrong"}')"
done
```
Les 5 premières tentatives doivent renvoyer `401` (identifiants invalides). La 6eme doit renvoyer `429` (Too Many Requests) avec le message de rate limiting.

### Vérifier que le mot de passe hashé ne fuit pas
```bash
curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}' | grep -i "password_hashed"
```
Si la commande ne retourne rien, c'est bon : le champ `password_hashed` n'est plus dans la réponse.

### Vérifier le comportement des erreurs en production
```bash
NODE_ENV=production node backend/dist/main.js
# Provoquer une erreur 500 — le client doit recevoir "Une erreur est survenue"
# et non pas le vrai message d'erreur interne
```

### Lancer un audit des dépendances
```bash
npm audit
```
Au moment de notre audit, on a trouvé 50 vulnérabilités (39 high, 6 moderate, 5 low). Elles viennent principalement des dépendances transitives de `sqlite3` et `tar`, pas de notre code directement. La plupart se corrigent avec `npm audit fix`.

### Tester une tentative d'injection SQL
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin\" OR 1=1 --","password":"test"}'
```
Prisma utilise des requêtes paramétrées, donc l'injection ne passe pas. Le serveur renvoie simplement "Utilisateur non trouvé".

---

## 5. Variables d'environnement nécessaires

Toutes ces variables doivent etre definies dans le fichier `backend/.env`. Un template est fourni dans `backend/.env.example`.

| Variable | Obligatoire | Description |
|---|:---:|---|
| `DATABASE_URL` | Oui | URL de connexion MySQL (`mysql://user:pass@host:port/db`) |
| `SHADOW_DATABASE_URL` | Oui | URL de la BDD shadow pour les migrations Prisma |
| `JWT_SECRET` | **Oui** | Secret pour signer les tokens JWT. Le serveur ne demarre pas sans. Doit etre long et aleatoire. |
| `STRIPE_SECRET_KEY` | Non | Cle secrete Stripe pour les paiements Gold (`sk_test_...` en dev) |
| `SMTP_HOST` | Non | Serveur SMTP pour les emails (`smtp.gmail.com`) |
| `SMTP_PORT` | Non | Port SMTP (`587`) |
| `SMTP_USER` | Non | Adresse email pour l'envoi SMTP |
| `SMTP_PASS` | Non | Mot de passe d'application Gmail (16 caracteres) |
| `SMTP_FROM` | Non | Adresse d'expediteur des emails |
| `FRONTEND_URL` | Non | URL du frontend pour les liens dans les emails |
| `NODE_ENV` | Non | `development` (defaut) ou `production` |

---

## Recapitulatif des fichiers modifies

| Fichier | Ce qui a change |
|---|---|
| `backend/src/app.ts` | Ajout de `helmet()`, `hpp()`, `rateLimit()` en middlewares |
| `backend/src/routes/authRoutes.ts` | Rate limiting strict sur `/login` (5 tentatives/h) |
| `backend/src/config/app.config.ts` | Suppression de l'origine HTTP en production dans le CORS |
| `backend/src/services/authService.ts` | JWT secret depuis .env (plus de fallback), bcrypt 12 rounds, exclusion du password des reponses |
| `backend/src/middleware/auth.middleware.ts` | JWT secret depuis .env (plus de fallback) |
| `backend/src/middleware/error.middleware.ts` | Messages d'erreur generiques en production |
| `backend/src/controllers/auth.controller.ts` | Exclusion du password dans register, messages 500 generiques, bcrypt 12 rounds |
| `backend/src/controllers/gold.controller.ts` | Suppression du fallback Stripe |
| `.gitignore` | Ajout de `.env`, `.env.local`, `.env.production` |
| `backend/.env.example` | Ajout de `STRIPE_SECRET_KEY`, nettoyage des valeurs par defaut |

**Packages installes :** `helmet`, `hpp`, `express-rate-limit`, `@types/hpp`
