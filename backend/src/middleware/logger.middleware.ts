import morgan from 'morgan';
import logger from '../logger';
import { env } from '../config/env';

const stream = {
  write: (message: string) => logger.http(message.trim()),
};

export const httpLogger = morgan(env.nodeEnv === 'production' ? 'combined' : 'dev', {
  stream,
});
