import admin from "../config/firebase";
import { Request, Response } from "express";

// Création d’un utilisateur + enregistrement du profil et des claims
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, firstName, lastName, department, role } = req.body;
    // On force le rôle à 'user', 'manager' ou 'rh'
    const safeRole = ["user", "manager", "rh"].includes(role) ? role : "user";
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: safeRole });
    const now = admin.firestore.FieldValue.serverTimestamp();
    await admin.firestore().collection("users").doc(userRecord.uid).set({
      email,
      firstName,
      lastName,
      department,
      role: safeRole,
      createdAt: now,
      updatedAt: now,
      lastLogin: null,
      achievements: [],
      customization: {},
      unlockedTitles: [],
      unlockedBadges: [],
      preferences: {},
      notifications: {},
    });
    res
      .status(201)
      .json({
        id: userRecord.uid,
        email,
        firstName,
        lastName,
        department,
        role: safeRole,
      });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Liste des utilisateurs
export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await admin.firestore().collection("users").get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Lecture d’un utilisateur par id
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const doc = await admin
      .firestore()
      .collection("users")
      .doc(req.params.id)
      .get();
    if (!doc.exists) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Mise à jour d’un utilisateur (profil, claims, et Firebase Auth si nécessaire)
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, firstName, lastName, department, role } = req.body;
    const docRef = admin.firestore().collection("users").doc(req.params.id);

    const updates: Record<string, any> = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (typeof email !== "undefined") updates.email = email;
    if (typeof firstName !== "undefined") updates.firstName = firstName;
    if (typeof lastName !== "undefined") updates.lastName = lastName;
    if (typeof department !== "undefined") updates.department = department;

    // Role: seulement si fourni et valide
    if (typeof role !== "undefined") {
      if (["user", "manager", "rh"].includes(role)) {
        updates.role = role;
        await admin.auth().setCustomUserClaims(req.params.id, { role });
      } else {
        res.status(400).json({ error: "Rôle invalide" });
        return;
      }
    }

    await docRef.update(updates);

    // Mise à jour Firebase Auth seulement pour les champs fournis
    const authUpdates: Record<string, any> = {};
    if (typeof email !== "undefined") authUpdates.email = email;
    if (typeof firstName !== "undefined" || typeof lastName !== "undefined") {
      const f = typeof firstName !== "undefined" ? firstName : "";
      const l = typeof lastName !== "undefined" ? lastName : "";
      authUpdates.displayName = `${f} ${l}`.trim();
    }
    if (Object.keys(authUpdates).length > 0) {
      await admin.auth().updateUser(req.params.id, authUpdates);
    }
    const updatedDoc = await docRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Suppression d’un utilisateur (Firestore + Firebase Auth)
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await admin.firestore().collection("users").doc(req.params.id).delete();
    await admin.auth().deleteUser(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
