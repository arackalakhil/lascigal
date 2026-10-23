import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.eventService.findMany({
      orderBy: { order: 'asc' },
      include: { highlights: true },
    });
    return NextResponse.json({ events });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, categoryName, heroImage, summary, description, features, galleryImages, order } = body;

    if (!title || !slug || !heroImage) {
      return NextResponse.json({ error: 'Title, slug, and hero image are required' }, { status: 400 });
    }

    const created = await prisma.eventService.create({
      data: {
        title,
        slug,
        categoryName: categoryName || "Life's Celebrations",
        heroImage,
        summary: summary || null,
        description: description || null,
        features: Array.isArray(features) ? features : [],
        galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
        order: Number(order) || 0,
      },
    });

    return NextResponse.json({ success: true, event: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, title, slug, categoryName, heroImage, summary, description, features, galleryImages, order } = body;

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const updated = await prisma.eventService.update({
      where: { id },
      data: {
        title,
        slug,
        categoryName,
        heroImage,
        summary,
        description,
        features: Array.isArray(features) ? features : undefined,
        galleryImages: Array.isArray(galleryImages) ? galleryImages : undefined,
        order: Number(order) || 0,
      },
    });

    return NextResponse.json({ success: true, event: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.eventService.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
