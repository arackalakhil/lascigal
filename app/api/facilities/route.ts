import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const facilities = await prisma.venueFacility.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ facilities });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { title, description, image, icon, order } = body;

    const facility = await prisma.venueFacility.create({
      data: {
        title,
        description: description || null,
        image: image || 'images/INDEX_ITEMS/hall1.jpg',
        icon: icon || 'fas fa-building-columns',
        order: Number(order) || 0,
      },
    });

    return NextResponse.json({ success: true, facility });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { id, title, description, image, icon, order } = body;

    const updated = await prisma.venueFacility.update({
      where: { id },
      data: {
        title,
        description,
        image,
        icon,
        order: Number(order) || 0,
      },
    });

    return NextResponse.json({ success: true, facility: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.venueFacility.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
