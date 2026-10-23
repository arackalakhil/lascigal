import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import MediaManager from './MediaManager';

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  return (
    <div>
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 700 }}>Cloudflare R2 Media Storage</h1>
        <p style={{ color: '#666', margin: '4px 0 0', fontSize: '14px' }}>
          Upload single images or large numbered frame ZIPs directly into your Cloudflare R2 bucket with 1-year immutable caching.
        </p>
      </div>

      <MediaManager />
    </div>
  );
}
