import React from 'react';
import Layout from '../components/Layout';

const WelcomePage = () => {
  const firstName = "John"; // Example name, replace with dynamic data as needed
  const breaksTaken = 4;
  const breakMinutes = 45;
  const wellnessStreak = 5;
  const sessionsForAchievement = 2;
  const nextBreakTime = "10:30 AM";
  const recommendedActivity = "Exercice de respiration de 5 minutes";
  const stressScore = 3; // Example stress score, replace with dynamic data as needed

  return (
    <Layout>
      <div className="p-8">
        <div className="grid grid-rows-5 gap-4 h-[calc(100vh-100px)]">
          <div className="row-span-1 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-3xl font-extrabold mb-2 text-gray-800">👋 Bon retour, {firstName} !</h2>
            <p className="text-lg text-gray-700">Hier, vous avez pris <strong>{breaksTaken}</strong> pauses totalisant <strong>{breakMinutes} minutes</strong>.</p>
            <p className="text-lg mt-2 text-gray-700">🔥 Vous êtes sur une série de bien-être de <strong>{wellnessStreak} jours</strong> !</p>
            <p className="text-lg mt-2 text-gray-700">🏆 Plus que <strong>{sessionsForAchievement} sessions</strong> pour atteindre ‘Maître de la pleine conscience’ !</p>
          </div>
          <div className="row-span-2 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-3xl font-extrabold mb-4 text-gray-800">🕒 Suggestions & Recommandations</h2>
            <div className="flex">
              <div className="w-1/2">
                <p className="text-lg text-gray-700">Meilleur moment pour votre prochaine pause : <strong>{nextBreakTime}</strong></p>
              </div>
              <div className="w-1/2">
                <p className="text-lg text-gray-700">Activité recommandée : <strong>{recommendedActivity}</strong></p>
              </div>
            </div>
          </div>
          <div className="row-span-2 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-3xl font-extrabold mb-4 text-gray-800">💆 Stress Level</h2>
            <p className="text-lg text-gray-700">Votre score de stress actuel est : <strong>{stressScore}</strong></p>
            {/* Additional content for this card can be added here */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WelcomePage;
