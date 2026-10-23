import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.R2_ACCOUNT_ID || '';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
const bucket = process.env.R2_BUCKET || 'lascigal-media';

export const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string
): Promise<{ path: string; url: string }> {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'max-age=31536000, immutable',
    })
  );

  const base = process.env.NEXT_PUBLIC_MEDIA_BASE?.replace(/\/$/, '') || '';
  return {
    path: key,
    url: `${base}/${key}`,
  };
}

export async function getPresignedPutUrl(
  key: string,
  contentType: string
): Promise<{ url: string; key: string }> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    CacheControl: 'max-age=31536000, immutable',
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return { url, key };
}
