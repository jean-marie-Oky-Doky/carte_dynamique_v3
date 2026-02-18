# Carte Dynamique v3

## Base de données Neon (PostgreSQL) via `DATABASE_URL`

Le backend PHP utilise désormais uniquement la variable d'environnement `DATABASE_URL`.

Exemple (Neon) :

```bash
postgresql://neondb_owner:npg_knZl54OPgryH@ep-polished-paper-agbe7624-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

## Initialiser la base

1. Crée la table et les données de test :

```bash
psql "$DATABASE_URL" -f appel.sql
```

## Déploiement Vercel

1. Installer Vercel CLI (si nécessaire) :

```bash
npm i -g vercel
```

2. Se connecter :

```bash
vercel login
```

3. Depuis la racine du projet, lier puis déployer :

```bash
vercel
vercel --prod
```

4. Ajouter la variable d'environnement en production :

```bash
vercel env add DATABASE_URL production
```

Puis coller la chaîne Neon complète.

> Le projet contient `vercel.json` configuré pour exécuter les fichiers `.php` via le runtime `vercel-php`.
