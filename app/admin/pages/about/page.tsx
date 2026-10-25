import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import AboutPageManager from './AboutPageManager';

export const dynamic = 'force-dynamic';

export default async function AdminAboutPageEditor() {
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
            Pages Management
          </div>
          <h1 style={{ fontSize: '26px', margin: 0, fontWeight: 700, color: '#111827' }}>About Us Page Content</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '14px' }}>
            Manage the Director&apos;s message, welcome vision, and the official YouTube venue showcase video.
          </p>
        </div>
      </div>

      <AboutPageManager initialSettings={settings} />
    </div>
  );
}
