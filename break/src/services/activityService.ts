import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { getDb } from "../firebase";
import { ActivitySession } from "../types/dashboard";

export interface ActivitySessionData {
  activityId: string;
  userId: string;
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
}

export const saveActivitySession = async (
  sessionData: ActivitySessionData
): Promise<string> => {
  try {
  const db = getDb();
  if (!db) throw new Error("Firestore indisponible dans l'environnement actuel");

    const docData = {
      ...sessionData,
      date: new Date().toISOString(),
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "activitySessions"), docData);
    console.log("Session d'activité sauvegardée avec l'ID: ", docRef.id);

    return docRef.id;
  } catch (error) {
    console.error(
      "Erreur lors de la sauvegarde de la session d'activité: ",
      error
    );
    throw error;
  }
};

export const getActivitySessions = async (
  userId?: string
): Promise<ActivitySession[]> => {
  try {
  const db = getDb();
  if (!db) return [];
    let q;

    if (userId) {
      q = query(
        collection(db, "activitySessions"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(10)
      );
    } else {
      q = query(
        collection(db, "activitySessions"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
    }

    const querySnapshot = await getDocs(q);
    const sessions: ActivitySession[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sessions.push({
        id: doc.id,
        activityId: data.activityId || "",
        userId: data.userId || "",
        date: data.date || new Date().toISOString(),
        duration: data.duration || 0,
        feedback: data.feedback || {
          stressBefore: 5,
          stressAfter: 5,
          energyBefore: 5,
          energyAfter: 5,
          moodBefore: 5,
          moodAfter: 5,
          difficulty: 3,
          motivation: 5,
          pain: 1,
          concentration: 5,
        },
      });
    });

    return sessions;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des sessions d'activité: ",
      error
    );
    return [];
  }
};
