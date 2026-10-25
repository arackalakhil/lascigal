import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ContactPageManager from './ContactPageManager';

export const dynamic = 'force-dynamic';

export default async function AdminContactPageEditor() {
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
          <h1 style={{ fontSize: '26px', margin: 0, fontWeight: 700, color: '#111827' }}>Contact Us & Channels</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: '14px' }}>
            Configure phone numbers, WhatsApp, emails, address lines, and the interactive Google Maps embed.
          </p>
        </div>
      </div>

      <ContactPageManager initialSettings={settings} />
    </div>
  );
}
