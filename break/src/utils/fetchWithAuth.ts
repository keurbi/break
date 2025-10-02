import { getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Appelle fetch et ajoute l’en-tête Authorization si un token Firebase est dispo.
// Si aucun token en localStorage, on tente de le récupérer via Firebase (si initialisé).
export function redirectToLogin() {
  if (typeof window !== 'undefined' && window.location) {
    if (typeof window.location.assign === 'function') {
      window.location.assign("/login");
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.location.href = "/login";
    }
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = localStorage.getItem("token");

  // If no token in storage, try to get it from Firebase Auth
  if (!token && getApps().length > 0) {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        token = await user.getIdToken();
        localStorage.setItem("token", token);
      }
    } catch {
      // On ignore si Firebase n’est pas configuré côté client
    }
  }

  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  } as HeadersInit;

  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    redirectToLogin();
    return null;
  }
  return res;
}
