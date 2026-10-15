'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ListingCard, { ListingCardItem } from '@/components/ui/ListingCard';
import CategoryCard from '@/components/ui/CategoryCard';
import { CATEGORIES } from '@/lib/constants';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Smartphone, 
  RefreshCw, 
  CheckCircle2, 
  Lock, 
  Camera, 
  Zap, 
  Eye, 
  AlertOctagon,
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react';

export default function Home() {
  const [listings, setListings] = useState<ListingCardItem[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'aiVerified' | 'mobiles' | 'electronics' | 'bikes'>('all');
  const [loading, setLoading] = useState(true);

  // Fetch live listings from database API
  const fetchListings = async (activeFilter = 'all') => {
    try {
      setLoading(true);
      let url = '/api/listings';
      if (activeFilter === 'aiVerified') {
        url += '?aiVerified=true';
      } else if (activeFilter !== 'all') {
        url += `?category=${activeFilter}`;
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
      console.error('Failed to load listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings(filterMode);
  }, [filterMode]);

  return (
    <div className="bg-[#f7f8f8] min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl py-6 space-y-12">

        {/* ─── Hero Promotional Banner ─────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002f34] via-[#003e45] to-[#001e21] text-white p-7 sm:p-10 md:p-12 shadow-xl border border-teal-900/50">
          
          {/* Subtle background glow circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#23e5db]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#ffce32]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-[#ffce32] border border-white/20 shadow-sm">
              <Sparkles size={14} className="text-[#ffce32] animate-spin-slow" />
              <span>India&apos;s 1st AI Camera-Verified Marketplace</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15]">
              Buy &amp; Sell Safely With <br className="hidden sm:block" />
              <span className="text-[#ffce32] underline decoration-teal-400 decoration-wavy decoration-2 underline-offset-8">
                AI Camera Verification.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-200 font-normal max-w-xl leading-relaxed">
              Zero fake photos. Sellers prove live physical possession through real-time AI vision inspection. 
              Photos displayed on other phone screens are strictly rejected!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link 
                href="/post" 
                className="bg-[#ffce32] hover:bg-[#f7b900] text-[#002f34] font-black text-sm px-7 py-3.5 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 uppercase tracking-wide cursor-pointer"
              >
                <span>Post Ad &amp; Verify Now</span>
                <ArrowRight size={16} />
              </Link>
              
              <button 
                onClick={() => setFilterMode('aiVerified')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-6 py-3.5 rounded-xl backdrop-blur-md transition-all border border-white/20 flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <ShieldCheck size={18} className="text-[#23e5db]" />
                <span>Browse Verified Items</span>
              </button>
            </div>
          </div>

          {/* Right Floating Stats Cards */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 text-center">
            <div className="bg-white/10 backdrop-blur-md p-4 px-6 rounded-2xl border border-white/20 shadow-lg text-left">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-0.5">
                <CheckCircle2 size={16} />
                <span>Zero Fake Photos</span>
              </div>
              <p className="text-2xl font-black text-white">100% Real 3D</p>
              <p className="text-[11px] text-gray-300">Phone screen photos blocked</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 px-6 rounded-2xl border border-white/20 shadow-lg text-left">
              <div className="flex items-center gap-2 text-[#ffce32] text-xs font-bold mb-0.5">
                <Zap size={16} />
                <span>Verified Trust</span>
              </div>
              <p className="text-2xl font-black text-white">3x Faster</p>
              <p className="text-[11px] text-gray-300">Sales turnaround for sellers</p>
            </div>
          </div>
        </div>

        {/* ─── HOW AI VERIFICATION WORKS (Rule Enforcement Section) ─── */}
        <section className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 md:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800">
                <ShieldCheck size={16} className="text-teal-600" />
                <span>Anti-Fraud Guarantee</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#002f34] tracking-tight mt-1">
                How Our AI Camera Verification Works
              </h2>
            </div>
            <p className="text-xs text-gray-500 max-w-sm">
              Proprietary computer vision enforces genuine seller possession before any verified badge is issued.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-3 relative group hover:border-[#002f34] transition-all">
              <span className="w-8 h-8 rounded-xl bg-[#002f34] text-white flex items-center justify-center text-xs font-black">
                1
              </span>
              <h3 className="font-bold text-sm text-[#002f34]">Post Item Details</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Enter your product title, category, description, and price accurately. The AI uses this as the inspection target.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-3 relative group hover:border-[#002f34] transition-all">
              <span className="w-8 h-8 rounded-xl bg-teal-800 text-white flex items-center justify-center text-xs font-black">
                2
              </span>
              <h3 className="font-bold text-sm text-[#002f34]">Live Camera Scan</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Activate your camera and present the physical product in real-time. Natural 3D geometry and continuous lighting are analyzed.
              </p>
            </div>

            {/* Step 3 - THE CRITICAL REQUIREMENT */}
            <div className="p-5 rounded-2xl bg-red-50/80 border-2 border-red-300 space-y-3 relative group hover:border-red-500 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center text-xs font-black">
                  3
                </span>
                <span className="text-[10px] font-black uppercase text-red-700 bg-red-200/70 px-2 py-0.5 rounded">
                  Strict Rule
                </span>
              </div>
              <h3 className="font-bold text-sm text-red-950">Anti-Screen Spoof Check</h3>
              <p className="text-xs text-red-900 leading-relaxed font-medium">
                <strong>No phone photos allowed!</strong> If someone holds a phone displaying an image or shows the wrong item, AI automatically flags and rejects it.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 space-y-3 relative group hover:border-emerald-500 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-xs font-black">
                  4
                </span>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded">
                  Instant Badge
                </span>
              </div>
              <h3 className="font-bold text-sm text-emerald-950">AI Verified Badge</h3>
              <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                Upon passing, your listing earns the official green badge, cryptographic audit certificate, and top-tier search visibility.
              </p>
            </div>

          </div>
        </section>

        {/* ─── Browse Categories Section ───────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-[#002f34] tracking-tight">
                Explore All Categories
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Find deals across India with verified local sellers</p>
            </div>
            <Link 
              href="/search" 
              className="text-xs font-bold text-teal-800 hover:text-[#002f34] flex items-center gap-1 group"
            >
              <span>See All</span>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3 sm:gap-3.5">
            {CATEGORIES.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        {/* ─── Fresh Recommendations Section ──────────────────────── */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-[#002f34] tracking-tight flex items-center gap-2">
                <span>Fresh Marketplace Recommendations</span>
                {filterMode === 'aiVerified' && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                    AI Verified Only
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Live listings from verified community sellers</p>
            </div>

            {/* Filter Toggle Buttons */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-[#002f34] text-white shadow-sm'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Ads
              </button>
              
              <button
                onClick={() => setFilterMode('aiVerified')}
                className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  filterMode === 'aiVerified'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                <ShieldCheck size={15} />
                <span>AI Camera Verified</span>
              </button>

              <button
                onClick={() => setFilterMode('mobiles')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  filterMode === 'mobiles'
                    ? 'bg-[#002f34] text-white shadow-sm'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Mobiles
              </button>

              <button
                onClick={() => setFilterMode('electronics')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  filterMode === 'electronics'
                    ? 'bg-[#002f34] text-white shadow-sm'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Electronics
              </button>

              <button
                onClick={() => setFilterMode('bikes')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  filterMode === 'bikes'
                    ? 'bg-[#002f34] text-white shadow-sm'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Bikes
              </button>
            </div>
          </div>

          {/* Listings Grid */}
          {loading ? (
            <div className="py-20 text-center text-gray-400 flex flex-col items-center justify-center gap-3">
              <RefreshCw size={26} className="animate-spin text-teal-600" />
              <span className="text-sm font-bold text-gray-600">Loading verified marketplace items...</span>
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 space-y-4 max-w-lg mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto text-teal-700">
                <ShieldCheck size={36} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-[#002f34]">No Listings in this View</h3>
                <p className="text-xs text-gray-500">
                  Be the first to post a classified ad in this category with AI camera verification!
                </p>
              </div>
              <Link
                href="/post"
                className="inline-block bg-[#002f34] hover:bg-[#001e21] text-white text-xs font-black px-6 py-3 rounded-xl uppercase tracking-wider transition-colors shadow-md"
              >
                Post Ad Now
              </Link>
            </div>
          )}
        </section>

        {/* ─── Signature App Download Banner ───────────────────────── */}
        <section className="bg-gradient-to-r from-teal-900 to-[#002f34] text-white rounded-3xl p-8 md:p-10 shadow-xl overflow-hidden relative">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#ffce32] flex items-center justify-center text-[#002f34] shrink-0 shadow-lg">
                <Smartphone size={44} strokeWidth={2.2} />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs text-teal-300 font-bold uppercase tracking-wider">
                  <span>Fast, Safe &amp; Verified</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  TRY THE SELL MARKETPLACE APP
                </h3>
                <p className="text-xs sm:text-sm text-teal-100 max-w-lg">
                  Verify items right from your phone camera with live anti-spoof AI vision, chat in real-time, and close deals safely.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button className="flex items-center gap-2 bg-black/60 hover:bg-black text-white px-5 py-3 rounded-xl text-xs font-bold transition-colors border border-white/20 shadow-md">
                <span>Google Play</span>
              </button>
              <button className="flex items-center gap-2 bg-black/60 hover:bg-black text-white px-5 py-3 rounded-xl text-xs font-bold transition-colors border border-white/20 shadow-md">
                <span>App Store</span>
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
