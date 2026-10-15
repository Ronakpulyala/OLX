import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId') || undefined;
    const messages = db.getMessages(listingId);
    return NextResponse.json({ success: true, messages });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listingId, sender, senderName, text, time } = body;

    if (!listingId || !text) {
      return NextResponse.json(
        { success: false, error: 'Listing ID and message text are required' },
        { status: 400 }
      );
    }

    const newMsg = db.createMessage({
      listingId,
      sender: sender || 'buyer',
      senderName: senderName || 'User',
      text,
      time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    return NextResponse.json({ success: true, message: newMsg }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
