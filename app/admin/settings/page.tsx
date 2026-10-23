import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
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
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 700 }}>Site Settings & Contact Configuration</h1>
        <p style={{ color: '#666', margin: '4px 0 0', fontSize: '14px' }}>
          Instantly update phone numbers, emails, addresses, maps, and announcements across the entire site without touching code.
        </p>
      </div>

      <SettingsManager initialSettings={settings} />
    </div>
  );
}
