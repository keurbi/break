import { useState, useEffect } from "react";

// Petit hook client qui expose un état d'auth simplifié pendant le dev.
// À remplacer par l’intégration Firebase Auth (ou autre) quand elle sera prête.
export const useAuth = () => {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation d'une vérification d'auth côté client
    const checkAuth = () => {
      // Pour l’instant, on simule un utilisateur connecté
      setUser({ id: "user1", email: "user@example.com" });
      setLoading(false);
    };

    checkAuth();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
};
// Gestion simple de l’état d’auth côté client (sans persistance réelle)
