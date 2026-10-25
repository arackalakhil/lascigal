import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import SettingsManager from './SettingsManager';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const list = await prisma.siteSetting.findMany();
  const settings = list.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div>
      <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <div style={{ fontSize: '13px', color: '#c5a880', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            System Settings
          </div>
          <h1 style={{ fontSize: '26px', margin: 0, fontWeight: 700, color: '#0f172a' }}>Master Site Settings</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '14px' }}>
            All site configurations, phone channels, addresses, and banners in one unified view.
          </p>
        </div>

        {/* Quick jumps to individual page editors */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <Link
            href="/admin/pages/home"
            style={{ padding: '6px 12px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px', fontWeight: 600, color: '#334155', textDecoration: 'none' }}
          >
            🏠 Home
          </Link>
          <Link
            href="/admin/pages/about"
            style={{ padding: '6px 12px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px', fontWeight: 600, color: '#334155', textDecoration: 'none' }}
          >
            ℹ️ About
          </Link>
          <Link
            href="/admin/pages/contact"
            style={{ padding: '6px 12px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px', fontWeight: 600, color: '#334155', textDecoration: 'none' }}
          >
            📞 Contact
          </Link>
          <Link
            href="/admin/pages/brand"
            style={{ padding: '6px 12px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px', fontWeight: 600, color: '#334155', textDecoration: 'none' }}
          >
            👑 Brand
          </Link>
        </div>
      </div>

      <SettingsManager initialSettings={settings} />
    </div>
  );
}
