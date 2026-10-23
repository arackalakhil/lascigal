import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import EventForm from '../EventForm';

export const dynamic = 'force-dynamic';

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const event = await prisma.eventService.findUnique({
    where: { id: params.id },
  });

  if (!event) notFound();

  return (
    <div>
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 700 }}>Edit Event: {event.title}</h1>
        <p style={{ color: '#666', margin: '4px 0 0', fontSize: '14px' }}>
          Update features, description, photography, or display order.
        </p>
      </div>

      <EventForm
        initialData={{
          id: event.id,
          title: event.title,
          slug: event.slug,
          categoryName: event.categoryName,
          heroImage: event.heroImage,
          summary: event.summary || '',
          description: event.description || '',
          features: event.features,
          galleryImages: event.galleryImages,
          order: event.order,
        }}
      />
    </div>
  );
}
