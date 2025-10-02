# Commandes utiles

## Backend (Express)

- Installation: `cd backend && npm install`
- Lint: `npm run lint`
- Développement (ts-node + nodemon): `npm run dev`
- Build: `npm run build`
- Lancement: `npm start`
- Tests: `npm test`
- Couverture: `npm run test:coverage`

## Frontend (Next.js)

- Installation: `cd break && npm install`
- Lint: `npm run lint`
- Développement: `npm run dev`
- Build: `npm run build`
- Lancement (prévisualisation): `npm run start`
- Tests: `npm test`
- Couverture: `npm run test:coverage`

## Environnements

- Backend: créer `backend/.env` avec vos identifiants Firebase Admin et clés Stripe. Au moins l’un des blocs suivants:
	- FIREBASE_SERVICE_ACCOUNT_BASE64 (JSON encodé en Base64) ou
	- FIREBASE_SERVICE_ACCOUNT_JSON (JSON inline) ou
	- FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY (remplacer les \n par des retours à la ligne).
	- Paiements (optionnel): STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET

- Frontend: créer `break/.env.local` (Firebase Web config et éventuelles URLs d’API; voir `break/README.md`)
