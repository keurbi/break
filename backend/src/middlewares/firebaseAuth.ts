import admin from '../config/firebase';
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      userRole?: string;
    }
  }
}

export const authenticateFirebase = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token manquant' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    // Prefer a custom claim named "role" if present, else default to 'user'
    const role = (decodedToken as any)?.role ?? 'user';
    req.userRole = typeof role === 'string' ? role : 'user';
    next();
  } catch (error) {
    console.error('Erreur de vérification Firebase:', error);
    res.status(401).json({ error: 'Token invalide' });
    return;
  }
};