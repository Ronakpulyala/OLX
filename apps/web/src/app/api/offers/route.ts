import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId');
    if (listingId) {
      const offers = db.getOffersForListing(listingId);
      return NextResponse.json({ success: true, offers });
    }
    const offers = db.getAllOffers();
    return NextResponse.json({ success: true, offers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listingId, buyerName, buyerPhone, offerPrice, message } = body;

    if (!listingId || !buyerName || !offerPrice) {
      return NextResponse.json(
        { success: false, error: 'Listing ID, buyer name and offer price are required' },
        { status: 400 }
      );
    }

    const offer = db.createOffer({
      listingId,
      buyerName,
      buyerPhone: buyerPhone || '+91 98765 00000',
      offerPrice: Number(offerPrice),
      message: message || `I offer ₹ ${offerPrice}`,
    });

    return NextResponse.json({ success: true, offer }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
