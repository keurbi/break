# Commandes utiles

## Backend (Express)

- Installation: `cd backend && npm install`
- Développement (ts-node + nodemon): `npm run dev`
- Build: `npm run build`
- Lancement: `npm start`
- Tests: `npm test`
- Couverture: `npm run test:coverage`

## Frontend (Next.js)

- Installation: `cd break && npm install`
- Développement: `npm run dev`
- Build: `npm run build`
- Lancement (prévisualisation): `npm run start`
- Tests (si configurés): `npm test`

## Environnements

- Frontend: créer `break/.env.local` (voir `break/README.md`)
- Backend: créer `backend/.env` (voir `break/README.md`)

## Notes

- Le webhook Stripe nécessite un corps brut (voir `backend/src/app.ts`).
- Pour les rôles, utilisez les scripts dans `backend/` (`setAdminRole.ts`, `setManagerRole.ts`, `setUserRole.ts`).
