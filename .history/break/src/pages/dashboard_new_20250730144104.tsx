import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import PageTitleCard from "../components/PageTitleCard";
import PageContainer from "../components/PageContainer";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { app } from "../firebase";

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
  const [h1, m1, s1] = start.split(":").map(Number);
  const [h2, m2, s2] = end.split(":").map(Number);
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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [recentActivitySessions, setRecentActivitySessions] = useState<
    ActivitySession[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch from localStorage for breaks
        const savedBreaks = localStorage.getItem("breaks");
        if (savedBreaks) {
          try {
            const parsed = JSON.parse(savedBreaks);
            if (Array.isArray(parsed)) setBreaks(parsed);
          } catch (e) {
            setBreaks([]);
          }
        }

        // Fetch activities from Firestore
        const db = getFirestore(app);

        // Get all activities
        const activitiesSnapshot = await getDocs(collection(db, "activities"));
        const fetchedActivities: Activity[] = [];
        activitiesSnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedActivities.push({
            id: doc.id,
            title: data.title || "",
            type: data.type || "",
            subType: data.subType || "",
            duration: data.duration || 0,
            difficulty: data.difficulty || 1,
            description: data.description || "",
            benefits: data.benefits || [],
            tags: data.tags || [],
            tips: data.tips || [],
            resource: data.resource || "",
          });
        });
        setActivities(fetchedActivities);

        // Sample activity sessions (replace with real user data)
        const sampleSessions: ActivitySession[] = [
          {
            id: "1",
            activityId: fetchedActivities[0]?.id || "activity1",
            userId: "user1",
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
              concentration: 8,
            },
          },
          {
            id: "2",
            activityId: fetchedActivities[1]?.id || "activity2",
            userId: "user1",
            date: new Date(Date.now() - 86400000).toISOString(),
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
              concentration: 7,
            },
          },
        ];
        setRecentActivitySessions(sampleSessions);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Statistiques des pauses
  const todayBreaks = breaks.filter((b) => b.timeStart && isToday(b.timeStart));
  const weekBreaks = breaks.filter(
    (b) => b.timeStart && isThisWeek(b.timeStart)
  );

  const totalPauses = todayBreaks.length;
  const totalMinutes = todayBreaks.reduce(
    (sum, b) => sum + getMinutes(b.start, b.end),
    0
  );
  const avgMinutes =
    totalPauses > 0 ? Math.round(totalMinutes / totalPauses) : 0;
  const weekTotalPauses = weekBreaks.length;
  const weekTotalMinutes = weekBreaks.reduce(
    (sum, b) => sum + getMinutes(b.start, b.end),
    0
  );

  // Statistiques des activités
  const todayActivities = recentActivitySessions.filter((s: ActivitySession) =>
    isToday(s.date)
  );
  const weekActivities = recentActivitySessions.filter((s: ActivitySession) =>
    isThisWeek(s.date)
  );

  const avgStressReduction =
    recentActivitySessions.length > 0
      ? recentActivitySessions.reduce(
          (sum: number, s: ActivitySession) =>
            sum + (s.feedback.stressBefore - s.feedback.stressAfter),
          0
        ) / recentActivitySessions.length
      : 0;

  const avgEnergyGain =
    recentActivitySessions.length > 0
      ? recentActivitySessions.reduce(
          (sum: number, s: ActivitySession) =>
            sum + (s.feedback.energyAfter - s.feedback.energyBefore),
          0
        ) / recentActivitySessions.length
      : 0;

  const avgMoodImprovement =
    recentActivitySessions.length > 0
      ? recentActivitySessions.reduce(
          (sum: number, s: ActivitySession) =>
            sum + (s.feedback.moodAfter - s.feedback.moodBefore),
          0
        ) / recentActivitySessions.length
      : 0;

  const avgConcentration =
    recentActivitySessions.length > 0
      ? recentActivitySessions.reduce(
          (sum: number, s: ActivitySession) => sum + s.feedback.concentration,
          0
        ) / recentActivitySessions.length
      : 0;

  const avgMotivation =
    recentActivitySessions.length > 0
      ? recentActivitySessions.reduce(
          (sum: number, s: ActivitySession) => sum + s.feedback.motivation,
          0
        ) / recentActivitySessions.length
      : 0;

  if (loading) {
    return (
      <Layout>
        <PageContainer>
          <PageTitleCard title="Mon Dashboard" />
          <div className="w-full bg-white rounded-xl shadow p-8 text-center">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageTitleCard title="Mon Dashboard Personnel" />

        {/* Grande Card Principale */}
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header de la card avec gradient */}
          <div className="bg-gradient-to-r from-[#7346FF] to-[#9C5AFF] text-white p-8">
            <h1 className="text-3xl font-bold mb-2">
              Tableau de bord personnalisé
            </h1>
            <p className="text-purple-100 text-lg">
              Suivi complet de vos pauses et activités bien-être
            </p>
          </div>

          <div className="p-8">
            {/* Section 1: Vue d'ensemble rapide */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-1 h-8 rounded-full mr-4"></div>
                <h2 className="text-2xl font-bold text-gray-800">
                  📊 Vue d'ensemble aujourd'hui
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-blue-700">
                      Pauses
                    </h3>
                    <span className="text-2xl">⏱️</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-800">
                    {totalPauses}
                  </p>
                  <p className="text-sm text-blue-600">
                    {totalMinutes} min total
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-green-700">
                      Activités
                    </h3>
                    <span className="text-2xl">🎯</span>
                  </div>
                  <p className="text-3xl font-bold text-green-800">
                    {todayActivities.length}
                  </p>
                  <p className="text-sm text-green-600">
                    {todayActivities.reduce(
                      (sum: number, a: ActivitySession) => sum + a.duration,
                      0
                    )}{" "}
                    min total
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-purple-700">
                      Durée moy.
                    </h3>
                    <span className="text-2xl">📏</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-800">
                    {avgMinutes}
                  </p>
                  <p className="text-sm text-purple-600">min/pause</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-orange-700">
                      Concentration
                    </h3>
                    <span className="text-2xl">🧠</span>
                  </div>
                  <p className="text-3xl font-bold text-orange-800">
                    {avgConcentration.toFixed(1)}
                  </p>
                  <p className="text-sm text-orange-600">/10 moy.</p>
                </div>
              </div>
            </div>

            {/* Section 2: Impact bien-être */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-pink-500 to-red-500 w-1 h-8 rounded-full mr-4"></div>
                <h2 className="text-2xl font-bold text-gray-800">
                  💪 Impact sur votre bien-être
                </h2>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-red-100">
                    <div className="text-4xl mb-3">🧘</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Réduction stress
                    </h3>
                    <p className="text-3xl font-bold text-red-600">
                      {avgStressReduction > 0 ? "-" : ""}
                      {Math.abs(avgStressReduction).toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      points en moyenne
                    </p>
                  </div>

                  <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-green-100">
                    <div className="text-4xl mb-3">⚡</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Gain d'énergie
                    </h3>
                    <p className="text-3xl font-bold text-green-600">
                      {avgEnergyGain > 0 ? "+" : ""}
                      {avgEnergyGain.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      points en moyenne
                    </p>
                  </div>

                  <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-blue-100">
                    <div className="text-4xl mb-3">😊</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Amélioration humeur
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {avgMoodImprovement > 0 ? "+" : ""}
                      {avgMoodImprovement.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      points en moyenne
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💡</span>
                    <div>
                      <p className="text-sm font-semibold text-blue-800">
                        Motivation moyenne
                      </p>
                      <p className="text-lg font-bold text-blue-900">
                        {avgMotivation.toFixed(1)}/10
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Statistiques hebdomadaires */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 w-1 h-8 rounded-full mr-4"></div>
                <h2 className="text-2xl font-bold text-gray-800">
                  📈 Résumé de la semaine
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                    <span className="mr-2">⏱️</span>
                    Pauses cette semaine
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Total des pauses</span>
                      <span className="font-bold text-blue-900">
                        {weekTotalPauses}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Temps total</span>
                      <span className="font-bold text-blue-900">
                        {weekTotalMinutes} min
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Moyenne/jour</span>
                      <span className="font-bold text-blue-900">
                        {Math.round(weekTotalPauses / 7)} pauses
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
                  <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                    <span className="mr-2">🎯</span>
                    Activités cette semaine
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">Total activités</span>
                      <span className="font-bold text-green-900">
                        {weekActivities.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">Temps total</span>
                      <span className="font-bold text-green-900">
                        {weekActivities.reduce(
                          (sum: number, a: ActivitySession) => sum + a.duration,
                          0
                        )}{" "}
                        min
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">
                        Activités populaires
                      </span>
                      <span className="font-bold text-green-900">
                        {activities.length} types
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Activités récentes */}
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-1 h-8 rounded-full mr-4"></div>
                <h2 className="text-2xl font-bold text-gray-800">
                  🎯 Activités récentes
                </h2>
              </div>

              {recentActivitySessions.length > 0 ? (
                <div className="space-y-4">
                  {recentActivitySessions
                    .slice(0, 3)
                    .map((session: ActivitySession) => {
                      const activity = activities.find(
                        (a) => a.id === session.activityId
                      );
                      return (
                        <div
                          key={session.id}
                          className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-800">
                                {activity?.title || "Activité"}
                              </h3>
                              <p className="text-gray-600 mb-2">
                                {activity?.description ||
                                  "Description non disponible"}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>
                                  📅{" "}
                                  {new Date(session.date).toLocaleDateString()}
                                </span>
                                <span>⏱️ {session.duration} min</span>
                                <span>
                                  📊 Difficulté {activity?.difficulty || "N/A"}
                                  /5
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                                Terminée
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                            <div className="text-center">
                              <p className="text-gray-500 text-sm">Stress</p>
                              <p className="font-bold text-red-600">
                                {session.feedback.stressBefore} →{" "}
                                {session.feedback.stressAfter}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-500 text-sm">Énergie</p>
                              <p className="font-bold text-green-600">
                                {session.feedback.energyBefore} →{" "}
                                {session.feedback.energyAfter}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-500 text-sm">Humeur</p>
                              <p className="font-bold text-blue-600">
                                {session.feedback.moodBefore} →{" "}
                                {session.feedback.moodAfter}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-500 text-sm">
                                Concentration
                              </p>
                              <p className="font-bold text-orange-600">
                                {session.feedback.concentration}/10
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Aucune activité récente
                  </h3>
                  <p className="text-gray-500 text-lg mb-6">
                    Commencez votre première activité pour voir vos statistiques
                    ici !
                  </p>
                  <div className="bg-white p-4 rounded-lg inline-block border border-gray-200">
                    <p className="text-sm text-gray-600">
                      💡 Astuce : Visitez la page Activités pour découvrir tous
                      les exercices disponibles
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Dashboard;
