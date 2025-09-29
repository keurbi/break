import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const status = err.status || 500;
  const message = err.message || "Erreur serveur.";
  if (process.env.NODE_ENV !== "production") {
    // En non-prod, on log l’erreur complète en console pour faciliter le debug
    console.error(err); // eslint-disable-line no-console
  }
  res.status(status).json({ error: message });
};
