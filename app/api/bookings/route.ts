import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Public POST for booking submissions
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, phone, event_date, event_type, time, coupon, message } = body;

    if (!username || !email || !phone || !event_date || !event_type || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const submission = await prisma.bookingSubmission.create({
      data: {
        username: String(username).trim(),
        email: String(email).trim().toLowerCase(),
        phone: String(phone).trim(),
        eventDate: String(event_date),
        eventType: String(event_type).trim(),
        time: String(time).trim(),
        coupon: coupon ? String(coupon).trim() : null,
        message: message ? String(message).trim() : null,
        status: 'NEW',
      },
    });

    return NextResponse.json({ success: true, id: submission.id });
  } catch (err: any) {
    console.error('Error in booking submission:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Admin-only GET for reading submissions
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const submissions = await prisma.bookingSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ submissions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Admin-only PATCH for status update
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    const updated = await prisma.bookingSubmission.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ success: true, updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Admin-only DELETE
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.bookingSubmission.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
