import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error(err.message, { stack: err.stack });

  const status = (err as { status?: number }).status ?? 500;
  const message = status < 500 ? err.message : 'Internal server error';

  res.status(status).json({ error: message });
}
