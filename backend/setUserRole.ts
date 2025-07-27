console.log('Script lancé');
import admin from './src/config/firebase';
console.log('Import admin OK');

const email = 'admin@admin.com'; // À remplacer par l'email cible
const role = 'manager'; // Ou 'user', 'admin', etc.

async function setUserRole() {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role });
    console.log(`Rôle ${role} attribué à ${email}`);
  } catch (error) {
    console.error(error);
  }
}

setUserRole();