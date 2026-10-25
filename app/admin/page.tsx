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

  const [eventsCount, facilitiesCount, galleryCount, inboxCount, pendingCount, recentBookings] =
    await Promise.all([
      prisma.eventService.count(),
      prisma.venueFacility.count(),
      prisma.galleryItem.count(),
      prisma.bookingSubmission.count(),
      prisma.bookingSubmission.count({ where: { status: 'pending' } }),
      prisma.bookingSubmission.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
    ]);

  const stats = [
    { label: 'Event Services', count: eventsCount, href: '/admin/events', icon: 'fa-calendar-days', color: '#3b82f6' },
    { label: 'Venue Facilities', count: facilitiesCount, href: '/admin/facilities', icon: 'fa-building-columns', color: '#8b5cf6' },
    { label: 'Gallery Photos', count: galleryCount, href: '/admin/gallery', icon: 'fa-images', color: '#10b981' },
    { label: 'Total Inquiries', count: inboxCount, href: '/admin/inbox', icon: 'fa-envelope-open-text', color: '#f59e0b', sub: `${pendingCount} pending review` },
  ];

  const websitePages = [
    {
      title: 'Home Page',
      description: 'Hero banner photo, headline, tagline, discount offer text, and homepage story.',
      href: '/admin/pages/home',
      viewHref: '/',
      icon: 'fa-house',
      color: '#3b82f6',
    },
    {
      title: 'About Us Page',
      description: 'Director’s official welcome message, vision story, and YouTube video showcase embed.',
      href: '/admin/pages/about',
      viewHref: '/aboutus',
      icon: 'fa-circle-info',
      color: '#10b981',
    },
    {
      title: 'Contact Us Page',
      description: 'Phone numbers, WhatsApp number, email, address line, and embedded Google Maps.',
      href: '/admin/pages/contact',
      viewHref: '/contactus',
      icon: 'fa-phone',
      color: '#f59e0b',
    },
    {
      title: '6 Venue Facilities',
      description: 'Grand AC Hall, parking, catering dining, VIP green rooms, and advanced AV systems.',
      href: '/admin/facilities',
      viewHref: '/',
      icon: 'fa-building-columns',
      color: '#8b5cf6',
    },
    {
      title: 'Events & Portfolio',
      description: 'Weddings, corporate conferences, receptions, birthdays, galas, and inclusions.',
      href: '/admin/events',
      viewHref: '/portfolio',
      icon: 'fa-calendar-days',
      color: '#ec4899',
    },
    {
      title: 'Cobbles Photo Gallery',
      description: 'High-resolution photo collection, category filters (weddings, banquets, decor).',
      href: '/admin/gallery',
      viewHref: '/gallery',
      icon: 'fa-images',
      color: '#06b6d4',
    },
    {
      title: 'Brand Identity & SEO',
      description: 'Brand logo for header/footer, browser tab favicon, SEO title, and meta snippet.',
      href: '/admin/pages/brand',
      viewHref: '/',
      icon: 'fa-palette',
      color: '#c5a880',
    },
    {
      title: 'Cloudflare Media Hub',
      description: 'Direct R2 object storage uploads and browser-side ZIP bulk file extractor.',
      href: '/admin/media',
      viewHref: null,
      icon: 'fa-cloud-arrow-up',
      color: '#64748b',
    },
  ];

  return (
    <div>
      {/* Welcome Title */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '26px', margin: '0 0 5px', fontWeight: 700, color: '#0f172a' }}>
            Lascigal Control Dashboard
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14.5px' }}>
            Select any page on the left side panel to customize images, banners, and copy in real-time.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            href="/admin/inbox"
            style={{
              padding: '8px 16px',
              backgroundColor: '#fff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              color: '#334155',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <i className="fas fa-inbox" style={{ color: '#f59e0b' }}></i>
            <span>Inquiries {pendingCount > 0 ? `(${pendingCount})` : ''}</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            style={{
              padding: '8px 18px',
              backgroundColor: '#c5a880',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Live Site</span>
            <span>↗</span>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '18px',
          marginBottom: '35px',
        }}
      >
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            style={{
              backgroundColor: '#fff',
              padding: '22px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, marginBottom: '6px' }}>{s.label}</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{s.count}</div>
              {s.sub && (
                <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600, marginTop: '5px' }}>{s.sub}</div>
              )}
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                backgroundColor: `${s.color}15`,
                color: s.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              <i className={`fas ${s.icon}`}></i>
            </div>
          </Link>
        ))}
      </div>

      {/* Website Pages Grid (The Main Feature Asked By User) */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>
            📄 Website Pages Content Management
          </h2>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b' }}>
            Click &quot;Edit Page Content&quot; to manage text, photos, and banners for each specific page.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '18px',
          }}
        >
          {websitePages.map((page) => (
            <div
              key={page.title}
              style={{
                backgroundColor: '#fff',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: `${page.color}15`,
                      color: page.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                    }}
                  >
                    <i className={`fas ${page.icon}`}></i>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                      {page.title}
                    </h3>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: '0 0 20px', minHeight: '38px' }}>
                  {page.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                <Link
                  href={page.href}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '8px 12px',
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '6px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <i className="fas fa-pen-to-square" style={{ fontSize: '11px' }}></i>
                  <span>Edit Content</span>
                </Link>

                {page.viewHref && (
                  <Link
                    href={page.viewHref}
                    target="_blank"
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#f8fafc',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                    title="View live page in new tab"
                  >
                    ↗
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Inquiries List */}
      <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 3px', color: '#0f172a' }}>
              Recent Booking Inquiries
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              Latest customer reservation requests from the website.
            </p>
          </div>
          <Link
            href="/admin/inbox"
            style={{ fontSize: '13px', color: '#c5a880', fontWeight: 600, textDecoration: 'none' }}
          >
            View All Inquiries →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            No inquiries received yet. Submitted client booking forms will appear here.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '12px 20px', fontWeight: 600 }}>Client</th>
                  <th style={{ padding: '12px 20px', fontWeight: 600 }}>Phone</th>
                  <th style={{ padding: '12px 20px', fontWeight: 600 }}>Event Type</th>
                  <th style={{ padding: '12px 20px', fontWeight: 600 }}>Event Date</th>
                  <th style={{ padding: '12px 20px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '12px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#0f172a' }}>
                      {b.username}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <a href={`tel:${b.phone}`} style={{ color: '#0f172a', textDecoration: 'none' }}>
                        {b.phone}
                      </a>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#475569' }}>
                      {b.eventType || 'Celebration'}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#475569' }}>
                      {b.eventDate || 'TBD'}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          backgroundColor:
                            b.status === 'confirmed'
                              ? '#dcfce7'
                              : b.status === 'contacted'
                              ? '#e0e7ff'
                              : '#fef3c7',
                          color:
                            b.status === 'confirmed'
                              ? '#166534'
                              : b.status === 'contacted'
                              ? '#3730a3'
                              : '#92400e',
                          textTransform: 'uppercase',
                        }}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <a
                          href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp"
                          style={{
                            padding: '4px 10px',
                            backgroundColor: '#25D366',
                            color: '#fff',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '11.5px',
                            fontWeight: 600,
                          }}
                        >
                          WhatsApp
                        </a>
                        <Link
                          href="/admin/inbox"
                          style={{
                            padding: '4px 10px',
                            backgroundColor: '#f1f5f9',
                            color: '#334155',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '11.5px',
                            fontWeight: 600,
                          }}
                        >
                          Details
                        </Link>
                      </div>
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
