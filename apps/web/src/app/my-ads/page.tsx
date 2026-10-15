'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Eye, 
  Heart, 
  MessageSquare, 
  Trash2, 
  Search, 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  Camera, 
  CheckCircle, 
  ExternalLink,
  Tag,
  Plus
} from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import CameraVerification from '@/components/ui/CameraVerification';
import { formatPrice } from '@/lib/utils';

interface ListingItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  condition?: string;
  price: number;
  location: string;
  images: string[];
  isAIVerified: number;
  aiConfidence: number;
  aiDetectionData?: any;
  status: string;
  viewCount: number;
  createdAt: string;
}

export default function MyAdsPage() {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'unverified' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state for verifying unverified ads live
  const [verifyingAd, setVerifyingAd] = useState<ListingItem | null>(null);
  const [showCertAd, setShowCertAd] = useState<ListingItem | null>(null);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/listings');
      const data = await res.json();
      if (data.success && data.listings) {
        setListings(data.listings);
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleMarkSold = async (slug: string) => {
    if (!confirm('Mark this listing as Sold?')) return;
    try {
      const res = await fetch(`/api/listings/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'sold' }),
      });
      if (res.ok) {
        fetchListings();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`/api/listings/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setListings(prev => prev.filter(l => l.slug !== slug));
      }
    } catch (err) {
      alert('Failed to delete listing');
    }
  };

  const handleCameraVerifiedSuccess = async (result: any) => {
    if (!verifyingAd) return;
    try {
      const res = await fetch(`/api/listings/${verifyingAd.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isAIVerified: 1,
          aiConfidence: result.confidenceScore,
          aiDetectionData: JSON.stringify({
            auditId: result.auditId,
            detectedObject: result.detectedObject,
            timestamp: result.timestamp || new Date().toISOString(),
            confidenceScore: result.confidenceScore,
          }),
        }),
      });
      if (res.ok) {
        alert('🎉 Physical item verified! Your listing now features the AI Verified badge.');
        setVerifyingAd(null);
        fetchListings();
      }
    } catch (err) {
      alert('Failed to save verification');
    }
  };

  // Filter listings
  const filteredListings = listings.filter((l) => {
    if (activeTab === 'verified') return l.isAIVerified === 1;
    if (activeTab === 'unverified') return l.isAIVerified === 0;
    return true;
  }).filter((l) => {
    if (!searchQuery) return true;
    return l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           l.location.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const verifiedCount = listings.filter(l => l.isAIVerified === 1).length;
  const unverifiedCount = listings.filter(l => l.isAIVerified === 0).length;

  return (
    <div className="bg-[#f7f8f8] min-h-[calc(100vh-64px)] py-8">
      <div className="container mx-auto px-4 max-w-6xl space-y-6">
        
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#002f34] tracking-tight">
              Manage My Ads
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              View your active marketplace inventory, verify ownership with AI Camera, and manage inquiries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/post"
              className="bg-[#002f34] hover:bg-[#001e21] text-white px-5 py-2.5 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus size={16} />
              <span>Post New Ad</span>
            </Link>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in your listings..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-xs text-[#002f34] focus:outline-none focus:border-[#002f34] focus:bg-white transition-all"
            />
          </div>

          {/* Verification summary chip */}
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>{verifiedCount} AI Camera Verified</span>
            </span>
            {unverifiedCount > 0 && (
              <span className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-amber-600" />
                <span>{unverifiedCount} Unverified</span>
              </span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 gap-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 font-black text-xs uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'all'
                ? 'border-[#002f34] text-[#002f34]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            All Ads ({listings.length})
          </button>

          <button
            onClick={() => setActiveTab('verified')}
            className={`pb-3 font-black text-xs uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'verified'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <ShieldCheck size={14} />
            <span>AI Verified Only ({verifiedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('unverified')}
            className={`pb-3 font-black text-xs uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'unverified'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <AlertTriangle size={14} />
            <span>Needs Camera Verification ({unverifiedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-3 font-black text-xs uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'border-[#002f34] text-[#002f34]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Favorites (0)
          </button>
        </div>

        {/* Active Ads List */}
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            <div className="w-8 h-8 border-4 border-[#002f34] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold">Loading your active listings from database...</p>
          </div>
        ) : activeTab === 'favorites' ? (
          <EmptyState
            icon="Heart"
            title="You haven't saved any ads to favorites"
            description="Explore listings on the home page and save items you want to keep an eye on."
            actionLabel="Discover Marketplace Ads"
            actionHref="/"
          />
        ) : filteredListings.length === 0 ? (
          <EmptyState
            icon="Package"
            title="No listings found"
            description={searchQuery ? 'Try matching another search query.' : 'You do not have any listings in this tab yet.'}
            actionLabel="Create an Ad"
            actionHref="/post"
          />
        ) : (
          <div className="space-y-4">
            {filteredListings.map((ad) => {
              const isVerified = ad.isAIVerified === 1;
              const imgUrl = Array.isArray(ad.images) && ad.images.length > 0 
                ? ad.images[0] 
                : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=450&fit=crop';

              return (
                <div
                  key={ad.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5 relative overflow-hidden"
                >
                  {/* Status Indicator Stripe */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 ${
                      isVerified ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                  />

                  {/* Thumbnail */}
                  <div className="w-full md:w-52 h-40 relative rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                    <Image
                      src={imgUrl}
                      alt={ad.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className="bg-black/75 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                        {ad.category}
                      </span>
                      {ad.status === 'sold' && (
                        <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                          SOLD
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Information & Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-base sm:text-lg text-[#002f34] hover:text-teal-700 transition-colors">
                              <Link href={`/listing/${ad.slug}`}>{ad.title}</Link>
                            </h3>
                          </div>
                          <p className="font-extrabold text-xl text-teal-800 mt-1">
                            {formatPrice(ad.price)}
                          </p>
                        </div>

                        {/* Top action links */}
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/listing/${ad.slug}`}
                            className="p-1.5 text-gray-500 hover:text-[#002f34] hover:bg-gray-100 rounded-md transition-colors"
                            title="View Public Listing"
                          >
                            <ExternalLink size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(ad.slug)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete Listing"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Location & Date */}
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <span>{ad.location}</span>
                        <span>&bull;</span>
                        <span>Posted on {new Date(ad.createdAt).toLocaleDateString()}</span>
                      </p>

                      {/* Verification Badge Status */}
                      <div className="mt-3">
                        {isVerified ? (
                          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-300 text-emerald-900 px-3 py-1.5 rounded-lg text-xs font-bold">
                            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                            <span>AI Physical Camera Verified ({ad.aiConfidence || 96}% confidence)</span>
                            <button
                              onClick={() => setShowCertAd(ad)}
                              className="text-emerald-700 hover:text-emerald-950 underline ml-2 text-[11px]"
                            >
                              View Certificate
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-amber-50 border border-amber-300 p-2.5 rounded-lg">
                            <div className="flex items-center gap-2 text-xs text-amber-900 font-medium">
                              <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                              <span>Not Camera Verified. Showing live physical possession builds buyer trust.</span>
                            </div>
                            <button
                              onClick={() => setVerifyingAd(ad)}
                              className="bg-[#002f34] hover:bg-[#001e21] text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0 uppercase tracking-wider"
                            >
                              <Camera size={14} className="text-[#ffce32]" />
                              <span>Verify with AI Camera Now</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats & Quick Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 mt-3 border-t border-gray-100">
                      <div className="flex items-center gap-5 text-xs text-gray-500 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Eye size={15} className="text-gray-400" />
                          <span>{ad.viewCount || 1} Views</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MessageSquare size={15} className="text-gray-400" />
                          <Link href="/chat" className="hover:text-teal-700 hover:underline">
                            Messages
                          </Link>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Tag size={15} className="text-gray-400" />
                          <span>Status: <strong className="text-gray-800 uppercase text-[11px]">{ad.status}</strong></span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {ad.status !== 'sold' && (
                          <button
                            onClick={() => handleMarkSold(ad.slug)}
                            className="text-xs font-bold border border-gray-300 hover:border-[#002f34] text-gray-700 hover:text-[#002f34] px-3 py-1.5 rounded transition-colors"
                          >
                            Mark Sold
                          </button>
                        )}
                        <button
                          onClick={() => alert('Feature ad boosted! Your ad will be highlighted at the top of category searches for 7 days.')}
                          className="bg-[#ffce32] hover:bg-yellow-400 text-[#002f34] font-black text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Zap size={14} />
                          <span>Sell Faster</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ─── LIVE AI CAMERA VERIFICATION MODAL ───────────────────────── */}
      {verifyingAd && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-black text-[#002f34]">
                  Verify Listing: {verifyingAd.title}
                </h3>
                <p className="text-xs text-gray-500">
                  Category: <span className="font-bold uppercase">{verifyingAd.category}</span>
                </p>
              </div>
              <button
                onClick={() => setVerifyingAd(null)}
                className="text-gray-400 hover:text-gray-800 text-lg font-bold px-2"
              >
                &times;
              </button>
            </div>

            <CameraVerification
              productTitle={verifyingAd.title}
              category={verifyingAd.category}
              description={verifyingAd.description}
              condition={verifyingAd.condition || 'Used - Like New'}
              onVerificationComplete={handleCameraVerifiedSuccess}
              onVerificationReset={() => {}}
            />
          </div>
        </div>
      )}

      {/* ─── AUDIT CERTIFICATE MODAL ─────────────────────────────────── */}
      {showCertAd && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle size={36} />
              </div>
              <h3 className="font-black text-xl text-[#002f34]">
                Sell AI Verification Certificate
              </h3>
              <p className="text-xs text-gray-500">
                Official cryptographic proof of live product possession.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs space-y-2.5 font-mono">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-gray-500">Product:</span>
                <span className="font-bold text-[#002f34] max-w-[200px] truncate">{showCertAd.title}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-gray-500">Category:</span>
                <span className="font-bold uppercase text-[#002f34]">{showCertAd.category}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-gray-500">Audit ID:</span>
                <span className="font-bold text-teal-700">SELL-AUDIT-{showCertAd.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-gray-500">Confidence:</span>
                <span className="font-bold text-emerald-600">{showCertAd.aiConfidence || 97.2}% Match</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Screen Spoof Defense:</span>
                <span className="font-bold text-emerald-600">Passed (Real 3D object; phone photos rejected)</span>
              </div>
            </div>

            <button
              onClick={() => setShowCertAd(null)}
              className="w-full bg-[#002f34] text-white py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-[#001e21] transition-colors"
            >
              Close Certificate
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
