import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import AdminSidebar from './AdminSidebar';
import prisma from '@/lib/prisma';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <>{children}</>;
  }

  // Fetch pending count & logo for sidebar
  const [pendingCount, logoSetting] = await Promise.all([
    prisma.bookingSubmission.count({ where: { status: 'pending' } }).catch(() => 0),
    prisma.siteSetting.findUnique({ where: { key: 'site_logo' } }).catch(() => null),
  ]);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        color: '#1e293b',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Left Side Panel (Desktop Sticky & Mobile Drawer) */}
      <AdminSidebar
        sessionUser={session.user?.email || 'admin@lascigal.com'}
        pendingCount={pendingCount}
        logo={logoSetting?.value || 'images/laslogo1.png'}
      />

      {/* Main Admin Content Shell */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Desktop Top Bar */}
        <header
          style={{
            height: '60px',
            backgroundColor: '#fff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 30px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#64748b' }}>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>Lascigal CMS</span>
            <span>/</span>
            <span>Side Panel Management</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link
              href="/"
              target="_blank"
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#c5a880',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 14px',
                borderRadius: '6px',
                backgroundColor: 'rgba(197, 168, 128, 0.1)',
                border: '1px solid rgba(197, 168, 128, 0.3)',
                transition: 'all 0.2s',
              }}
            >
              <span>View Public Website</span>
              <span>↗</span>
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main style={{ flex: 1, padding: '30px', maxWidth: '1300px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
