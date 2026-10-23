import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import EventForm from '../EventForm';

export default async function NewEventPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  return (
    <div>
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 700 }}>Add New Event / Celebration</h1>
        <p style={{ color: '#666', margin: '4px 0 0', fontSize: '14px' }}>
          Publish a new event service to appear on your portfolio and homepage.
        </p>
      </div>

      <EventForm />
    </div>
  );
}
