import dotenv from 'dotenv';
import path from 'path';

// Loads root .env for local dev; silently ignored in Docker (vars already injected by env_file)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

export const env = {
  nodeEnv: optional('NODE_ENV', 'development'),
  port: parseInt(optional('PORT', '3000'), 10),

  db: {
    host: optional('DB_HOST', 'localhost'),
    port: parseInt(optional('DB_PORT', '3306'), 10),
    name: optional('DB_NAME', 'mockwebapp'),
    user: optional('DB_USER', 'root'),
    password: optional('DB_PASSWORD', ''),
  },

  jwt: {
    secret: requireEnv('JWT_SECRET'),
    expiresIn: optional('JWT_EXPIRES_IN', '7d'),
  },

  cors: {
    origin: optional('CORS_ORIGIN', '*'),
  },

  log: {
    level: optional('LOG_LEVEL', 'http'),
  },

  admin: {
    email: optional('ADMIN_EMAIL', ''),
    password: optional('ADMIN_PASSWORD', ''),
  },
  minio: {
    endpoint: optional('MINIO_ENDPOINT', 'localhost'),
    port: parseInt(optional('MINIO_PORT', '9000'), 10),
    useSSL: optional('MINIO_USE_SSL', 'false') === 'true',
    accessKey: optional('MINIO_ACCESS_KEY', 'minioadmin'),
    secretKey: optional('MINIO_SECRET_KEY', 'minioadmin'),
    bucketAvatars: optional('MINIO_BUCKET_AVATARS', 'avatars'),
    bucketAttachments: optional('MINIO_BUCKET_ATTACHMENTS', 'attachments'),
    presignedUrlExpiry: parseInt(optional('MINIO_PRESIGNED_URL_EXPIRY', '3600'), 10),
    // Public hostname/port that the browser can reach (may differ from internal Docker hostname)
    publicEndpoint: optional('MINIO_PUBLIC_ENDPOINT', ''),
    publicPort: parseInt(optional('MINIO_PUBLIC_PORT', '0'), 10),
  },
  redis: {
    host: optional('REDIS_HOST', 'localhost'),
    port: parseInt(optional('REDIS_PORT', '6379'), 10),
  },
} as const;

export type Env = typeof env;
