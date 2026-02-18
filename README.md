# Carte Dynamique v3

## Stack déployable sur Vercel (sans PHP)

L'application utilise maintenant :
- Front statique (`index.html`, `css`, `js`)
- API Vercel Serverless en Node.js (`/api/get-appels`, `/api/geocode`)
- PostgreSQL Neon via `DATABASE_URL`

## Variable d'environnement

Configurer `DATABASE_URL` (Neon) :

```bash
postgresql://neondb_owner:npg_knZl54OPgryH@ep-polished-paper-agbe7624-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

## Initialiser la base Neon

```bash
psql "$DATABASE_URL" -f appel.sql
```

## Déploiement Vercel

1. Installer dépendances :

```bash
npm install
```

2. Login + premier déploiement :

```bash
npx vercel login
npx vercel
```

3. Ajouter la variable d'environnement :

```bash
npx vercel env add DATABASE_URL production
npx vercel env add DATABASE_URL preview
```

4. Déployer en production :

```bash
npx vercel --prod
```

## Endpoints API

- `GET /api/get-appels` : renvoie les appels depuis `liste_appel`
- `POST /api/geocode` : géocode les adresses sans coordonnées puis met à jour la base
