import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const query = searchParams.get('q') || undefined;
    const aiVerifiedOnly = searchParams.get('aiVerified') === 'true';

    const items = db.getAllListings({ category, query, aiVerifiedOnly });
    return NextResponse.json({ success: true, count: items.length, listings: items });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      category,
      condition,
      price,
      currency = 'INR',
      negotiable = true,
      location,
      images = [],
      specs = {},
      isAIVerified = false,
      aiConfidence = 0,
      aiDetectionData = {},
      sellerName = 'Verified User',
      sellerPhone = '+91 98765 43210',
      sellerAvatar = '',
    } = body;

    if (!title || !description || !category || !price || !location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (title, description, category, price, location)' },
        { status: 400 }
      );
    }

    // Generate unique slug
    const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${cleanTitle}-${Date.now().toString(36)}`;

    const newListing = db.createListing({
      slug,
      title,
      description,
      category,
      condition: condition || 'Used - Good',
      price: Number(price),
      currency,
      negotiable: negotiable ? 1 : 0,
      location,
      images: JSON.stringify(images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=450&fit=crop']),
      specs: JSON.stringify(specs),
      isAIVerified: isAIVerified ? 1 : 0,
      aiConfidence: Number(aiConfidence) || 0,
      aiDetectionData: JSON.stringify(aiDetectionData),
      sellerName,
      sellerPhone,
      sellerAvatar,
      status: 'active',
      featured: isAIVerified ? 1 : 0, // AI verified listings get featured boost
    });

    return NextResponse.json({ success: true, listing: newListing }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating listing:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

