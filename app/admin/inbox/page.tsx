import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import InboxManager from './InboxManager';

export const dynamic = 'force-dynamic';

export default async function AdminInboxPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const bookings = await prisma.bookingSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 700 }}>Client Booking Inquiries</h1>
        <p style={{ color: '#666', margin: '4px 0 0', fontSize: '14px' }}>
          Real-time inquiries submitted through the website reservation form.
        </p>
      </div>

      <InboxManager initialBookings={bookings} />
    </div>
  );
}
