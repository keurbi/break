import { Request, Response } from 'express';
import admin from '../config/firebase';

const db = admin.firestore();
const COLLECTION = 'activities';

export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection(COLLECTION).get();
    const activities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as any),
    }));
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

export const getActivityById = async (req: Request, res: Response) => {
  try {
    const doc = await db.collection(COLLECTION).doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Activité non trouvée.' });
    }
    res.json({ id: doc.id, ...(doc.data() as any) });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

export const createActivity = async (req: Request, res: Response) => {
  try {
    const docRef = await db.collection(COLLECTION).add(req.body);
    res.status(201).json({ id: docRef.id });
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de la création.' });
  }
};

export const updateActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.collection(COLLECTION).doc(id).update(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de la modification.' });
  }
};

export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.collection(COLLECTION).doc(id).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de la suppression.' });
  }
};