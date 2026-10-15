'use client';

import Link from 'next/link';
import { ChevronDown, Plus, Heart, MessageSquare, User, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import SearchBar from './SearchBar';
import LocationSelector from './LocationSelector';
import { CATEGORIES } from '@/lib/constants';

const POPULAR_QUICK_LINKS = [
  { name: 'Cars', href: '/search?category=cars' },
  { name: 'Motorcycles', href: '/search?category=bikes' },
  { name: 'Mobile Phones', href: '/search?category=mobiles' },
  { name: 'Houses & Apartments', href: '/search?category=real-estate' },
  { name: 'Electronics', href: '/search?category=electronics' },
  { name: 'Commercial Vehicles', href: '/search?category=cars' },
  { name: 'Furniture', href: '/search?category=furniture' },
];

export default function Header() {
  const [isAllCategoriesOpen, setIsAllCategoriesOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setIsAllCategoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      {/* ─── Top Main Navigation Bar ─────────────────────────────── */}
      <div className="bg-[#f7f8f8] py-2 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between gap-3 md:gap-4">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-1 group shrink-0">
            <span className="text-[#002f34] text-3xl font-black tracking-tighter group-hover:text-teal-700 transition-colors">
              SELL
            </span>
            <span className="w-2 h-2 rounded-full bg-[#ffce32] group-hover:scale-125 transition-transform" />
          </Link>

          {/* Location Selector */}
          <div className="hidden md:block shrink-0">
            <LocationSelector />
          </div>

          {/* Search Bar */}
          <div className="flex-1 min-w-0 max-w-3xl">
            <SearchBar />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Language Toggle */}
            <div className="hidden lg:flex items-center gap-1 cursor-pointer font-bold text-xs text-[#002f34] uppercase hover:text-teal-700 transition-colors">
              <span>ENGLISH</span>
              <ChevronDown size={14} />
            </div>

            {/* Chat Icon */}
            <Link 
              href="/chat" 
              className="relative p-2 text-[#002f34] hover:bg-gray-100 rounded-full transition-colors"
              title="Chat"
            >
              <MessageSquare size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-teal-600 rounded-full" />
            </Link>

            {/* Wishlist / Favorites */}
            <Link 
              href="/favorites" 
              className="p-2 text-[#002f34] hover:bg-gray-100 rounded-full transition-colors hidden sm:inline-flex"
              title="Saved Items"
            >
              <Heart size={20} />
            </Link>

            {/* My Ads */}
            <Link
              href="/my-ads"
              className="font-bold text-xs text-[#002f34] hover:text-teal-700 px-2 py-1 transition-colors uppercase tracking-wider hidden md:inline-block"
            >
              My Ads
            </Link>

            {/* Login / Profile */}
            <Link 
              href="/login" 
              className="font-bold text-sm text-[#002f34] underline hover:no-underline px-2 py-1 transition-colors"
            >
              Login
            </Link>

            {/* Signature OLX-Style Multicolored + SELL Button */}
            <Link 
              href="/post" 
              className="relative inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full font-black text-sm tracking-wide uppercase transition-all transform hover:scale-105 active:scale-95 shadow-md bg-white text-[#002f34] border-[4px] border-t-[#23e5db] border-r-[#002f34] border-b-[#ffce32] border-l-[#23e5db]"
            >
              <Plus size={18} strokeWidth={3} className="text-[#002f34]" />
              <span>SELL</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Sub-Navigation: Category Strip ───────────────────────── */}
      <div className="bg-white border-b border-gray-100 hidden sm:block relative">
        <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between text-xs font-semibold text-[#002f34]">
          
          {/* All Categories Dropdown Trigger */}
          <div ref={megaMenuRef} className="relative py-2.5">
            <button
              onClick={() => setIsAllCategoriesOpen(!isAllCategoriesOpen)}
              className="flex items-center gap-1.5 font-bold uppercase hover:text-teal-700 transition-colors"
            >
              <span>ALL CATEGORIES</span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isAllCategoriesOpen ? 'rotate-180 text-teal-700' : ''}`} />
            </button>

            {/* Mega Menu Dropdown */}
            {isAllCategoriesOpen && (
              <div className="absolute left-0 top-full mt-1 w-[800px] bg-white border border-gray-200 rounded-md shadow-2xl p-6 z-50 grid grid-cols-4 gap-6 text-xs">
                {CATEGORIES.map((cat) => (
                  <div key={cat.id} className="space-y-1">
                    <Link 
                      href={`/search?category=${cat.id}`}
                      onClick={() => setIsAllCategoriesOpen(false)}
                      className="font-bold text-[#002f34] hover:text-teal-600 block pb-1 border-b border-gray-100"
                    >
                      {cat.name}
                    </Link>
                    <div className="space-y-1 text-gray-500 pt-1">
                      <Link 
                        href={`/search?category=${cat.id}`}
                        onClick={() => setIsAllCategoriesOpen(false)}
                        className="block hover:text-teal-600 truncate"
                      >
                        Popular in {cat.name}
                      </Link>
                      <Link 
                        href={`/search?category=${cat.id}`}
                        onClick={() => setIsAllCategoriesOpen(false)}
                        className="block hover:text-teal-600 truncate"
                      >
                        Verified Sellers
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links Strip */}
          <div className="flex items-center gap-6 overflow-x-auto py-2.5 no-scrollbar">
            {POPULAR_QUICK_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="whitespace-nowrap hover:text-teal-700 font-medium text-gray-700 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Subtle CTA badge */}
          <div className="hidden xl:flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <Sparkles size={12} className="text-amber-500" />
            <span>Sell in 30 Seconds</span>
          </div>
        </div>
      </div>
    </header>
  );
}
