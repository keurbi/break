import React, { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { createCheckoutAndRedirect } from '../services/paymentsService';
import DonationModal from '../components/DonationModal';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useDashboardData } from '../hooks/useDashboardData';

const WelcomePage = () => {
  const { profile } = useCurrentUser();
  const { stats } = useDashboardData();

  const firstName = profile?.firstName || (profile?.displayName?.split(' ')[0] ?? 'Utilisateur');
  // Aujourd'hui
  const breaksTaken = stats.totalPauses;
  const breakMinutes = stats.totalMinutes;
  // Série bien-être simple: nombre de jours consécutifs avec au moins 1 pause (approx locale)
  const wellnessStreak = useMemo(() => {
    // basique: si aujourd'hui >0, on affiche 1; laisse à 0 sinon.
    return breaksTaken > 0 ? 1 : 0;
  }, [breaksTaken]);
  const sessionsForAchievement = 2; // placeholder tant que pas de règle métier précise
  const nextBreakTime = '10:30'; // placeholder UX – peut être calculé via heuristique
  const recommendedActivity = 'Exercice de respiration de 5 minutes';
  const stressScore = Math.max(1, Math.round(5 - stats.avgStressReduction));

  const [donateOpen, setDonateOpen] = useState<boolean>(false);

  const startDonation = async (amountCents: number) => {
    try {
      await createCheckoutAndRedirect(amountCents);
    } catch {
      console.error('Stripe redirect failed');
      alert('Erreur lors de la redirection vers Stripe');
    }
  };

  return (
    <Layout>
      <div className="p-8 h-full">
        <div className="flex flex-col gap-4 h-full">
          <div className="flex-1 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-800">👋 Bon retour, {firstName} !</h2>
            <p className="text-lg text-gray-700">
              Aujourd’hui, vous avez pris <strong className="underline">{breaksTaken}</strong> pauses totalisant <strong className="underline">{breakMinutes} minutes</strong>.
            </p>
            <p className="text-lg mt-2 text-gray-700">
              🔥 Vous êtes sur une série de bien‑être de <strong className="underline">{wellnessStreak} jours</strong> !
            </p>
            <p className="text-lg mt-2 text-gray-700">
              🏆 Plus que <strong className="underline">{sessionsForAchievement} sessions</strong> pour atteindre ‘Maître de la pleine conscience’ !
            </p>
          </div>
          <div className="flex-2 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-800">🕒 Suggestions & Recommandations</h2>
            <div className="flex">
              <div className="w-1/2">
                <p className="text-lg text-gray-700">
                  Meilleur moment pour votre prochaine pause : <strong className="underline">{nextBreakTime}</strong>
                </p>
              </div>
              <div className="w-1/2">
                <p className="text-lg text-gray-700">
                  Activité recommandée : <strong className="underline">{recommendedActivity}</strong>
                </p>
              </div>
            </div>
          </div>
          <div className="flex-2 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-800">💆 Stress Level</h2>
            <div className="flex items-start justify-between">
              <p className="text-lg text-gray-700">
                Votre score de stress actuel est : <strong className="underline">{stressScore}</strong>
              </p>
              <div className="w-1/2 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Graphique de l’activité de la semaine passée</span>
              </div>
            </div>
          </div>
      {/* Donate Card */}
          <div className="flex-2 bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-gray-800">Soutenir Break</h2>
              <button
                type="button"
                onClick={() => setDonateOpen(true)}
                className="bg-[#7346FF] hover:bg-[#5a36cc] text-white font-bold px-4 py-2 rounded-lg shadow"
              >
                Faire un don
              </button>
            </div>
            <p className="text-gray-600 mt-2">Vos dons aident à développer de nouvelles activités et fonctionnalités.</p>
          </div>
        </div>
      </div>

    <DonationModal open={donateOpen} onClose={() => setDonateOpen(false)} onDonate={startDonation} />
    </Layout>
  );
};

export default WelcomePage;
