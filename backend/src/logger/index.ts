import winston from 'winston';
import { env } from '../config/env';

const { combine, timestamp, json, colorize, simple } = winston.format;

const developmentFormat = combine(colorize(), timestamp({ format: 'HH:mm:ss' }), simple());

const productionFormat = combine(timestamp(), json());

const logger = winston.createLogger({
  level: env.log.level,
  format: env.nodeEnv === 'production' ? productionFormat : developmentFormat,
  transports: [new winston.transports.Console()],
});

export default logger;
