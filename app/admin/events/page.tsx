import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { mediaUrl } from '@/lib/media';
import EventDeleteButton from './EventDeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const events = await prisma.eventService.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 700 }}>Event Services & Celebrations</h1>
          <p style={{ color: '#666', margin: '4px 0 0', fontSize: '14px' }}>
            Manage the content, features, and photography for each event category.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          style={{
            backgroundColor: '#c5a880',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          + Add New Event
        </Link>
      </div>

      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>
              <th style={{ padding: '12px 16px', width: '80px' }}>Image</th>
              <th style={{ padding: '12px 16px' }}>Title</th>
              <th style={{ padding: '12px 16px' }}>Category</th>
              <th style={{ padding: '12px 16px' }}>Slug / URL</th>
              <th style={{ padding: '12px 16px', width: '80px' }}>Order</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', width: '140px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((evt) => (
              <tr key={evt.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ width: '56px', height: '40px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#eee' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mediaUrl(evt.heroImage)}
                      alt={evt.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#111827' }}>{evt.title}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    {evt.categoryName}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#6b7280', fontFamily: 'monospace' }}>
                  /events/{evt.slug}
                </td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{evt.order}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Link
                      href={`/admin/events/${evt.id}`}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: 500,
                      }}
                    >
                      Edit
                    </Link>
                    <EventDeleteButton id={evt.id} title={evt.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
