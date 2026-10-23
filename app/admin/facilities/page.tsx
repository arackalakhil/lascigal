import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import FacilityManager from './FacilityManager';

export const dynamic = 'force-dynamic';

export default async function AdminFacilitiesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const facilities = await prisma.venueFacility.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div>
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 700 }}>Homepage Facilities & Amenities</h1>
        <p style={{ color: '#666', margin: '4px 0 0', fontSize: '14px' }}>
          Edit the 6 venue highlights displayed on the homepage, update their descriptions, and upload new photos to Cloudflare R2.
        </p>
      </div>

      <FacilityManager initialFacilities={facilities} />
    </div>
  );
}
