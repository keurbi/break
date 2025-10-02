// backend/src/config/firebase.ts
import admin from "firebase-admin";
import dotenv from "dotenv";

// Charger .env au plus tôt
dotenv.config();

/**
 * Priorités d'initialisation des identifiants Firebase Admin :
 * 1. FIREBASE_SERVICE_ACCOUNT_BASE64 (JSON encodé Base64)
 * 2. FIREBASE_SERVICE_ACCOUNT_JSON (JSON brut inline)
 * 3. Triplet FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY
 */
const buildCredentialObject = (): {
  projectId: string;
  clientEmail: string;
  privateKey: string;
} | null => {
  try {
    // Méthode Base64
    const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    if (b64) {
      const decoded = Buffer.from(b64, "base64").toString("utf8");
      const json = JSON.parse(decoded);
      return {
        projectId: json.project_id,
        clientEmail: json.client_email,
        privateKey: json.private_key,
      };
    }

    // Méthode JSON inline
    const jsonInline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (jsonInline) {
      const json = JSON.parse(jsonInline);
      return {
        projectId: json.project_id,
        clientEmail: json.client_email,
        privateKey: json.private_key,
      };
    }

    // Méthode triplet séparé
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (privateKey) {
      // Remplacer \n littéraux par vrais retours chariot
      privateKey = privateKey.replace(/\\n/g, "\n");
    }
    if (projectId && clientEmail && privateKey) {
      return { projectId, clientEmail, privateKey };
    }
    return null;
  } catch (err) {
    console.error("Erreur parsing des identifiants Firebase:", err);
    return null;
  }
};

const initializeFirebase = () => {
  if (admin.apps.length > 0) return;
  const creds = buildCredentialObject();
  if (!creds) {
    // Ne pas throw en production si on veut que d'autres endpoints non-firebase vivent
    const msg =
      "Firebase non initialisé: variables manquantes. Voir .env.example (FIREBASE_*).";
    if (process.env.NODE_ENV === "production") {
      console.error(msg);
    } else {
      console.warn(msg);
    }
    return;
  }
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: creds.projectId,
      clientEmail: creds.clientEmail,
      privateKey: creds.privateKey,
    }),
  });
  console.log("Firebase Admin initialisé (project:", creds.projectId, ")");
};

initializeFirebase();
export default admin;
