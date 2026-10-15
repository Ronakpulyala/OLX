'use client';
import { MapPin, Navigation, ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const RECENT_LOCATIONS = [
  { city: 'Bangalore', state: 'Karnataka' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'New Delhi', state: 'Delhi' },
  { city: 'Hyderabad', state: 'Telangana' },
];

const POPULAR_STATES = [
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Kerala',
  'Delhi',
  'Telangana',
  'Gujarat',
  'Uttar Pradesh',
];

export default function LocationSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Bangalore, Karnataka');
  const [query, setQuery] = useState('');
  const [detecting, setDetecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: string) => {
    setSelectedLocation(loc);
    setQuery('');
    setIsOpen(false);
  };

  const handleDetectLocation = () => {
    setDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => {
            setSelectedLocation('Indiranagar, Bangalore');
            setDetecting(false);
            setIsOpen(false);
          }, 600);
        },
        () => {
          setDetecting(false);
          setSelectedLocation('Bangalore, Karnataka');
          setIsOpen(false);
        }
      );
    } else {
      setDetecting(false);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-64 md:w-72">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 border-2 ${isOpen ? 'border-[#002f34]' : 'border-gray-300 hover:border-gray-400'} rounded bg-white px-3 py-2 cursor-pointer transition-colors`}
      >
        <MapPin size={18} className="text-[#002f34] shrink-0" />
        <span className="flex-1 text-sm font-medium text-[#002f34] truncate">
          {selectedLocation}
        </span>
        <ChevronDown size={18} className={`text-[#002f34] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-md shadow-xl z-50 overflow-hidden text-sm">
          {/* Quick Search */}
          <div className="p-2 border-b bg-gray-50">
            <input
              type="text"
              placeholder="Search city or state..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded outline-none focus:border-[#002f34]"
              autoFocus
            />
          </div>

          {/* Current Location Action */}
          <button
            onClick={handleDetectLocation}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-teal-50 border-b transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Navigation size={16} className={detecting ? 'animate-spin' : ''} />
            </div>
            <div>
              <p className="font-bold text-[#002f34] text-xs">
                {detecting ? 'Detecting location...' : 'Use current location'}
              </p>
              <p className="text-[11px] text-gray-500">Auto-detect via GPS</p>
            </div>
          </button>

          {/* Recent Locations */}
          <div className="py-2 border-b">
            <p className="px-4 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Recent Locations
            </p>
            {RECENT_LOCATIONS.map((loc) => {
              const fullLoc = `${loc.city}, ${loc.state}`;
              const isSelected = selectedLocation === fullLoc;
              return (
                <button
                  key={fullLoc}
                  onClick={() => handleSelect(fullLoc)}
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-800 font-medium">{loc.city}</span>
                    <span className="text-[11px] text-gray-400">({loc.state})</span>
                  </div>
                  {isSelected && <Check size={14} className="text-teal-600" />}
                </button>
              );
            })}
          </div>

          {/* Popular States */}
          <div className="py-2 max-h-48 overflow-y-auto">
            <p className="px-4 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Popular Regions
            </p>
            {POPULAR_STATES.filter(s => s.toLowerCase().includes(query.toLowerCase())).map((state) => (
              <button
                key={state}
                onClick={() => handleSelect(state)}
                className="w-full flex items-center gap-2 px-4 py-1.5 hover:bg-gray-100 text-left text-xs text-gray-700 transition-colors"
              >
                <span>{state}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
