import admin from '../config/firebase';
import { Request, Response } from 'express';

// CREATE
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, department, role } = req.body;
    // On force le rôle à 'user', 'manager' ou 'rh'
    const safeRole = ['user', 'manager', 'rh'].includes(role) ? role : 'user';
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: safeRole });
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email,
      firstName,
      lastName,
      department,
      role: safeRole,
      createdAt: new Date(),
      lastLogin: null,
      achievements: [],
      customization: {},
      unlockedTitles: [],
      unlockedBadges: [],
      preferences: {},
      notifications: {},
    });
    res.status(201).json({ id: userRecord.uid, email, firstName, lastName, department, role: safeRole });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// READ ALL
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const snapshot = await admin.firestore().collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// READ ONE
export const getUserById = async (req: Request, res: Response) => {
  try {
    const doc = await admin.firestore().collection('users').doc(req.params.id).get();
    if (!doc.exists) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// UPDATE
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, department, role } = req.body;
    const safeRole = ['user', 'manager', 'rh'].includes(role) ? role : 'user';
    const docRef = admin.firestore().collection('users').doc(req.params.id);
    await docRef.update({ email, firstName, lastName, department, role: safeRole });
    // Met à jour le custom claim si le rôle change
    if (role) {
      await admin.auth().setCustomUserClaims(req.params.id, { role: safeRole });
    }
    await admin.auth().updateUser(req.params.id, {
      email,
      displayName: `${firstName} ${lastName}`,
    });
    const updatedDoc = await docRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// DELETE
export const deleteUser = async (req: Request, res: Response) => {
  try {
    await admin.firestore().collection('users').doc(req.params.id).delete();
    await admin.auth().deleteUser(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};