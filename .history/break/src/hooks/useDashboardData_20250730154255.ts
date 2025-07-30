import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../firebase";
import { Break, Activity, ActivitySession, DashboardStats } from "../types/dashboard";
import { getMinutes, isToday, isThisWeek } from "../utils/dateUtils";

export const useDashboardData = () => {
  const [breaks, setBreaks] = useState<Break[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [recentActivitySessions, setRecentActivitySessions] = useState<ActivitySession[]>([]);
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

  // Calculate dashboard statistics
  const calculateStats = (): DashboardStats => {
    const todayBreaks = breaks.filter((b) => b.timeStart && isToday(b.timeStart));
    const weekBreaks = breaks.filter((b) => b.timeStart && isThisWeek(b.timeStart));

    const totalPauses = todayBreaks.length;
    const totalMinutes = todayBreaks.reduce((sum, b) => sum + getMinutes(b.start, b.end), 0);
    const avgMinutes = totalPauses > 0 ? Math.round(totalMinutes / totalPauses) : 0;
    const weekTotalPauses = weekBreaks.length;
    const weekTotalMinutes = weekBreaks.reduce((sum, b) => sum + getMinutes(b.start, b.end), 0);

    const todayActivities = recentActivitySessions.filter((s) => isToday(s.date));
    const weekActivities = recentActivitySessions.filter((s) => isThisWeek(s.date));

    const avgStressReduction = recentActivitySessions.length > 0
      ? recentActivitySessions.reduce((sum, s) => sum + (s.feedback.stressBefore - s.feedback.stressAfter), 0) / recentActivitySessions.length
      : 0;

    const avgEnergyGain = recentActivitySessions.length > 0
      ? recentActivitySessions.reduce((sum, s) => sum + (s.feedback.energyAfter - s.feedback.energyBefore), 0) / recentActivitySessions.length
      : 0;

    const avgMoodImprovement = recentActivitySessions.length > 0
      ? recentActivitySessions.reduce((sum, s) => sum + (s.feedback.moodAfter - s.feedback.moodBefore), 0) / recentActivitySessions.length
      : 0;

    const avgConcentration = recentActivitySessions.length > 0
      ? recentActivitySessions.reduce((sum, s) => sum + s.feedback.concentration, 0) / recentActivitySessions.length
      : 0;

    const avgMotivation = recentActivitySessions.length > 0
      ? recentActivitySessions.reduce((sum, s) => sum + s.feedback.motivation, 0) / recentActivitySessions.length
      : 0;

    return {
      totalPauses,
      totalMinutes,
      avgMinutes,
      weekTotalPauses,
      weekTotalMinutes,
      todayActivities,
      weekActivities,
      avgStressReduction,
      avgEnergyGain,
      avgMoodImprovement,
      avgConcentration,
      avgMotivation,
    };
  };

  return {
    breaks,
    activities,
    recentActivitySessions,
    loading,
    stats: calculateStats(),
  };
};
