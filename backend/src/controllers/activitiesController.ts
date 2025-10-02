import { Request, Response } from "express";
import admin from "../config/firebase";

const db = admin.firestore();
const COLLECTION = "activities";

export const getAllActivities = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const cursor = (req.query.cursor as string) || undefined;

    let query = db
      .collection(COLLECTION)
      .where("deletedAt", "==", null)
      .orderBy("createdAt", "desc");
    // Liste publique avec pagination et filtrage des éléments supprimés (deletedAt=null)

    if (cursor) {
      const cursorDoc = await db.collection(COLLECTION).doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snapshot = await query.get();
    const activities = snapshot.docs.map((doc) => {
      const data = doc.data() as any;
      const { resourceUrl, ...rest } = data || {};
      const resource = rest?.resource ?? resourceUrl ?? null;
      return { id: doc.id, ...rest, resource };
    });
    const nextCursor =
      snapshot.docs.length === limit
        ? snapshot.docs[snapshot.docs.length - 1].id
        : null;

  res.json({ items: activities, nextCursor });
  } catch {
  res.status(500).json({ error: 'Erreur serveur.' });
  }
};

export const getActivityById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const doc = await db.collection(COLLECTION).doc(req.params.id).get();
    if (!doc.exists || (doc.data() as any)?.deletedAt) {
      res.status(404).json({ error: "Activité non trouvée." });
      return;
    }
    const data = doc.data() as any;
    const { resourceUrl, ...rest } = data || {};
    const resource = rest?.resource ?? resourceUrl ?? null;
    res.json({ id: doc.id, ...rest, resource });
  } catch {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

export const createActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const now = admin.firestore.FieldValue.serverTimestamp();
    const difficulty =
      typeof req.body.difficulty === "number"
        ? req.body.difficulty
        : req.body.difficulty ?? null;
    const payload = {
      title: req.body.title,
      description: req.body.description,
      type: req.body.type ?? null,
      subType: req.body.subType ?? null,
      duration: req.body.duration ?? null,
      difficulty,
      resource: req.body.resource ?? req.body.resourceUrl ?? null,
      benefits: Array.isArray(req.body.benefits) ? req.body.benefits : [],
      tips: Array.isArray(req.body.tips) ? req.body.tips : [],
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
    const docRef = await db.collection(COLLECTION).add(payload);
  res.status(201).json({ id: docRef.id });
  } catch {
  res.status(400).json({ error: 'Erreur lors de la création.' });
  }
};

export const updateActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    // prevent updating system fields
    const disallowed = ["id", "createdAt", "deletedAt"];
    const updates: Record<string, any> = {};
    for (const [k, v] of Object.entries(req.body)) {
      if (!disallowed.includes(k)) updates[k] = v;
    }
    if (
      typeof updates.resourceUrl !== "undefined" &&
      typeof updates.resource === "undefined"
    ) {
      updates.resource = updates.resourceUrl;
      delete (updates as any).resourceUrl;
    }
    if (typeof updates.difficulty !== "undefined") {
      updates.difficulty =
        typeof updates.difficulty === "number"
          ? updates.difficulty
          : updates.difficulty;
    }
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    await db.collection(COLLECTION).doc(id).update(updates);
  res.json({ success: true });
  } catch {
  res.status(400).json({ error: 'Erreur lors de la modification.' });
  }
};

export const deleteActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await db.collection(COLLECTION).doc(id).update({
      deletedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  res.status(204).send();
  } catch {
  res.status(400).json({ error: 'Erreur lors de la suppression.' });
  }
};
