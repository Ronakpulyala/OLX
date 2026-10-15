'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES, CONDITIONS } from '@/lib/constants';
import CameraVerification, { VerificationResult } from '@/components/ui/CameraVerification';
import { 
  Camera, 
  MapPin, 
  ArrowLeft, 
  CheckCircle, 
  Trash2, 
  Sparkles, 
  ShieldCheck,
  CheckCheck,
  Car, 
  Smartphone, 
  Tv, 
  Armchair, 
  Shirt, 
  BookOpen, 
  Dumbbell, 
  Bike, 
  Dog, 
  Wrench, 
  Briefcase, 
  Home,
  Check,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, any> = {
  cars: Car,
  mobiles: Smartphone,
  electronics: Tv,
  furniture: Armchair,
  fashion: Shirt,
  books: BookOpen,
  sports: Dumbbell,
  bikes: Bike,
  pets: Dog,
  services: Wrench,
  jobs: Briefcase,
  'real-estate': Home,
};

export default function PostAdPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('mobiles');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('used-like-new');
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(true);
  const [location, setLocation] = useState('Indiranagar, Bangalore, Karnataka');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=450&fit=crop'
  ]);

  // AI Verification State
  const [aiVerified, setAiVerified] = useState(false);
  const [aiConfidence, setAiConfidence] = useState<number>(0);
  const [aiDetectionData, setAiDetectionData] = useState<any>(null);

  const [submitting, setSubmitting] = useState(false);
  const [createdListingSlug, setCreatedListingSlug] = useState<string>('');

  const handleAddSampleImage = () => {
    if (images.length < 8) {
      const samples = [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=450&fit=crop',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&h=450&fit=crop',
        'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=450&fit=crop',
      ];
      const nextImg = samples[images.length % samples.length]!;
      setImages(prev => [...prev, nextImg]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleVerificationDone = (verResult: VerificationResult) => {
    if (verResult.verified) {
      setAiVerified(true);
      setAiConfidence(verResult.confidenceScore);
      setAiDetectionData(verResult);
      if (verResult.snapshotUrl && !images.includes(verResult.snapshotUrl)) {
        setImages(prev => [verResult.snapshotUrl!, ...prev]);
      }
    } else {
      setAiVerified(false);
      setAiConfidence(0);
      setAiDetectionData(null);
    }
  };

  const handleVerificationReset = () => {
    setAiVerified(false);
    setAiConfidence(0);
    setAiDetectionData(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category: selectedCategory,
          condition,
          price: Number(price),
          negotiable,
          location,
          images,
          isAIVerified: aiVerified,
          aiConfidence,
          aiDetectionData,
          sellerName: 'Aditya Narayanan',
          sellerPhone: '+91 98765 43210',
        }),
      });

      const data = await res.json();
      if (data.success && data.listing) {
        setCreatedListingSlug(data.listing.slug);
        setStep(5); // Final Success screen
      } else {
        alert(data.error || 'Failed to publish listing');
      }
    } catch (err) {
      console.error('Post ad error:', err);
      alert('Network error while saving listing.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Category' },
    { num: 2, label: 'Ad Details' },
    { num: 3, label: 'Photos' },
    { num: 4, label: 'AI Verification' },
  ];

  return (
    <div className="bg-[#f7f8f8] min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">

        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-1 shadow-2xs">
            <Sparkles size={14} className="text-teal-600" />
            <span>AI Verified Marketplace Listing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#002f34] tracking-tight uppercase">
            Post Your Classified Ad
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
            Live AI Camera verification proves physical possession, eliminating scammers and boosting buyer confidence.
          </p>
        </div>

        {/* ─── Modern Stepper Header ─────────────────────────────── */}
        {step < 5 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {stepsList.map((s, idx) => {
                const isActive = step === s.num;
                const isCompleted = step > s.num;

                return (
                  <div key={s.num} className="flex items-center flex-1 last:flex-initial">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                        isCompleted 
                          ? 'bg-emerald-600 text-white' 
                          : isActive 
                            ? 'bg-[#002f34] text-white ring-4 ring-teal-100' 
                            : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? <Check size={14} strokeWidth={3} /> : s.num}
                      </div>
                      <span className={`text-xs font-bold hidden sm:inline ${
                        isActive ? 'text-[#002f34]' : isCompleted ? 'text-emerald-700' : 'text-gray-400'
                      }`}>
                        {s.label}
                      </span>
                    </div>

                    {idx < stepsList.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-colors ${
                        step > s.num ? 'bg-emerald-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Step 1: Category Picker ───────────────────────────── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between">
              <div>
                <h2 className="font-black text-sm uppercase tracking-wider text-[#002f34]">
                  Step 1: Choose a Category
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Select the category that matches your product</p>
              </div>
              <span className="text-xs font-bold text-gray-400 bg-white px-2.5 py-1 rounded-md border border-gray-200">
                1 of 4
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 divide-x divide-y divide-gray-100">
              {CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.id] || Smartphone;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setStep(2);
                    }}
                    className="p-6 flex flex-col items-center justify-center gap-3 text-center hover:bg-teal-50/60 transition-all group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 group-hover:bg-[#002f34] flex items-center justify-center text-[#002f34] group-hover:text-white transition-all shadow-2xs group-hover:scale-110">
                      <Icon size={26} strokeWidth={2} />
                    </div>
                    <span className="font-bold text-sm text-[#002f34] group-hover:text-teal-900">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Step 2: Details & Pricing ─────────────────────────── */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="p-1.5 hover:bg-gray-200 rounded-lg text-[#002f34] transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h2 className="font-black text-sm uppercase tracking-wider text-[#002f34]">
                    Step 2: Enter Product Details
                  </h2>
                  <p className="text-xs text-teal-800 font-semibold mt-0.5">
                    Category: <span className="uppercase">{selectedCategory}</span>
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-400 bg-white px-2.5 py-1 rounded-md border border-gray-200">
                2 of 4
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Ad Title *
                </label>
                <input
                  type="text"
                  required
                  maxLength={70}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Apple iPhone 13 Pro Max - 256GB Sierra Blue, Pristine"
                  className="w-full text-sm font-semibold border-2 border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#002f34] transition-colors"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>Include brand, model, variant, and color</span>
                  <span className={title.length >= 65 ? 'text-amber-600 font-bold' : ''}>{title.length}/70</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail condition, included accessories, reason for selling, warranty, bill & box status..."
                  className="w-full text-sm font-normal border-2 border-gray-300 rounded-xl p-4 outline-none focus:border-[#002f34] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Item Condition *
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {CONDITIONS.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setCondition(c.id)}
                      className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                        condition === c.id
                          ? 'bg-[#002f34] text-white border-[#002f34] shadow-sm'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-gray-100 pt-6">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Set Price (₹) *
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="relative max-w-xs">
                    <span className="absolute left-4 top-3 text-base font-black text-gray-400">₹</span>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 64999"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full text-lg font-black pl-9 pr-4 py-2.5 border-2 border-gray-300 rounded-xl outline-none focus:border-[#002f34] text-[#002f34]"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={negotiable}
                      onChange={(e) => setNegotiable(e.target.checked)}
                      className="rounded text-[#002f34] focus:ring-[#002f34] w-4 h-4"
                    />
                    <span>Price Negotiable</span>
                  </label>
                </div>
              </div>

              {/* Location */}
              <div className="border-t border-gray-100 pt-6">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Confirm Location *
                </label>
                <div className="flex items-center gap-3 border-2 border-gray-300 rounded-xl px-4 py-3 max-w-lg">
                  <MapPin size={18} className="text-teal-700 shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs font-semibold text-[#002f34] outline-none"
                    placeholder="Locality, City, State"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!title || !description || !price}
                  onClick={() => setStep(3)}
                  className="bg-[#002f34] hover:bg-[#001e21] text-white font-black text-sm px-8 py-3.5 rounded-xl shadow-md transition-all disabled:opacity-40 uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Photos</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 3: Photos Upload ─────────────────────────────── */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="p-1.5 hover:bg-gray-200 rounded-lg text-[#002f34] transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h2 className="font-black text-sm uppercase tracking-wider text-[#002f34]">
                    Step 3: Upload Product Photos
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">High-quality photos get up to 5x more buyer views</p>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-400 bg-white px-2.5 py-1 rounded-md border border-gray-200">
                3 of 4
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#002f34]">Upload Up to 8 Photos</h3>
                  <p className="text-xs text-gray-500">First photo will be your main ad cover</p>
                </div>
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                  {images.length}/8 uploaded
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 group shadow-2xs">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-2 left-2 bg-[#002f34] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                        Cover Photo
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-white/95 hover:bg-white text-red-600 rounded-full shadow-md transition-transform active:scale-90"
                      title="Delete photo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {images.length < 8 && (
                  <button
                    type="button"
                    onClick={handleAddSampleImage}
                    className="aspect-square border-2 border-dashed border-teal-600/40 hover:border-teal-700 rounded-xl bg-teal-50/30 hover:bg-teal-50 flex flex-col items-center justify-center gap-2 text-teal-900 transition-colors cursor-pointer"
                  >
                    <Camera size={28} strokeWidth={1.8} className="text-teal-700" />
                    <span className="text-xs font-bold">+ Add Photo</span>
                    <span className="text-[10px] text-gray-400">Click to upload</span>
                  </button>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-gray-600 hover:underline"
                >
                  &larr; Back to Details
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="bg-[#002f34] hover:bg-[#001e21] text-white font-black text-sm px-8 py-3.5 rounded-xl shadow-md transition-all uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={16} className="text-[#ffce32]" />
                  <span>Next: AI Camera Verification &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 4: AI Live Camera Verification Layer ─────────── */}
        {step === 4 && (
          <div className="space-y-6">
            
            {/* Explanatory Rule Callout */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-xs text-amber-950 shadow-2xs">
              <AlertCircle size={20} className="text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm text-amber-900">
                  AI Camera Verification Rules:
                </p>
                <p className="leading-relaxed">
                  (1) <strong>Product Matching:</strong> The camera must detect the exact item declared in your ad: &ldquo;<span className="font-bold">{title}</span>&rdquo;.
                  <br />
                  (2) <strong>Anti-Spoof Defense:</strong> You <strong>CANNOT</strong> show a photo on another smartphone, tablet, or monitor. Only real physical products pass.
                </p>
              </div>
            </div>

            <CameraVerification
              productTitle={title}
              category={selectedCategory}
              description={description}
              condition={condition}
              onVerificationComplete={handleVerificationDone}
              onVerificationReset={handleVerificationReset}
            />

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-xs font-bold text-gray-600 hover:underline"
              >
                &larr; Back to Photos
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleSubmit()}
                  className="flex-1 sm:flex-initial bg-[#002f34] hover:bg-[#001e21] text-white font-black text-sm px-10 py-4 rounded-xl shadow-lg transition-all uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {aiVerified && <ShieldCheck size={20} className="text-[#ffce32]" />}
                  <span>
                    {submitting 
                      ? 'Publishing Ad...' 
                      : aiVerified 
                        ? 'Publish with AI Verified Badge ✅' 
                        : 'Publish Ad Now'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 5: Final Success Screen ──────────────────────── */}
        {step === 5 && (
          <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 text-center shadow-lg space-y-6 max-w-lg mx-auto">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCheck size={44} strokeWidth={2.5} />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-black text-[#002f34]">Your Ad is Live!</h2>
              <p className="text-xs sm:text-sm text-gray-600">
                It is now published to the marketplace and visible to buyers across India.
              </p>
            </div>

            {aiVerified && (
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-900 border border-emerald-300 px-5 py-2.5 rounded-full text-xs font-bold shadow-2xs">
                <ShieldCheck size={18} className="text-emerald-600" />
                <span>AI Physical Possession Verified ({aiConfidence}% Match)</span>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-xl text-left text-xs border border-gray-200 space-y-1.5">
              <p className="font-bold text-[#002f34] text-sm truncate">{title}</p>
              <p className="font-black text-teal-800 text-base">₹ {price}</p>
              <p className="text-gray-400 text-[11px] flex items-center gap-1">
                <MapPin size={12} />
                <span>{location}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`/listing/${createdListingSlug}`}
                className="flex-1 bg-[#002f34] hover:bg-[#001e21] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md text-center"
              >
                View Your Live Ad
              </Link>
              <Link
                href="/"
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-[#002f34] py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-center"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
