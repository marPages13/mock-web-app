import { minioClient } from '../config/storage';
import { env } from '../config/env';
import logger from '../logger';

const BUCKETS = [env.minio.bucketAvatars, env.minio.bucketAttachments];

function publicReadPolicy(bucket: string): string {
  return JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  });
}

export async function initBuckets(): Promise<void> {
  for (const bucket of BUCKETS) {
    const exists = await minioClient.bucketExists(bucket);
    if (!exists) {
      await minioClient.makeBucket(bucket);
      logger.info(`MinIO bucket created: ${bucket}`);
    } else {
      logger.info(`MinIO bucket ready: ${bucket}`);
    }
    // Allow anonymous read so the browser can fetch media directly
    await minioClient.setBucketPolicy(bucket, publicReadPolicy(bucket));
  }
}

export async function uploadFile(
  buffer: Buffer,
  bucket: string,
  objectName: string,
): Promise<string> {
  await minioClient.putObject(bucket, objectName, buffer, buffer.length);
  return objectName;
}

/** Build a plain public URL — no signature needed since the bucket is public-read. */
export function getPublicUrl(bucket: string, objectName: string): string {
  const protocol = env.minio.useSSL ? 'https' : 'http';
  return `${protocol}://${env.minio.publicEndpoint}:${env.minio.publicPort}/${bucket}/${objectName}`;
}
