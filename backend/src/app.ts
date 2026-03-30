import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';
import { httpLogger } from './middleware/logger.middleware';
import { errorHandler } from './middleware/error.middleware';
import apiRoutes from './routes';

export function createApp() {
  const app = express();

  // Security headers (CSP disabled for SPA compatibility)
  app.use(helmet({ contentSecurityPolicy: false }));

  // CORS
  app.use(cors({ origin: env.cors.origin, credentials: true }));

  // HTTP request logging
  app.use(httpLogger);

  // Body parsing
  app.use(express.json());

  // API routes
  app.use('/api', apiRoutes);

  // Serve built frontend
  const frontendDist = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });

  // Global error handler — must be last
  app.use(errorHandler);

  return app;
}
