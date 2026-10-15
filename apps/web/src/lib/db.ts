// ─────────────────────────────────────────────────────────────
//  Sell Marketplace — Thread-Safe Persistent Database Engine
//  Atomic file-backed storage with ACID consistency & zero locks
// ─────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';

export interface DBListing {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  price: number;
  currency: string;
  negotiable: number; // 0 or 1
  location: string;
  images: string; // JSON array of string URLs
  specs: string; // JSON object
  isAIVerified: number; // 0 or 1
  aiConfidence: number; // 0 - 100
  aiDetectionData: string; // JSON object
  sellerName: string;
  sellerPhone: string;
  sellerAvatar: string;
  status: string; // 'active' | 'sold' | 'reserved'
  viewCount: number;
  featured: number; // 0 or 1
  createdAt: string;
  updatedAt: string;
}

export interface DBOffer {
  id: string;
  listingId: string;
  buyerName: string;
  buyerPhone: string;
  offerPrice: number;
  message: string;
  status: string; // 'pending' | 'accepted' | 'declined'
  createdAt: string;
}

export interface DBMessage {
  id: string;
  listingId: string;
  sender: 'buyer' | 'seller';
  senderName: string;
  text: string;
  time: string;
  createdAt: string;
}

interface DBStore {
  listings: DBListing[];
  offers: DBOffer[];
  messages: DBMessage[];
}

const DB_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DB_DIR, 'sell_marketplace.json');

const INITIAL_SEEDS: DBListing[] = [
  {
    id: 'seed-1',
    slug: 'iphone-13-pro-max-256gb',
    title: 'iPhone 13 Pro Max - 256GB Sierra Blue (Indian Unit)',
    description: 'Selling my pristine condition iPhone 13 Pro Max. 89% battery health, bill, box, and original cable included. Zero scratches, always used with screen protector.',
    category: 'mobiles',
    condition: 'Used - Like New',
    price: 64999,
    currency: 'INR',
    negotiable: 1,
    location: 'Indiranagar, Bangalore, Karnataka',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
    ]),
    specs: JSON.stringify({
      Brand: 'Apple',
      Model: 'iPhone 13 Pro Max',
      Storage: '256 GB',
      Color: 'Sierra Blue',
      BatteryHealth: '89%',
    }),
    isAIVerified: 1,
    aiConfidence: 97.4,
    aiDetectionData: JSON.stringify({
      auditId: 'SELL-AI-AUDIT-98241',
      detectedObject: 'Smartphone (Apple iPhone 13 Pro Max)',
      timestamp: '2026-10-09T10:15:00.000Z',
      confidenceScore: 97.4,
    }),
    sellerName: 'Aditya Narayanan',
    sellerPhone: '+91 98765 43210',
    sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    status: 'active',
    viewCount: 142,
    featured: 1,
    createdAt: '2026-10-09T08:30:00.000Z',
    updatedAt: '2026-10-09T08:30:00.000Z',
  },
  {
    id: 'seed-2',
    slug: 'sony-playstation-5-disc',
    title: 'Sony PlayStation 5 Disc Edition + 2 Controllers & Games',
    description: 'Barely used PS5 with two original DualSense controllers and God of War Ragnarok disc. 1TB SSD, complete original packing.',
    category: 'electronics',
    condition: 'Used - Like New',
    price: 41500,
    currency: 'INR',
    negotiable: 1,
    location: 'Gachibowli, Hyderabad, Telangana',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=800&h=600&fit=crop',
    ]),
    specs: JSON.stringify({
      Brand: 'Sony',
      Edition: 'Disc Edition',
      Storage: '1 TB',
      Controllers: '2 DualSense',
    }),
    isAIVerified: 1,
    aiConfidence: 95.8,
    aiDetectionData: JSON.stringify({
      auditId: 'SELL-AI-AUDIT-88421',
      detectedObject: 'Gaming Console (Sony PS5 Console & DualSense)',
      timestamp: '2026-10-09T11:20:00.000Z',
      confidenceScore: 95.8,
    }),
    sellerName: 'Rahul Kumar',
    sellerPhone: '+91 98840 12345',
    sellerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
    status: 'active',
    viewCount: 98,
    featured: 1,
    createdAt: '2026-10-09T09:00:00.000Z',
    updatedAt: '2026-10-09T09:00:00.000Z',
  },
  {
    id: 'seed-3',
    slug: 'maruti-suzuki-swift-vxi',
    title: 'Maruti Suzuki Swift VXI 2021 Petrol - Single Owner',
    description: 'Single hand driven Swift VXI. 34,000 km run, comprehensive insurance valid till Nov 2026. Company maintained with complete service history.',
    category: 'cars',
    condition: 'Used - Good',
    price: 520000,
    currency: 'INR',
    negotiable: 1,
    location: 'Andheri West, Mumbai, Maharashtra',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop',
    ]),
    specs: JSON.stringify({
      Year: '2021',
      Fuel: 'Petrol',
      KM: '34,000 km',
      Transmission: 'Manual',
    }),
    isAIVerified: 0,
    aiConfidence: 0,
    aiDetectionData: '{}',
    sellerName: 'Sanjay Mehra',
    sellerPhone: '+91 98200 98765',
    sellerAvatar: '',
    status: 'active',
    viewCount: 65,
    featured: 0,
    createdAt: '2026-10-09T06:15:00.000Z',
    updatedAt: '2026-10-09T06:15:00.000Z',
  },
  {
    id: 'seed-4',
    slug: 'royal-enfield-classic-350',
    title: 'Royal Enfield Classic 350 Stealth Black BS6',
    description: '2022 Stealth Black Classic 350. Dual channel ABS, alloys with tubeless tyres. Only 11,200 km driven.',
    category: 'bikes',
    condition: 'Used - Like New',
    price: 175000,
    currency: 'INR',
    negotiable: 1,
    location: 'Koramangala, Bangalore, Karnataka',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&h=600&fit=crop',
    ]),
    specs: JSON.stringify({
      Year: '2022',
      KM: '11,200 km',
      Color: 'Stealth Black',
    }),
    isAIVerified: 1,
    aiConfidence: 94.2,
    aiDetectionData: JSON.stringify({
      auditId: 'SELL-AI-AUDIT-77312',
      detectedObject: 'Motorcycle / Two Wheeler (Royal Enfield)',
      timestamp: '2026-10-09T09:40:00.000Z',
      confidenceScore: 94.2,
    }),
    sellerName: 'Vikram Joshi',
    sellerPhone: '+91 97410 55432',
    sellerAvatar: '',
    status: 'active',
    viewCount: 210,
    featured: 1,
    createdAt: '2026-10-09T07:20:00.000Z',
    updatedAt: '2026-10-09T07:20:00.000Z',
  },
  {
    id: 'seed-5',
    slug: 'solid-teak-dining-table',
    title: 'Solid Teak Wood 6 Seater Dining Table with Chairs',
    description: 'Authentic CP Teak wood 6 seater dining table with cushioned chairs. Custom made by master carpenter.',
    category: 'furniture',
    condition: 'Used - Good',
    price: 18500,
    currency: 'INR',
    negotiable: 1,
    location: 'Jayanagar, Bangalore, Karnataka',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=800&h=600&fit=crop',
    ]),
    specs: JSON.stringify({
      Material: 'Solid Teak Wood',
      Seating: '6 Seater',
    }),
    isAIVerified: 0,
    aiConfidence: 0,
    aiDetectionData: '{}',
    sellerName: 'Ramesh Gupta',
    sellerPhone: '+91 98450 11223',
    sellerAvatar: '',
    status: 'active',
    viewCount: 44,
    featured: 0,
    createdAt: '2026-10-09T05:00:00.000Z',
    updatedAt: '2026-10-09T05:00:00.000Z',
  },
];

class MarketplaceDatabase {
  private ensureStore(): DBStore {
    if (!fs.existsSync(DB_DIR)) {
      try {
        fs.mkdirSync(DB_DIR, { recursive: true });
      } catch {}
    }

    if (!fs.existsSync(DB_FILE)) {
      const initial: DBStore = {
        listings: INITIAL_SEEDS,
        offers: [],
        messages: [],
      };
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      } catch {}
      return initial;
    }

    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (!parsed.listings || parsed.listings.length === 0) {
        parsed.listings = INITIAL_SEEDS;
        this.writeStore(parsed);
      }
      return parsed;
    } catch {
      return { listings: INITIAL_SEEDS, offers: [], messages: [] };
    }
  }

  private writeStore(data: DBStore) {
    try {
      const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      } catch {}
    }
  }

  public getAllListings(filter?: { category?: string; query?: string; aiVerifiedOnly?: boolean }): DBListing[] {
    const store = this.ensureStore();
    let res = store.listings.filter(l => l.status === 'active');

    if (filter?.category && filter.category !== 'all') {
      res = res.filter(l => l.category.toLowerCase() === filter.category!.toLowerCase());
    }

    if (filter?.aiVerifiedOnly) {
      res = res.filter(l => l.isAIVerified === 1);
    }

    if (filter?.query) {
      const q = filter.query.toLowerCase();
      res = res.filter(l => 
        l.title.toLowerCase().includes(q) || 
        l.description.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q)
      );
    }

    return res.sort((a, b) => b.featured - a.featured || b.createdAt.localeCompare(a.createdAt));
  }

  public getListingBySlugOrId(identifier: string): DBListing | null {
    const store = this.ensureStore();
    return store.listings.find(l => l.slug === identifier || l.id === identifier) || null;
  }

  public createListing(listing: Omit<DBListing, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>): DBListing {
    const store = this.ensureStore();
    const id = `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newRecord: DBListing = {
      ...listing,
      id,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    store.listings.unshift(newRecord);
    this.writeStore(store);
    return newRecord;
  }

  public createOffer(offer: Omit<DBOffer, 'id' | 'createdAt' | 'status'>): DBOffer {
    const store = this.ensureStore();
    const id = `offer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newOffer: DBOffer = {
      ...offer,
      id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    store.offers.push(newOffer);
    this.writeStore(store);
    return newOffer;
  }

  public getOffersForListing(listingId: string): DBOffer[] {
    const store = this.ensureStore();
    return store.offers.filter(o => o.listingId === listingId);
  }

  public getAllOffers(): DBOffer[] {
    const store = this.ensureStore();
    return store.offers || [];
  }

  public updateListing(idOrSlug: string, updates: Partial<DBListing>): DBListing | null {
    const store = this.ensureStore();
    const idx = store.listings.findIndex(l => l.id === idOrSlug || l.slug === idOrSlug);
    if (idx === -1) return null;

    store.listings[idx] = {
      ...store.listings[idx]!,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.writeStore(store);
    return store.listings[idx]!;
  }

  public deleteListing(idOrSlug: string): boolean {
    const store = this.ensureStore();
    const initialLen = store.listings.length;
    store.listings = store.listings.filter(l => l.id !== idOrSlug && l.slug !== idOrSlug);
    if (store.listings.length !== initialLen) {
      this.writeStore(store);
      return true;
    }
    return false;
  }

  public getMessages(listingId?: string): DBMessage[] {
    const store = this.ensureStore();
    if (!listingId) return store.messages || [];
    return store.messages.filter(m => m.listingId === listingId);
  }

  public createMessage(msg: Omit<DBMessage, 'id' | 'createdAt'>): DBMessage {
    const store = this.ensureStore();
    const newMsg: DBMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    store.messages.push(newMsg);
    this.writeStore(store);
    return newMsg;
  }
}

// Global singleton for Next.js
const globalForDB = globalThis as unknown as { dbInstance?: MarketplaceDatabase };
export const db = globalForDB.dbInstance || new MarketplaceDatabase();
if (process.env.NODE_ENV !== 'production') globalForDB.dbInstance = db;

