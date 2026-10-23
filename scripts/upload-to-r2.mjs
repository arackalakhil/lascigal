import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Load .env manually if not populated
if (!process.env.R2_ACCESS_KEY_ID && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const k = trimmed.substring(0, idx).trim();
        const v = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[k]) process.env[k] = v;
      }
    }
  });
}

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET || 'lascigal-media';

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error('Missing R2 credentials. Need R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY');
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

async function uploadAll() {
  const baseDir = path.resolve('images');
  if (!fs.existsSync(baseDir)) {
    console.error('images folder not found at', baseDir);
    return;
  }

  const allFiles = getAllFiles(baseDir);
  console.log(`Found ${allFiles.length} files to upload to R2 bucket "${bucket}"...`);

  let count = 0;
  for (const filePath of allFiles) {
    const relPath = path.relative(path.resolve('.'), filePath).replace(/\\/g, '/');
    const fileContent = fs.readFileSync(filePath);
    const contentType = getMimeType(filePath);

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: relPath,
          Body: fileContent,
          ContentType: contentType,
          CacheControl: 'max-age=31536000, immutable',
        })
      );
      count++;
      console.log(`[${count}/${allFiles.length}] Uploaded: ${relPath}`);
    } catch (err) {
      console.error(`Failed to upload ${relPath}:`, err.message);
    }
  }

  console.log(`\nAll done! Successfully uploaded ${count} of ${allFiles.length} files to R2.`);
}

uploadAll();
