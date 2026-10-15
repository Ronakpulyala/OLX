import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const item = db.getListingBySlugOrId(params.slug);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    const offers = db.getOffersForListing(item.id);

    return NextResponse.json({
      success: true,
      listing: {
        ...item,
        images: JSON.parse(item.images || '[]'),
        specs: JSON.parse(item.specs || '{}'),
        aiDetectionData: JSON.parse(item.aiDetectionData || '{}'),
      },
      offers,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  try {
    const item = db.getListingBySlugOrId(params.slug);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    const body = await req.json();
    const { buyerName, buyerPhone, offerPrice, message } = body;

    if (!buyerName || !offerPrice) {
      return NextResponse.json(
        { success: false, error: 'Buyer name and offer price are required' },
        { status: 400 }
      );
    }

    const offer = db.createOffer({
      listingId: item.id,
      buyerName,
      buyerPhone: buyerPhone || '+91 99000 11223',
      offerPrice: Number(offerPrice),
      message: message || `I want to purchase this item for ₹ ${offerPrice}`,
    });

    return NextResponse.json({ success: true, offer }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { slug: string } }) {
  try {
    const body = await req.json();
    const updated = db.updateListing(params.slug, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, listing: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  try {
    const deleted = db.deleteListing(params.slug);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Listing deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


