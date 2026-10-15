'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ListingCard, { ListingCardItem } from '@/components/ui/ListingCard';
import { Heart, ShieldCheck, ArrowRight, RefreshCw, Trash2 } from 'lucide-react';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<ListingCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterVerified, setFilterVerified] = useState(false);

  useEffect(() => {
    async function loadFavorites() {
      try {
        setLoading(true);
        const res = await fetch('/api/listings');
        const data = await res.json();
        if (data.success && Array.isArray(data.listings)) {
          // Select featured / high rated listings as favorites by default
          const favs: ListingCardItem[] = data.listings.slice(0, 3).map((l: any) => {
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
              timeAgo: 'Saved recently',
              image: imgs[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=450&fit=crop',
              featured: l.featured === 1,
              isAIVerified: l.isAIVerified === 1,
              aiConfidence: l.aiConfidence,
            };
          });
          setFavorites(favs);
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, []);

  const handleClearAll = () => {
    if (confirm('Clear all items from your saved favorites?')) {
      setFavorites([]);
    }
  };

  const displayedListings = filterVerified 
    ? favorites.filter(f => f.isAIVerified)
    : favorites;

  return (
    <div className="bg-[#f7f8f8] min-h-[calc(100vh-80px)] py-8">
      <div className="container mx-auto px-4 max-w-7xl space-y-6">
        
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                <Heart size={22} className="fill-red-500" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#002f34] tracking-tight">
                  Saved Favorites
                </h1>
                <p className="text-xs text-gray-500">
                  {favorites.length} items saved to your private wishlist
                </p>
              </div>
            </div>
          </div>

          {favorites.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilterVerified(!filterVerified)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all border flex items-center gap-1.5 cursor-pointer ${
                  filterVerified 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                <ShieldCheck size={16} />
                <span>AI Verified Only</span>
              </button>

              <button
                onClick={handleClearAll}
                className="text-xs font-bold text-gray-500 hover:text-red-600 px-3 py-2 rounded-xl border border-gray-200 hover:border-red-200 bg-white hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="py-24 text-center text-gray-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-teal-600" />
            <span className="text-sm font-bold text-gray-600">Loading your saved items...</span>
          </div>
        ) : displayedListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {displayedListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 sm:p-16 text-center space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto">
              <Heart size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#002f34]">No Saved Favorites</h3>
              <p className="text-xs text-gray-500">
                You haven&apos;t added any items to your favorites yet. Tap the heart icon on any ad to keep track of it here.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#002f34] hover:bg-[#001e21] text-white text-xs font-bold px-6 py-3.5 rounded-xl uppercase tracking-wider transition-colors shadow-md"
            >
              <span>Explore Marketplace Ads</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
