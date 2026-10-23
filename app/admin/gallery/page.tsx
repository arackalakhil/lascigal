import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import GalleryManager from './GalleryManager';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const items = await prisma.galleryItem.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div>
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 700 }}>Gallery & Cobbles Management</h1>
        <p style={{ color: '#666', margin: '4px 0 0', fontSize: '14px' }}>
          Upload new photographs to Cloudflare R2 and categorize showcase images.
        </p>
      </div>

      <GalleryManager initialItems={items} />
    </div>
  );
}
