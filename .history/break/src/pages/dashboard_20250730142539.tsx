import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import PageTitleCard from '../components/PageTitleCard';
import PageContainer from '../components/PageContainer';
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { app } from '../firebase';

type Break = {
  id: number;
  start: string;
  end?: string;
  note?: number;
  userId?: string;
  timeStart?: string;
};

type Activity = {
  id: string;
  title: string;
  type: string;
  subType: string;
  duration: number;
  difficulty: number;
  description: string;
  benefits: string[];
  tags: string[];
  tips: string[];
  resource?: string;
};

type ActivitySession = {
  id: string;
  activityId: string;
  userId: string;
  date: string;
  duration: number;
  feedback: {
    stressBefore: number;
    stressAfter: number;
    energyBefore: number;
    energyAfter: number;
    moodBefore: number;
    moodAfter: number;
    difficulty: number;
    motivation: number;
    pain: number;
    concentration: number;
  };
};

function getMinutes(start: string, end?: string) {
  if (!end) return 0;
  const [h1, m1, s1] = start.split(':').map(Number);
  const [h2, m2, s2] = end.split(':').map(Number);
  const date1 = new Date();
  date1.setHours(h1, m1, s1 || 0, 0);
  const date2 = new Date();
  date2.setHours(h2, m2, s2 || 0, 0);
  return Math.round((date2.getTime() - date1.getTime()) / 60000);
}

function isToday(dateString: string) {
  const d = new Date(dateString);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

function isThisWeek(dateString: string) {
  const d = new Date(dateString);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  return d >= weekStart;
}

const Dashboard = () => {
  const [breaks, setBreaks] = useState<Break[]>([]);
  const [activitySessions] = useState<ActivitySession[]>([
    // Données simulées pour démonstration
    {
      id: '1',
      activityId: '2DEbP3Fj42xwgZ7UibW2',
      userId: 'user1',
      date: new Date().toISOString(),
      duration: 10,
      feedback: {
        stressBefore: 7,
        stressAfter: 4,
        energyBefore: 4,
        energyAfter: 7,
        moodBefore: 5,
        moodAfter: 8,
        difficulty: 3,
        motivation: 8,
        pain: 1,
        concentration: 8
      }
    },
    {
      id: '2',
      activityId: '2DEbP3Fj42xwgZ7UibW2',
      userId: 'user1',
      date: new Date(Date.now() - 86400000).toISOString(), // Hier
      duration: 8,
      feedback: {
        stressBefore: 8,
        stressAfter: 5,
        energyBefore: 3,
        energyAfter: 6,
        moodBefore: 4,
        moodAfter: 7,
        difficulty: 4,
        motivation: 7,
        pain: 2,
        concentration: 7
      }
    }
  ]);

  useEffect(() => {
    const savedBreaks = localStorage.getItem('breaks');
    if (savedBreaks) {
      try {
        const parsed = JSON.parse(savedBreaks);
        if (Array.isArray(parsed)) setBreaks(parsed);
      } catch (e) {
        setBreaks([]);
      }
    }
  }, []);

  // Statistiques des pauses
  const todayBreaks = breaks.filter(b => b.timeStart && isToday(b.timeStart));
  const weekBreaks = breaks.filter(b => b.timeStart && isThisWeek(b.timeStart));
  
  const totalPauses = todayBreaks.length;
  const totalMinutes = todayBreaks.reduce((sum, b) => sum + getMinutes(b.start, b.end), 0);
  const avgMinutes = totalPauses > 0 ? Math.round(totalMinutes / totalPauses) : 0;
  const weekTotalPauses = weekBreaks.length;
  const weekTotalMinutes = weekBreaks.reduce((sum, b) => sum + getMinutes(b.start, b.end), 0);

  // Statistiques des activités
  const todayActivities = activitySessions.filter(s => isToday(s.date));
  const weekActivities = activitySessions.filter(s => isThisWeek(s.date));
  
  const avgStressReduction = activitySessions.length > 0 
    ? activitySessions.reduce((sum, s) => sum + (s.feedback.stressBefore - s.feedback.stressAfter), 0) / activitySessions.length
    : 0;
  
  const avgEnergyGain = activitySessions.length > 0
    ? activitySessions.reduce((sum, s) => sum + (s.feedback.energyAfter - s.feedback.energyBefore), 0) / activitySessions.length
    : 0;
  
  const avgMoodImprovement = activitySessions.length > 0
    ? activitySessions.reduce((sum, s) => sum + (s.feedback.moodAfter - s.feedback.moodBefore), 0) / activitySessions.length
    : 0;

  const avgConcentration = activitySessions.length > 0
    ? activitySessions.reduce((sum, s) => sum + s.feedback.concentration, 0) / activitySessions.length
    : 0;

  const avgMotivation = activitySessions.length > 0
    ? activitySessions.reduce((sum, s) => sum + s.feedback.motivation, 0) / activitySessions.length
    : 0;

  return (
    <Layout>
      <PageContainer>
        <PageTitleCard title="Mon Dashboard" />
        <div className="w-full bg-white rounded-xl shadow p-8">
          
          {/* Section Vue d'ensemble */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#7346FF] mb-6">📊 Vue d'ensemble du jour</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <h3 className="text-sm font-semibold text-blue-700 mb-2">Pauses aujourd'hui</h3>
                <p className="text-3xl font-bold text-blue-800">{totalPauses}</p>
                <p className="text-sm text-blue-600">{totalMinutes} min total</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <h3 className="text-sm font-semibold text-green-700 mb-2">Activités aujourd'hui</h3>
                <p className="text-3xl font-bold text-green-800">{todayActivities.length}</p>
                <p className="text-sm text-green-600">{todayActivities.reduce((sum, a) => sum + a.duration, 0)} min total</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                <h3 className="text-sm font-semibold text-purple-700 mb-2">Durée moy. pause</h3>
                <p className="text-3xl font-bold text-purple-800">{avgMinutes}</p>
                <p className="text-sm text-purple-600">minutes</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                <h3 className="text-sm font-semibold text-orange-700 mb-2">Concentration moy.</h3>
                <p className="text-3xl font-bold text-orange-800">{avgConcentration.toFixed(1)}/10</p>
                <p className="text-sm text-orange-600">après activité</p>
              </div>
            </div>
          </div>

          {/* Section Bien-être */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#7346FF] mb-6">💪 Impact sur le bien-être</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-red-50 to-pink-100 p-6 rounded-lg border border-pink-200">
                <h3 className="text-lg font-semibold text-pink-700 mb-2">🧘 Réduction du stress</h3>
                <p className="text-4xl font-bold text-pink-800">{avgStressReduction > 0 ? '+' : ''}{avgStressReduction.toFixed(1)}</p>
                <p className="text-sm text-pink-600">points en moyenne</p>
                <div className="mt-3 w-full bg-pink-200 rounded-full h-2">
                  <div 
                    className="bg-pink-600 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${Math.min(Math.abs(avgStressReduction) * 10, 100)}%`}}
                  ></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-700 mb-2">⚡ Gain d'énergie</h3>
                <p className="text-4xl font-bold text-orange-800">{avgEnergyGain > 0 ? '+' : ''}{avgEnergyGain.toFixed(1)}</p>
                <p className="text-sm text-orange-600">points en moyenne</p>
                <div className="mt-3 w-full bg-orange-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${Math.min(Math.abs(avgEnergyGain) * 10, 100)}%`}}
                  ></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg border border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-700 mb-2">😊 Amélioration humeur</h3>
                <p className="text-4xl font-bold text-emerald-800">{avgMoodImprovement > 0 ? '+' : ''}{avgMoodImprovement.toFixed(1)}</p>
                <p className="text-sm text-emerald-600">points en moyenne</p>
                <div className="mt-3 w-full bg-emerald-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${Math.min(Math.abs(avgMoodImprovement) * 10, 100)}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Statistiques de la semaine */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#7346FF] mb-6">📈 Statistiques de la semaine</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-700 mb-4">🏃‍♂️ Activités physiques</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600">Total cette semaine</span>
                    <span className="font-bold text-blue-800">{weekActivities.length} activités</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600">Temps total</span>
                    <span className="font-bold text-blue-800">{weekActivities.reduce((sum, a) => sum + a.duration, 0)} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600">Motivation moyenne</span>
                    <span className="font-bold text-blue-800">{avgMotivation.toFixed(1)}/10</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-violet-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-700 mb-4">⏸️ Pauses</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-600">Total cette semaine</span>
                    <span className="font-bold text-purple-800">{weekTotalPauses} pauses</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-600">Temps total</span>
                    <span className="font-bold text-purple-800">{weekTotalMinutes} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-600">Moyenne par jour</span>
                    <span className="font-bold text-purple-800">{Math.round(weekTotalPauses / 7)} pauses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Dernières activités */}
          <div>
            <h2 className="text-2xl font-bold text-[#7346FF] mb-6">🎯 Dernières activités</h2>
            {activitySessions.length > 0 ? (
              <div className="space-y-4">
                {activitySessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">Mobilité des hanches sur chaise</h3>
                        <p className="text-sm text-gray-600">{new Date(session.date).toLocaleDateString()} • {session.duration} min</p>
                      </div>
                      <div className="text-right">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          Terminée
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-gray-500">Stress</p>
                        <p className="font-bold text-blue-600">{session.feedback.stressBefore}→{session.feedback.stressAfter}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Énergie</p>
                        <p className="font-bold text-green-600">{session.feedback.energyBefore}→{session.feedback.energyAfter}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Humeur</p>
                        <p className="font-bold text-yellow-600">{session.feedback.moodBefore}→{session.feedback.moodAfter}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Difficulté</p>
                        <p className="font-bold text-purple-600">{session.feedback.difficulty}/10</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Motivation</p>
                        <p className="font-bold text-indigo-600">{session.feedback.motivation}/10</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Concentration</p>
                        <p className="font-bold text-orange-600">{session.feedback.concentration}/10</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg">Aucune activité réalisée pour le moment</p>
                <p className="text-gray-400 text-sm mt-2">Commencez une activité pour voir vos statistiques ici !</p>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Dashboard;