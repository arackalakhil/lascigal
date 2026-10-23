import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/admin/login');
  }

  const [eventsCount, galleryCount, inboxCount, settingsCount, recentBookings] =
    await Promise.all([
      prisma.eventService.count(),
      prisma.galleryItem.count(),
      prisma.bookingSubmission.count(),
      prisma.siteSetting.count(),
      prisma.bookingSubmission.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

  const stats = [
    { label: 'Event Services', count: eventsCount, href: '/admin/events', icon: 'fa-calendar-days', color: '#3b82f6' },
    { label: 'Gallery Photos', count: galleryCount, href: '/admin/gallery', icon: 'fa-images', color: '#10b981' },
    { label: 'Booking Inquiries', count: inboxCount, href: '/admin/inbox', icon: 'fa-envelope-open-text', color: '#f59e0b' },
    { label: 'Site Settings', count: settingsCount, href: '/admin/settings', icon: 'fa-sliders', color: '#8b5cf6' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', margin: '0 0 6px', fontWeight: 700 }}>Admin Dashboard</h1>
        <p style={{ color: '#666', margin: 0, fontSize: '15px' }}>
          Welcome back! Manage content, media uploads, and client reservations.
        </p>
      </div>

      {/* Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '35px',
        }}
      >
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            style={{
              backgroundColor: '#fff',
              padding: '24px',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500, marginBottom: '6px' }}>{s.label}</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#111827' }}>{s.count}</div>
            </div>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                backgroundColor: `${s.color}15`,
                color: s.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              <i className={`fas ${s.icon}`}></i>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '15px' }}>Quick Actions</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
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
            + Create New Event
          </Link>
          <Link
            href="/admin/gallery"
            style={{
              backgroundColor: '#fff',
              color: '#374151',
              border: '1px solid #d1d5db',
              padding: '10px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '14px',
            }}
          >
            Add Gallery Photos
          </Link>
          <Link
            href="/admin/media"
            style={{
              backgroundColor: '#fff',
              color: '#374151',
              border: '1px solid #d1d5db',
              padding: '10px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '14px',
            }}
          >
            Upload to Cloudflare R2
          </Link>
          <Link
            href="/admin/settings"
            style={{
              backgroundColor: '#fff',
              color: '#374151',
              border: '1px solid #d1d5db',
              padding: '10px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '14px',
            }}
          >
            Edit Phone & Contact Info
          </Link>
        </div>
      </div>

      {/* Recent Booking Inbox */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}
      >
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 600 }}>Recent Booking Inquiries</h3>
          <Link
            href="/admin/inbox"
            style={{ color: '#c5a880', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}
          >
            View All ({inboxCount}) →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#888' }}>
            No booking submissions received yet. When visitors fill the booking form, they will appear here.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>
                  <th style={{ padding: '12px 16px' }}>Name</th>
                  <th style={{ padding: '12px 16px' }}>Phone</th>
                  <th style={{ padding: '12px 16px' }}>Event Type</th>
                  <th style={{ padding: '12px 16px' }}>Event Date</th>
                  <th style={{ padding: '12px 16px' }}>Coupon</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#111827' }}>{b.username}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <a href={`tel:${b.phone}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                        {b.phone}
                      </a>
                    </td>
                    <td style={{ padding: '14px 16px' }}>{b.eventType}</td>
                    <td style={{ padding: '14px 16px' }}>{b.eventDate}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {b.coupon ? (
                        <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                          {b.coupon}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          backgroundColor: b.status === 'NEW' ? '#dcfce7' : '#f3f4f6',
                          color: b.status === 'NEW' ? '#166534' : '#4b5563',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
