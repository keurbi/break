import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import compression from "compression";
import rateLimit from "express-rate-limit";
import userRoutes from "./routes/user.routes";
import activityRoutes from "./routes/activity.routes";
import paymentRoutes from "./routes/payments.routes";
import { stripeWebhookHandler } from "./controllers/paymentsController";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();
const app = express();
app.disable("x-powered-by");
// Configuration via variables d’environnement (avec valeurs par défaut adaptées au local)
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
const apiPrefix = process.env.API_PREFIX || "/api";
const enableRequestLogs =
  (process.env.ENABLE_REQUEST_LOGS || "true") === "true";
const rateLimitWindowMs = process.env.RATE_LIMIT_WINDOW_MS
  ? Number(process.env.RATE_LIMIT_WINDOW_MS)
  : 60 * 1000;
const rateLimitMax = process.env.RATE_LIMIT_MAX
  ? Number(process.env.RATE_LIMIT_MAX)
  : 300;
const logFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";

// Middlewares globaux
app.use(
  cors({
    origin: corsOrigin,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());
app.use(compression());
if (enableRequestLogs) {
  app.use(morgan(logFormat));
}

// Le webhook Stripe a besoin du corps brut: il doit être déclaré avant le parseur JSON pour vérifier la signature
app.post(
  `${apiPrefix}/payments/webhook`,
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

const bodyLimit = process.env.BODY_LIMIT
  ? Number(process.env.BODY_LIMIT)
  : 1024 * 100; // limite par défaut: 100kb
app.use(express.json({ limit: bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: bodyLimit }));

const limiter = rateLimit({
  windowMs: rateLimitWindowMs,
  max: rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/activities`, activityRoutes);
app.use(`${apiPrefix}/payments`, paymentRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Réponse JSON pour les routes non trouvées (404)
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Gestionnaire d’erreurs global (doit rester en dernier)
app.use(errorHandler);

export default app;
