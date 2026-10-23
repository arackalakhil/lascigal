import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminNav from './AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // We allow child layout to render without header for /admin/login
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
        color: '#222',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {session ? (
        <>
          <AdminNav sessionUser={session.user?.email || 'Admin'} />
          <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '30px 20px' }}>
            {children}
          </main>
        </>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}
