import admin from './src/config/firebase';

const email = 'admin@admin.com';

async function setManagerRole() {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role: 'manager' });
    console.log(`Rôle manager attribué à ${email}`);
  } catch (error) {
    console.error(error);
  }
}

setManagerRole();