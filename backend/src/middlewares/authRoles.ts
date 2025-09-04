import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
  const role = (req as any).userRole || (req.user as any)?.role;
  if (!role || !roles.includes(role)) {
      res.status(403).json({ error: 'Accès interdit : rôle insuffisant' });
      return;
    }
    next();
  };
};