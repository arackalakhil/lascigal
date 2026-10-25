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
    if (entries.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    // Atomic single-query PostgreSQL bulk upsert: executes in < 800ms, immune to Vercel/PgBouncer timeouts
    const valuePlaceholders = entries.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ');
    const params = entries.flatMap(([k, v]) => [k, String(v ?? '')]);

    const query = `
      INSERT INTO "SiteSetting" ("key", "value")
      VALUES ${valuePlaceholders}
      ON CONFLICT ("key")
      DO UPDATE SET "value" = EXCLUDED."value";
    `;

    await prisma.$executeRawUnsafe(query, ...params);

    return NextResponse.json({ success: true, count: entries.length });
  } catch (err: any) {
    console.error('Settings update error:', err);
    return NextResponse.json({ error: err.message || 'Database error saving settings' }, { status: 500 });
  }
}
