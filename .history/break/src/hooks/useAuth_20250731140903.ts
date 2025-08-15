import { useState, useEffect } from 'react';

// Hook temporaire pour simuler l'authentification
// À remplacer par une vraie logique d'authentification
export const useAuth = () => {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation d'une vérification d'authentification
    // En pratique, vous voudriez vérifier avec Firebase Auth ou votre système d'auth
    const checkAuth = () => {
      // Pour l'instant, on simule un utilisateur connecté
      setUser({ id: 'user1', email: 'user@example.com' });
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
