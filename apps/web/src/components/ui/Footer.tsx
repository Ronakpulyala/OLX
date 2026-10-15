'use client';

import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Smartphone, 
  ShieldCheck, 
  Lock, 
  Award,
  Sparkles
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#ebeeef] border-t border-gray-300 mt-20 text-[#002f34]">
      
      {/* ─── Trust Value Ribbon ───────────────────────────────────── */}
      <div className="bg-[#002f34] text-white py-6 border-b border-teal-800">
        <div className="container mx-auto px-4 max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#ffce32] shrink-0 border border-white/10">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="font-black text-xs uppercase tracking-wide text-white">AI Camera Verified</p>
              <p className="text-[11px] text-teal-200">Phone screen photos blocked. Only real physical goods pass.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#23e5db] shrink-0 border border-white/10">
              <Lock size={20} />
            </div>
            <div>
              <p className="font-black text-xs uppercase tracking-wide text-white">Direct Local Deals</p>
              <p className="text-[11px] text-teal-200">Zero advance deposits. Meet, inspect, and buy safely.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#ffce32] shrink-0 border border-white/10">
              <Award size={20} />
            </div>
            <div>
              <p className="font-black text-xs uppercase tracking-wide text-white">Free &amp; Instant Selling</p>
              <p className="text-[11px] text-teal-200">Post ads in 30 seconds and connect directly with verified buyers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Top Main Footer Columns ─────────────────────────────── */}
      <div className="container mx-auto px-4 max-w-7xl py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Column 1: Popular Locations */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-wider mb-4 text-[#002f34]">
              Popular Locations
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-600 font-medium">
              <li><Link href="/search?location=Bangalore" className="hover:text-[#002f34] hover:underline">Bangalore</Link></li>
              <li><Link href="/search?location=Mumbai" className="hover:text-[#002f34] hover:underline">Mumbai</Link></li>
              <li><Link href="/search?location=Delhi" className="hover:text-[#002f34] hover:underline">New Delhi</Link></li>
              <li><Link href="/search?location=Hyderabad" className="hover:text-[#002f34] hover:underline">Hyderabad</Link></li>
              <li><Link href="/search?location=Chennai" className="hover:text-[#002f34] hover:underline">Chennai</Link></li>
            </ul>
          </div>

          {/* Column 2: Trending Locations */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-wider mb-4 text-[#002f34]">
              Trending Cities
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-600 font-medium">
              <li><Link href="/search?location=Pune" className="hover:text-[#002f34] hover:underline">Pune</Link></li>
              <li><Link href="/search?location=Kolkata" className="hover:text-[#002f34] hover:underline">Kolkata</Link></li>
              <li><Link href="/search?location=Ahmedabad" className="hover:text-[#002f34] hover:underline">Ahmedabad</Link></li>
              <li><Link href="/search?location=Chandigarh" className="hover:text-[#002f34] hover:underline">Chandigarh</Link></li>
              <li><Link href="/search?location=Jaipur" className="hover:text-[#002f34] hover:underline">Jaipur</Link></li>
            </ul>
          </div>

          {/* Column 3: About Us */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-wider mb-4 text-[#002f34]">
              About Sell
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-600 font-medium">
              <li><Link href="/about" className="hover:text-[#002f34] hover:underline">About Company</Link></li>
              <li><Link href="/careers" className="hover:text-[#002f34] hover:underline">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-[#002f34] hover:underline">Contact Us</Link></li>
              <li><Link href="/businesses" className="hover:text-[#002f34] hover:underline">Sell for Businesses</Link></li>
            </ul>
          </div>

          {/* Column 4: Sell */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-wider mb-4 text-[#002f34]">
              Safety &amp; Help
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-600 font-medium">
              <li><Link href="/help" className="hover:text-[#002f34] hover:underline">Help &amp; Support</Link></li>
              <li><Link href="/terms" className="hover:text-[#002f34] hover:underline">Terms &amp; Privacy Policy</Link></li>
              <li><Link href="/safety" className="hover:text-[#002f34] hover:underline">Anti-Fraud Guide</Link></li>
              <li><Link href="/sitemap" className="hover:text-[#002f34] hover:underline">Site Directory</Link></li>
            </ul>
          </div>

          {/* Column 5: Follow Us & App Badges */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-black text-xs uppercase tracking-wider mb-4 text-[#002f34]">
              Connect With Us
            </h4>
            <div className="flex items-center gap-2.5 mb-6 text-[#002f34]">
              <a href="#" className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors shadow-2xs" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors shadow-2xs" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="#" className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors shadow-2xs" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a href="#" className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors shadow-2xs" aria-label="YouTube">
                <Youtube size={16} />
              </a>
            </div>

            <p className="font-black text-[11px] text-gray-600 uppercase mb-2">Get the Sell App</p>
            <div className="flex flex-col gap-2">
              <a href="#" className="flex items-center gap-2 bg-[#002f34] text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-[#001e21] transition-colors w-fit shadow-sm">
                <Smartphone size={14} />
                <span>Google Play</span>
              </a>
              <a href="#" className="flex items-center gap-2 bg-[#002f34] text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-[#001e21] transition-colors w-fit shadow-sm">
                <Smartphone size={14} />
                <span>App Store</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Dark Bar ─────────────────────────────────────── */}
      <div className="bg-[#002f34] text-white py-4 text-xs border-t border-teal-900">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-gray-300">
            <Link href="/help" className="hover:underline">Help</Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:underline">Legal &amp; Privacy</Link>
            <span>&bull;</span>
            <Link href="/sitemap" className="hover:underline">Sitemap</Link>
          </div>
          <p className="text-gray-400 text-center sm:text-right font-medium">
            All rights reserved &copy; 2006-2026 Sell Marketplace India Pvt. Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
}
