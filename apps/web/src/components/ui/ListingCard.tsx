'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';

export interface ListingCardItem {
  id: string;
  slug?: string;
  title: string;
  price: number;
  location: string;
  timeAgo: string;
  image: string;
  featured?: boolean;
  specs?: string;
  isAIVerified?: boolean;
  aiConfidence?: number;
}

interface ListingCardProps {
  listing: ListingCardItem;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const destination = `/listing/${listing.slug || listing.id}`;

  return (
    <Link href={destination} className="group block h-full select-none">
      <div className="border border-gray-200 hover:border-gray-300 rounded-xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300 relative h-full flex flex-col justify-between group-hover:-translate-y-1">
        
        {/* Top: Image + Badges */}
        <div>
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
            <Image 
              src={listing.image} 
              alt={listing.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            
            {/* Top gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />

            {/* Badges container */}
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 items-start">
              {listing.isAIVerified && (
                <div className="bg-emerald-600/95 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-md tracking-wider uppercase flex items-center gap-1 border border-emerald-400/40">
                  <ShieldCheck size={12} className="text-emerald-200" />
                  <span>AI Verified</span>
                  {listing.aiConfidence ? (
                    <span className="text-emerald-200 text-[9px] font-mono font-bold">
                      {Math.round(listing.aiConfidence)}%
                    </span>
                  ) : null}
                </div>
              )}
              {listing.featured && !listing.isAIVerified && (
                <div className="bg-[#ffce32] text-[#002f34] text-[10px] font-black px-2.5 py-0.5 rounded-md shadow-sm tracking-wider uppercase">
                  Featured
                </div>
              )}
            </div>

            {/* Favorite Button */}
            <button 
              type="button"
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation();
                setIsFavorite(!isFavorite); 
              }}
              className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all active:scale-90 z-10"
              aria-label="Add to favorites"
            >
              <Heart 
                size={16} 
                className={isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-700 hover:text-red-500'} 
              />
            </button>
          </div>

          {/* Details */}
          <div className="p-4 pb-2">
            {/* Price */}
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-black text-xl text-[#002f34] tracking-tight group-hover:text-teal-800 transition-colors">
                {formatPrice(listing.price)}
              </h3>
            </div>

            {/* Optional Specs / Year / KM */}
            {listing.specs && (
              <p className="text-xs text-gray-500 font-medium mt-0.5 line-clamp-1">
                {listing.specs}
              </p>
            )}

            {/* Title */}
            <p className="text-gray-800 text-sm font-medium line-clamp-2 mt-1.5 leading-snug group-hover:text-[#002f34] transition-colors">
              {listing.title}
            </p>
          </div>
        </div>

        {/* Bottom Footer: Location and Date */}
        <div className="px-4 pb-3 pt-2.5 text-[11px] text-gray-400 flex items-center justify-between border-t border-gray-100 uppercase tracking-tight">
          <span className="truncate max-w-[65%] font-medium text-gray-500 flex items-center gap-1">
            <MapPin size={12} className="text-gray-400 shrink-0" />
            <span className="truncate">{listing.location}</span>
          </span>
          <span className="shrink-0 text-gray-400 font-medium">{listing.timeAgo}</span>
        </div>
      </div>
    </Link>
  );
}
