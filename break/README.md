## Démarrage

[![CI](https://github.com/keurbi/break/actions/workflows/ci.yml/badge.svg)](https://github.com/keurbi/break/actions/workflows/ci.yml)

Lance le serveur de développement :

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur pour voir l’application.
Tu peux commencer à éditer via `app/page.tsx` (rechargement automatique activé).

## En savoir plus

## Configuration des environnements

Crée `break/.env.local` (ou copie `.env.local.example`) avec :

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_API_BASE (optional, default http://localhost:3100)
 - NEXT_PUBLIC_RESET_REDIRECT_URL (ex: http://localhost:3000/login)

Crée `backend/.env` (ou copie `backend/.env.example`) avec :

### Reset de mot de passe (Firebase)

- Assure-toi que le domaine de `NEXT_PUBLIC_RESET_REDIRECT_URL` est autorisé dans Firebase (Authentication > Settings > Authorized domains) et que l’URL est valide.
- L’email de reset est localisé (fr). Par sécurité, le message affiché est générique (évite l’énumération d’emails).

- NODE_ENV=development
- PORT=3100
- CORS_ORIGIN=http://localhost:3000
- RATE_LIMIT_MAX=300
- BODY_LIMIT=102400
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY (PowerShell: wrap in double quotes and keep \n escapes)

Exécution en local

- Backend : depuis `backend/` exécute `npm install`, `npm run build`, `npm run start`.
- Frontend : depuis `break/` exécute `npm install`, `npm run dev`.

Pour aller plus loin avec Next.js :

- [Documentation Next.js](https://nextjs.org/docs)
- [Tutoriel interactif](https://nextjs.org/learn)
