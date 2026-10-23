import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPresignedPutUrl } from '@/lib/r2';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { files, folder } = await req.json();
    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: 'Files array required' }, { status: 400 });
    }

    const targetFolder = (folder || 'uploads').replace(/\/$/, '');

    const signedUrls = await Promise.all(
      files.map(async (file: { name: string; type: string }) => {
        const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const key = `${targetFolder}/${cleanName}`;
        const presigned = await getPresignedPutUrl(key, file.type || 'application/octet-stream');
        return {
          filename: file.name,
          key: presigned.key,
          url: presigned.url,
        };
      })
    );

    return NextResponse.json({ success: true, signedUrls });
  } catch (err: any) {
    console.error('Presigning failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
