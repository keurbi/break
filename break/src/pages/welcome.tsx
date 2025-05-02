import React from 'react';
import Layout from '../components/Layout';

const WelcomePage = () => {
  const firstName = "John";
  const breaksTaken = 4;
  const breakMinutes = 45;
  const wellnessStreak = 5;
  const sessionsForAchievement = 2;
  const nextBreakTime = "10:30 AM";
  const recommendedActivity = "Exercice de respiration de 5 minutes";
  const stressScore = 3;

  return (
    <Layout>
      <div className="p-8 h-full">
        <div className="flex flex-col gap-4 h-full">
          <div className="flex-1 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-3xl font-extrabold mb-6 text-gray-800">👋 Bon retour, {firstName} !</h2>
            <p className="text-lg text-gray-700">
              Hier, vous avez pris <strong className="underline">{breaksTaken}</strong> pauses totalisant <strong className="underline">{breakMinutes} minutes</strong>.
            </p>
            <p className="text-lg mt-2 text-gray-700">
              🔥 Vous êtes sur une série de bien-être de <strong className="underline">{wellnessStreak} jours</strong> !
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
                <span className="text-gray-500">Graphique de l'activité de la semaine passée</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WelcomePage;
