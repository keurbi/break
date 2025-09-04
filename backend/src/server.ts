import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import userRoutes from './routes/user.routes';
import activityRoutes from './routes/activity.routes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();
const app = express();
app.disable('x-powered-by');

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({
  origin: corsOrigin,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const bodyLimit = process.env.BODY_LIMIT ? Number(process.env.BODY_LIMIT) : 1024 * 100; // 100kb default
app.use(express.json({ limit: bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: bodyLimit }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.RATE_LIMIT_MAX ? Number(process.env.RATE_LIMIT_MAX) : 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});
    
// 404 JSON
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler (last)
app.use(errorHandler);

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
