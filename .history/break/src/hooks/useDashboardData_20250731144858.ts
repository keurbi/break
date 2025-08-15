import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../firebase";
import {
  Break,
  Activity,
  ActivitySession,
  DashboardStats,
} from "../types/dashboard";
import { getMinutes, isToday, isThisWeek } from "../utils/dateUtils";
import { getActivitySessions } from "../services/activityService";

export const useDashboardData = () => {
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
          } catch (error) {
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

        // Fetch real activity sessions from Firestore
        const realSessions = await getActivitySessions();
        setRecentActivitySessions(realSessions);
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
    const todayBreaks = breaks.filter(
      (b) => b.timeStart && isToday(b.timeStart)
    );
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

    const todayActivities = recentActivitySessions.filter((s) =>
      isToday(s.date)
    );
    const weekActivities = recentActivitySessions.filter((s) =>
      isThisWeek(s.date)
    );

    const avgStressReduction =
      recentActivitySessions.length > 0
        ? recentActivitySessions.reduce(
            (sum, s) =>
              sum + (s.feedback.stressBefore - s.feedback.stressAfter),
            0
          ) / recentActivitySessions.length
        : 0;

    const avgEnergyGain =
      recentActivitySessions.length > 0
        ? recentActivitySessions.reduce(
            (sum, s) =>
              sum + (s.feedback.energyAfter - s.feedback.energyBefore),
            0
          ) / recentActivitySessions.length
        : 0;

    const avgMoodImprovement =
      recentActivitySessions.length > 0
        ? recentActivitySessions.reduce(
            (sum, s) => sum + (s.feedback.moodAfter - s.feedback.moodBefore),
            0
          ) / recentActivitySessions.length
        : 0;

    const avgConcentration =
      recentActivitySessions.length > 0
        ? recentActivitySessions.reduce(
            (sum, s) => sum + s.feedback.concentration,
            0
          ) / recentActivitySessions.length
        : 0;

    const avgMotivation =
      recentActivitySessions.length > 0
        ? recentActivitySessions.reduce(
            (sum, s) => sum + s.feedback.motivation,
            0
          ) / recentActivitySessions.length
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
