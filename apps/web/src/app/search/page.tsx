'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ListingCard, { ListingCardItem } from '@/components/ui/ListingCard';
import { CATEGORIES } from '@/lib/constants';
import { 
  Filter, 
  SlidersHorizontal, 
  ChevronRight, 
  RotateCcw, 
  ShieldCheck, 
  RefreshCw,
  Search,
  Check
} from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [aiVerifiedOnly, setAiVerifiedOnly] = useState<boolean>(false);
  
  const [listings, setListings] = useState<ListingCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch from database API
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        let url = `/api/listings?`;
        if (selectedCategory && selectedCategory !== 'all') {
          url += `category=${selectedCategory}&`;
        }
        if (searchQuery) {
          url += `q=${encodeURIComponent(searchQuery)}&`;
        }
        if (aiVerifiedOnly) {
          url += `aiVerified=true&`;
        }

        const res = await fetch(url);
        const data = await res.json();
        if (data.success && Array.isArray(data.listings)) {
          const formatted: ListingCardItem[] = data.listings.map((l: any) => {
            let imgs = [];
            try {
              imgs = JSON.parse(l.images || '[]');
            } catch {
              imgs = [l.images];
            }
            return {
              id: l.id,
              slug: l.slug,
              title: l.title,
              price: l.price,
              location: l.location,
              timeAgo: 'Recently added',
              image: imgs[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=450&fit=crop',
              featured: l.featured === 1,
              isAIVerified: l.isAIVerified === 1,
              aiConfidence: l.aiConfidence,
            };
          });
          setListings(formatted);
        }
      } catch (err) {
        console.error('Search fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [selectedCategory, searchQuery, aiVerifiedOnly]);

  // Client-side price filtering & sorting
  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (minPrice) {
      const min = Number(minPrice);
      if (!isNaN(min)) {
        result = result.filter(item => item.price >= min);
      }
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max)) {
        result = result.filter(item => item.price <= max);
      }
    }

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [listings, minPrice, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('date');
    setAiVerifiedOnly(false);
  };

  return (
    <div className="bg-[#f7f8f8] min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl space-y-6">

        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#002f34]">Home</Link>
          <ChevronRight size={14} />
          <span className="font-bold text-[#002f34]">Marketplace Search</span>
          {searchQuery && (
            <>
              <ChevronRight size={14} />
              <span className="text-teal-700 italic font-semibold">&ldquo;{searchQuery}&rdquo;</span>
            </>
          )}
        </div>

        {/* Results Count Headline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#002f34] tracking-tight">
              Classified Ads in India
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Showing <span className="font-bold text-[#002f34]">{filteredListings.length}</span> live marketplace ads
            </p>
          </div>

          {/* Quick Active Filters & Clear */}
          {(minPrice || maxPrice || aiVerifiedOnly || selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 px-3.5 py-2 rounded-full border border-teal-200 hover:bg-teal-100 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* 2-Column Search Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ─── Left Sidebar Filters (1 Col) ─────────────────────── */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* AI Verified Toggle Filter */}
            <div className="bg-emerald-50/90 p-5 rounded-2xl border-2 border-emerald-500 shadow-sm space-y-2.5">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-emerald-950 font-black select-none">
                <input
                  type="checkbox"
                  checked={aiVerifiedOnly}
                  onChange={(e) => setAiVerifiedOnly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <ShieldCheck size={20} className="text-emerald-700 shrink-0" />
                <span>AI Camera Verified Only</span>
              </label>
              <p className="text-[11px] text-emerald-800 leading-relaxed pl-6.5 font-medium">
                Only show listings where the seller proved live physical possession with our anti-spoof AI camera.
              </p>
            </div>

            {/* Categories Filter Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#002f34] pb-2 border-b border-gray-100 flex items-center justify-between">
                <span>Categories</span>
                <SlidersHorizontal size={14} className="text-gray-400" />
              </h3>

              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left py-2 px-3 rounded-xl font-bold transition-all ${
                    selectedCategory === 'all' 
                      ? 'bg-[#002f34] text-white shadow-xs' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Categories
                </button>

                {CATEGORIES.slice(0, 9).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left py-1.5 px-3 rounded-xl transition-all ${
                      selectedCategory === cat.id 
                        ? 'bg-teal-50 text-teal-800 font-black' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#002f34] pb-2 border-b border-gray-100">
                Price Range (₹)
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Min</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full text-xs font-bold border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-[#002f34]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Max</label>
                  <input
                    type="number"
                    placeholder="1,00,000+"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full text-xs font-bold border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-[#002f34]"
                  />
                </div>
              </div>

              {/* Quick price pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['5000', '20000', '50000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setMaxPrice(amt)}
                    className="text-[10px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition-colors"
                  >
                    Under ₹{Number(amt).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ─── Right Results Grid (3 Cols) ──────────────────────── */}
          <div className="lg:col-span-3 space-y-4">

            {/* Sort Bar */}
            <div className="bg-white px-5 py-3 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-600">
                {aiVerifiedOnly ? 'Filtered by AI Physical Camera Verification' : 'Marketplace inventory'}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-bold uppercase text-[10px]">SORT BY:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="font-bold text-[#002f34] bg-transparent outline-none cursor-pointer border-b border-gray-300 pb-0.5"
                >
                  <option value="date">Date Published</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="py-24 text-center text-gray-400 flex flex-col items-center justify-center gap-3">
                <RefreshCw size={24} className="animate-spin text-teal-600" />
                <span className="text-sm font-bold text-gray-600">Searching marketplace database...</span>
              </div>
            ) : filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3 shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <Filter size={28} />
                </div>
                <h3 className="text-lg font-bold text-[#002f34]">No Listings Found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  No items matched your current search filters. Try adjusting price or category filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-2 bg-[#002f34] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#001e21] transition-colors shadow-md"
                >
                  Clear All Filters
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
