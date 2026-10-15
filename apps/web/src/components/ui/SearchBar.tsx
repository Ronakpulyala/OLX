'use client';
import { Search, X, TrendingUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const POPULAR_SEARCHES = [
  'iPhone 13',
  'Royal Enfield Classic 350',
  'Maruti Suzuki Swift',
  'PlayStation 5',
  'Wooden Dining Table',
  'MacBook Air M2',
  'Honda Activa 6G',
  '2 BHK Flat for Rent',
];

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchTerm?: string) => {
    const q = (searchTerm !== undefined ? searchTerm : query).trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/search');
    }
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div 
        className={`flex items-center border-2 ${isFocused ? 'border-[#002f34]' : 'border-gray-300 hover:border-gray-400'} rounded bg-white transition-colors overflow-hidden`}
      >
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className="outline-none flex-1 px-4 py-2 text-sm text-[#002f34] placeholder-gray-500 font-normal"
          placeholder="Find Cars, Mobile Phones, Electronics and more..."
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
        <button 
          onClick={() => handleSearch()}
          className="bg-[#002f34] hover:bg-[#001e21] text-white p-2.5 px-5 transition-colors flex items-center justify-center shrink-0"
          aria-label="Search"
        >
          <Search size={20} strokeWidth={2.5} />
        </button>
      </div>

      {isFocused && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-md shadow-xl z-50 overflow-hidden text-sm">
          <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp size={14} className="text-teal-600" /> Popular Searches
            </span>
          </div>
          <div className="py-1">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setQuery(term);
                  handleSearch(term);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-left text-xs text-[#002f34] transition-colors"
              >
                <Search size={14} className="text-gray-400" />
                <span className="font-medium">{term}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
