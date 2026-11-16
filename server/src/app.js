import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import apiRouter from './routes/api.js';

export const createApp = () => {
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || env.corsOrigins.includes('*') || env.corsOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Origen no permitido por política CORS'));
      },
      methods: ['GET', 'POST', 'OPTIONS'],
    })
  );

  app.use(express.json({ limit: '100kb' }));

  const limiter = rateLimit({
    windowMs: env.rateLimit.windowMs,
    max: env.rateLimit.maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      ok: false,
      error: 'Demasiadas solicitudes desde esta dirección. Intentá nuevamente en unos minutos.',
    },
  });

  app.use(env.apiPrefix, limiter, apiRouter);

  app.get('/', (_req, res) => {
    res.json({
      ok: true,
      name: env.publicCompany.name,
      apiBase: env.apiPrefix,
      healthCheck: `${env.apiPrefix}/health`,
    });
  });

  app.use((err, _req, res, _next) => {
    const status = err.message?.includes('CORS') ? 403 : 500;
    res.status(status).json({
      ok: false,
      error: status === 403 ? err.message : 'Error interno del servidor.',
    });
  });

  return app;
};

