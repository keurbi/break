import admin from "./src/config/firebase";

function parseArgs() {
  const args = process.argv.slice(2);
  const result: { email?: string; revoke?: boolean } = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if ((a === "--email" || a === "-e") && args[i + 1]) {
      result.email = args[i + 1];
      i++;
    } else if (a === "--revoke") {
      result.revoke = true;
    }
  }
  return result;
}

function usage(): never {
  console.log(
    "Usage: ts-node setAdminRole.ts --email <user@example.com> [--revoke]"
  );
  process.exit(1);
}

async function main() {
  const { email, revoke } = parseArgs();
  if (!email) usage();

  try {
    console.log("Firebase Admin initialisé");
    const user = await admin.auth().getUserByEmail(email!);
    const current = user.customClaims || {};
    const claims = { ...current, role: "admin" };
    await admin.auth().setCustomUserClaims(user.uid, claims);
    if (revoke) {
      await admin.auth().revokeRefreshTokens(user.uid);
    }
    console.log(
      `OK: rôle 'admin' attribué à ${email}${
        revoke ? " (tokens révoqués)" : ""
      }.`
    );
    console.log(
      "Note: l’utilisateur doit se déconnecter/reconnecter pour rafraîchir les claims."
    );
  } catch (err) {
    console.error("Erreur:", err);
    process.exit(1);
  }
}

main();
