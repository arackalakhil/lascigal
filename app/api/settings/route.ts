import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const list = await prisma.siteSetting.findMany();
    const settings = list.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    return NextResponse.json({ settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized. Please log in again.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const settings = body.settings;
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Settings object required' }, { status: 400 });
    }

    const entries = Object.entries(settings);
    // Process in batches of 2 to ensure we never exhaust Supabase PgBouncer pooler limits
    for (let i = 0; i < entries.length; i += 2) {
      const batch = entries.slice(i, i + 2).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: String(value ?? '') },
          create: { key, value: String(value ?? '') },
        })
      );
      await Promise.all(batch);
    }

    return NextResponse.json({ success: true, count: entries.length });
  } catch (err: any) {
    console.error('Settings update error:', err);
    return NextResponse.json({ error: err.message || 'Database error saving settings' }, { status: 500 });
  }
}
