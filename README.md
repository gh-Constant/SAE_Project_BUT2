# SAEProjectBUT2

## Prerequis

- Installer les dependances a la racine:
`npm install`

## 1. Lancer seulement le frontend

### Mode mock (sans backend)
`npm run frontend:dev:mock`

## 2. Lancer le projet complet (backend + frontend)

### Etape A: Base de donnees

Option Docker (recommande):
`docker-compose up -d`

Option MySQL local:
- Configurer `backend/.env` avec les bons acces MySQL.

### Etape B: Initialiser Prisma

1. Generer le client:
`npx prisma generate`

2. Appliquer le schema:
`npx prisma db push`

### Etape C: Seeder la base (manuel)

Le backend ne seed plus automatiquement au demarrage.
Lancer les seeds explicitement avec:
`npm run backend:seed`

### Etape D: Demarrer les serveurs

1. Backend:
`npm run backend:dev`

2. Frontend:
`npm run frontend:dev`
