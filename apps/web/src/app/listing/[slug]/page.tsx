'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Share2, 
  ChevronRight, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  Heart, 
  CheckCircle,
  Tag,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Phone,
  ShieldAlert,
  Zap,
  Info
} from 'lucide-react';
import ImageGallery from '@/components/ui/ImageGallery';
import Avatar from '@/components/ui/Avatar';
import { formatPrice } from '@/lib/utils';

export default function ListingDetail({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Make Offer State
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [buyerName, setBuyerName] = useState('Ronak Reddy');
  const [buyerPhone, setBuyerPhone] = useState('+91 98765 12345');
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [offerSubmitting, setOfferSubmitting] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState(false);

  // Show Certificate Modal
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listings/${params.slug}`);
        const data = await res.json();
        if (data.success && data.listing) {
          setListing(data.listing);
          setOfferPrice(String(data.listing.price || ''));
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.slug]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerPrice) return;
    setOfferSubmitting(true);

    try {
      const res = await fetch(`/api/listings/${params.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerName,
          buyerPhone,
          offerPrice: Number(offerPrice),
          message: offerMessage || `Hi, I am interested in buying your item for ₹ ${offerPrice}.`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOfferSuccess(true);
        setTimeout(() => {
          setShowOfferModal(false);
          setOfferSuccess(false);
          router.push('/chat');
        }, 1500);
      }
    } catch (err) {
      alert('Could not submit offer.');
    } finally {
      setOfferSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f7f8f8] min-h-screen py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#002f34] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-[#002f34]">Loading listing details from marketplace database...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="bg-[#f7f8f8] min-h-screen py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-[#002f34]">Listing Not Found</h2>
        <p className="text-xs text-gray-500">The requested ad may have been sold or removed.</p>
        <Link href="/" className="inline-block bg-[#002f34] text-white text-xs font-bold px-6 py-3 rounded-xl uppercase">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const aiData = listing.aiDetectionData || {};
  const isVerified = listing.isAIVerified === 1;

  return (
    <div className="bg-[#f7f8f8] min-h-screen py-6 sm:py-8">
      <div className="container mx-auto px-4 max-w-7xl space-y-6">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#002f34] flex items-center gap-1 font-medium">
              <ArrowLeft size={14} className="sm:hidden" />
              <span>Home</span>
            </Link>
            <ChevronRight size={14} />
            <Link href={`/search?category=${listing.category}`} className="hover:text-[#002f34] font-medium capitalize">
              {listing.category}
            </Link>
            <ChevronRight size={14} />
            <span className="text-[#002f34] font-bold truncate max-w-[200px] sm:max-w-none">
              {listing.title}
            </span>
          </div>

          <div className="text-[11px] text-gray-400 hidden sm:block font-mono">
            ID: {listing.id}
          </div>
        </div>

        {/* ─── AI Camera Verified Ribbon Banner ─────────────────────── */}
        {isVerified && (
          <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 text-white rounded-2xl p-4 sm:p-5 px-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-500/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/40 shadow-inner">
                <ShieldCheck size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-black text-base tracking-wide uppercase">
                    AI Camera Verified Product
                  </h3>
                  <span className="bg-[#ffce32] text-[#002f34] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {listing.aiConfidence || 97}% Match &bull; Anti-Spoof Passed
                  </span>
                </div>
                <p className="text-xs text-teal-100 mt-0.5">
                  Real 3D physical possession proven live on camera. Phone-screen display photos were strictly rejected.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCertModal(true)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs font-bold px-4 py-2.5 rounded-xl transition-all whitespace-nowrap shrink-0 shadow-sm active:scale-95"
            >
              View Verification Certificate &rarr;
            </button>
          </div>
        )}

        {/* 2-Column Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ─── Left Column: Gallery & Details (2 Cols) ─────────── */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Gallery Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-5 shadow-sm">
              <ImageGallery images={listing.images} />
            </div>

            {/* Specifications Card */}
            {listing.specs && Object.keys(listing.specs).length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-sm space-y-4">
                <h2 className="text-lg font-black text-[#002f34] border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Tag size={18} className="text-teal-700" />
                  <span>Overview &amp; Specifications</span>
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
                  {Object.entries(listing.specs).map(([key, value]: [string, any]) => (
                    <div key={key} className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">{key}</p>
                      <p className="text-[#002f34] font-black text-sm mt-0.5">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-[#002f34] border-b border-gray-100 pb-3">
                Description
              </h2>
              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed font-normal">
                {listing.description}
              </div>
            </div>

          </div>

          {/* ─── Right Column: Price & Seller Card (1 Col) ──────── */}
          <div className="space-y-6">
            
            {/* Price & Title Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-[#002f34] tracking-tight">
                    {formatPrice(listing.price)}
                  </h1>
                  {listing.negotiable === 1 && (
                    <span className="inline-flex items-center gap-1 text-xs text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-md mt-1 border border-teal-200">
                      <Tag size={12} /> Price Negotiable
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleShare}
                    className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 text-[#002f34] transition-colors relative"
                    title="Share listing"
                  >
                    <Share2 size={18} />
                    {copied && (
                      <span className="absolute -bottom-8 right-0 bg-[#002f34] text-white text-[10px] px-2 py-1 rounded shadow whitespace-nowrap">
                        Copied!
                      </span>
                    )}
                  </button>

                  <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 text-[#002f34] transition-colors"
                    title="Save to favorites"
                  >
                    <Heart 
                      size={18} 
                      className={isFavorite ? 'fill-red-500 text-red-500' : 'text-[#002f34]'} 
                    />
                  </button>
                </div>
              </div>

              <h2 className="text-base font-semibold text-gray-900 leading-snug">
                {listing.title}
              </h2>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1 truncate max-w-[65%] font-medium">
                  <MapPin size={14} className="text-gray-400 shrink-0" />
                  <span className="truncate">{listing.location}</span>
                </span>
                <span className="flex items-center gap-1 shrink-0">
                  <Clock size={13} className="text-gray-400" />
                  <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                </span>
              </div>
            </div>

            {/* Seller Information Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
              <h3 className="font-black text-xs text-[#002f34] uppercase tracking-wider">
                Seller Information
              </h3>

              <div className="flex items-center gap-4">
                <Avatar src={listing.sellerAvatar} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-base text-[#002f34] truncate">
                      {listing.sellerName || 'Verified Seller'}
                    </h4>
                    <span title="Verified" className="inline-flex items-center">
                      <CheckCircle size={16} className="text-teal-600 shrink-0" />
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 font-medium">
                    <Phone size={12} className="text-gray-400" />
                    <span>{listing.sellerPhone}</span>
                  </p>
                  <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                    ✓ Verified Account Holder
                  </p>
                </div>
              </div>

              {/* Action Buttons: Chat & Make Offer */}
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={() => router.push('/chat')}
                  className="w-full bg-[#002f34] hover:bg-[#001e21] text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 tracking-wide uppercase active:scale-95 cursor-pointer"
                >
                  <MessageSquare size={18} />
                  <span>Chat with Seller</span>
                </button>

                <button
                  onClick={() => setShowOfferModal(true)}
                  className="w-full border-2 border-[#002f34] hover:bg-teal-50 text-[#002f34] font-black text-sm py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <span>Buy Now / Make an Offer</span>
                </button>
              </div>
            </div>

            {/* Location Box */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-2">
              <h3 className="font-black text-xs text-[#002f34] uppercase tracking-wider">
                Posted In
              </h3>
              <p className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <MapPin size={16} className="text-teal-700 shrink-0" />
                <span>{listing.location}</span>
              </p>
            </div>

            {/* Safety Tips */}
            <div className="bg-amber-50/80 rounded-2xl border border-amber-300 p-5 shadow-sm space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-black uppercase tracking-wide">
                <ShieldAlert size={16} className="text-amber-700" />
                <span>Buyer Safety Rules</span>
              </div>
              <ul className="text-amber-950 space-y-1.5 list-disc list-inside font-medium leading-relaxed">
                <li>Meet locally in a public cafe, store, or safe meetup zone</li>
                <li>Inspect item condition in person before releasing payment</li>
                <li>Never send advance deposits via QR code or payment links</li>
              </ul>
            </div>

          </div>

        </div>

      </div>

      {/* ─── Make Offer Modal ─────────────────────────────────────── */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            
            {offerSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-black text-[#002f34]">Offer Submitted!</h3>
                <p className="text-xs text-gray-600">
                  Your purchase offer was saved in the database. Opening chat conversation with seller...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendOffer} className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-lg font-black text-[#002f34]">Make a Purchase Offer</h3>
                  <button
                    type="button"
                    onClick={() => setShowOfferModal(false)}
                    className="text-gray-400 hover:text-gray-700 text-lg font-bold"
                  >
                    &times;
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Listed Price: <span className="font-bold text-[#002f34]">{formatPrice(listing.price)}</span>
                </p>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#002f34] outline-none focus:border-[#002f34]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Your Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#002f34] outline-none focus:border-[#002f34]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Your Offer Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-xl px-3 py-2.5 text-base font-black text-[#002f34] outline-none focus:border-[#002f34]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Message to Seller (Optional)</label>
                  <textarea
                    rows={2}
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    placeholder="e.g. Can pick up this evening if agreed."
                    className="w-full border-2 border-gray-300 rounded-xl p-2.5 text-xs text-[#002f34] outline-none focus:border-[#002f34]"
                  />
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={offerSubmitting}
                    className="flex-1 bg-[#002f34] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wide hover:bg-[#001e21] disabled:opacity-50 shadow-md cursor-pointer"
                  >
                    {offerSubmitting ? 'Sending Offer...' : 'Send Offer & Chat'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOfferModal(false)}
                    className="px-4 py-3.5 border border-gray-300 rounded-xl font-semibold text-xs text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ─── AI Verification Certificate Modal ────────────────────── */}
      {showCertModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#002f34]">AI Verification Certificate</h3>
                  <p className="text-[11px] text-gray-400">Cryptographic Proof of Physical Possession</p>
                </div>
              </div>
              <button
                onClick={() => setShowCertModal(false)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="bg-emerald-50/90 p-4 rounded-2xl border border-emerald-300 space-y-1">
                <p className="font-mono font-bold text-emerald-950">
                  Audit ID: {aiData.auditId || `SELL-AI-${listing.id.toUpperCase()}`}
                </p>
                <p className="text-emerald-800 text-[11px]">
                  Timestamp: {aiData.timestamp || listing.createdAt}
                </p>
                <p className="font-black text-emerald-800 text-sm pt-1">
                  Confidence Score: {listing.aiConfidence || 97}% Match
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-700 mb-1">Visual Classification:</p>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs font-medium">
                  {aiData.detectedObject || `Physical Goods (${listing.title})`}
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-700 mb-1.5">Inspection Checks Passed:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200 text-emerald-950">
                    <CheckCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Anti-Screen &amp; Anti-Phone Spoof Check:</strong> Confirmed real 3D physical object. Photos displayed on phone screens or monitors strictly rejected.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200 text-emerald-950">
                    <CheckCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Product Mentioned vs. Shown:</strong> Confirmed object presented matches declared listing (&ldquo;{listing.title}&rdquo;).</span>
                  </li>
                  <li className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200 text-emerald-950">
                    <CheckCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Live Camera Physical Possession:</strong> Verified in real-time camera view in seller hands.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-emerald-50/60 p-3.5 rounded-xl text-[11px] text-emerald-950 border border-emerald-200 leading-relaxed">
                🛡️ <strong>Zero-Screen Guarantee:</strong> This item passed Sell&apos;s proprietary vision anti-spoof model. 
                Sellers cannot verify an ad by presenting a digital photo on a phone screen; the actual physical item must be shown.
              </div>
            </div>

            <button
              onClick={() => setShowCertModal(false)}
              className="w-full bg-[#002f34] hover:bg-[#001e21] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              Close Certificate
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
