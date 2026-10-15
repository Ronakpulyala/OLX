'use client';

import { useState, useEffect } from 'react';
import Avatar from '@/components/ui/Avatar';
import ListingCard, { ListingCardItem } from '@/components/ui/ListingCard';
import { 
  UserCheck, 
  Calendar, 
  ShieldCheck, 
  Share2, 
  Star, 
  MapPin, 
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Phone
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'ads' | 'reviews'>('ads');
  const [userListings, setUserListings] = useState<ListingCardItem[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch('/api/listings');
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
          setUserListings(formatted);
        }
      } catch (e) {}
    }
    fetchListings();
  }, []);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-[#f7f8f8] min-h-[calc(100vh-80px)] py-8">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        
        {/* Top Profile Card with Gradient Header */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="h-36 sm:h-44 bg-gradient-to-r from-[#002f34] via-teal-800 to-[#001e21] relative">
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold border border-white/20 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[#ffce32]" />
              <span>AI Verified Seller</span>
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-8 flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-end -mt-16 sm:-mt-14">
              <div className="p-1.5 bg-white rounded-full shadow-lg relative shrink-0">
                <Avatar 
                  size="xl" 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
                  className="border-4 border-white" 
                />
                <span className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-xs" title="Online" />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#002f34]">Aditya Narayanan</h1>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400" /> Member since Oct 2021
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-gray-400" /> Bangalore, Karnataka
                  </span>
                </div>
                
                <div className="flex items-center gap-2 pt-0.5">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={15} className="fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-black text-sm text-[#002f34]">4.9</span>
                  <span className="text-xs text-gray-400 font-medium">(28 community reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="mt-2 flex items-center gap-2.5 w-full md:w-auto">
              <Link 
                href="/chat"
                className="flex-1 md:flex-initial bg-[#002f34] hover:bg-[#001e21] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <MessageSquare size={16} />
                <span>Chat</span>
              </Link>
              <button 
                onClick={handleShare}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer relative"
              >
                <Share2 size={16} />
                <span>{copied ? 'Copied Link!' : 'Share Profile'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Listings Tab Area (3 Cols) */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-sm flex gap-2">
              <button 
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'ads' 
                    ? 'bg-[#002f34] text-white shadow-xs' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('ads')}
              >
                Active Listings ({userListings.length})
              </button>
              <button 
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'reviews' 
                    ? 'bg-[#002f34] text-white shadow-xs' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Buyer Reviews (28)
              </button>
            </div>

            {activeTab === 'ads' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userListings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4 divide-y divide-gray-100">
                {[
                  { name: 'Kavitha R.', time: '2 days ago', text: 'Bought the iPhone 13 Pro Max. Product was exactly as demonstrated on the camera scan. Smooth in-person handoff!', rating: 5 },
                  { name: 'Sameer Khan', time: '1 week ago', text: 'Prompt communication, polite seller, clear bill and packaging included.', rating: 5 },
                  { name: 'Ananya S.', time: '2 weeks ago', text: 'Very trustworthy seller. AI camera verified badges really help filter genuine items.', rating: 5 },
                ].map((rev, i) => (
                  <div key={i} className={`space-y-1.5 ${i > 0 ? 'pt-4' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#002f34]">{rev.name}</span>
                      <span className="text-[10px] text-gray-400">{rev.time}</span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, s) => (
                        <Star key={s} size={12} className="fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed font-normal">
                      &ldquo;{rev.text}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Right Verification Card (1 Col) */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-black text-xs uppercase tracking-wider text-[#002f34] flex items-center gap-1.5 pb-2 border-b border-gray-100">
                <ShieldCheck size={18} className="text-emerald-600" />
                <span>Verified Trust Credentials</span>
              </h3>

              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-[#002f34]">AI Camera Possession</p>
                    <p className="text-[11px] text-gray-500">Live 3D verification passed</p>
                  </div>
                </li>

                <li className="flex items-start gap-2.5 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-[#002f34]">Mobile Phone OTP</p>
                    <p className="text-[11px] text-gray-500">+91 98765 ***** verified</p>
                  </div>
                </li>

                <li className="flex items-start gap-2.5 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-[#002f34]">Email Address</p>
                    <p className="text-[11px] text-gray-500">Verified identity account</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-teal-50/80 p-5 rounded-2xl border border-teal-200 text-xs text-teal-950 space-y-2">
              <div className="flex items-center gap-2 font-black text-teal-900">
                <Sparkles size={16} className="text-teal-600" />
                <span>Verified Badge Holder</span>
              </div>
              <p className="text-[11px] leading-relaxed text-teal-900 font-medium">
                Sellers with verified badges close sales 3x faster and are favored by serious buyers for safety.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
