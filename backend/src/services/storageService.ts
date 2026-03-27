import { minioClient } from '../config/storage';
import { env } from '../config/env';
import logger from '../logger';

const BUCKETS = [env.minio.bucketAvatars, env.minio.bucketAttachments];

export async function initBuckets(): Promise<void> {
  for (const bucket of BUCKETS) {
    const exists = await minioClient.bucketExists(bucket);
    if (!exists) {
      await minioClient.makeBucket(bucket);
      logger.info(`MinIO bucket created: ${bucket}`);
    } else {
      logger.info(`MinIO bucket ready: ${bucket}`);
    }
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

export async function getPresignedUrl(
  bucket: string,
  objectName: string,
): Promise<string> {
  return minioClient.presignedGetObject(
    bucket,
    objectName,
    env.minio.presignedUrlExpiry,
  );
}
