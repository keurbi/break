import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from "../firebase";
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

export const saveActivitySession = async (sessionData: ActivitySessionData): Promise<string> => {
  try {
    const db = getFirestore(app);
    
    const docData = {
      ...sessionData,
      date: new Date().toISOString(),
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "activitySessions"), docData);
    console.log("Session d'activité sauvegardée avec l'ID: ", docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la session d'activité: ", error);
    throw error;
  }
};
