'use client';

import Link from 'next/link';
import { 
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
  HelpCircle,
  LucideIcon
} from 'lucide-react';

const ICON_MAP: Record<string, { icon: LucideIcon; bg: string; text: string }> = {
  cars: { icon: Car, bg: 'bg-blue-50 group-hover:bg-blue-100', text: 'text-blue-600' },
  mobiles: { icon: Smartphone, bg: 'bg-emerald-50 group-hover:bg-emerald-100', text: 'text-emerald-600' },
  electronics: { icon: Tv, bg: 'bg-amber-50 group-hover:bg-amber-100', text: 'text-amber-600' },
  furniture: { icon: Armchair, bg: 'bg-orange-50 group-hover:bg-orange-100', text: 'text-orange-600' },
  fashion: { icon: Shirt, bg: 'bg-pink-50 group-hover:bg-pink-100', text: 'text-pink-600' },
  books: { icon: BookOpen, bg: 'bg-indigo-50 group-hover:bg-indigo-100', text: 'text-indigo-600' },
  sports: { icon: Dumbbell, bg: 'bg-purple-50 group-hover:bg-purple-100', text: 'text-purple-600' },
  bikes: { icon: Bike, bg: 'bg-red-50 group-hover:bg-red-100', text: 'text-red-600' },
  pets: { icon: Dog, bg: 'bg-yellow-50 group-hover:bg-yellow-100', text: 'text-yellow-700' },
  services: { icon: Wrench, bg: 'bg-cyan-50 group-hover:bg-cyan-100', text: 'text-cyan-700' },
  jobs: { icon: Briefcase, bg: 'bg-teal-50 group-hover:bg-teal-100', text: 'text-teal-700' },
  'real-estate': { icon: Home, bg: 'bg-green-50 group-hover:bg-green-100', text: 'text-green-600' },
};

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon?: string;
  };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const meta = ICON_MAP[category.id] || { icon: HelpCircle, bg: 'bg-gray-50', text: 'text-gray-600' };
  const IconComponent = meta.icon;

  return (
    <Link 
      href={`/search?category=${category.id}`} 
      className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border border-gray-200/80 bg-white hover:border-[#002f34] hover:shadow-lg transition-all duration-300 group text-center hover:-translate-y-1"
    >
      <div className={`w-14 h-14 rounded-2xl ${meta.bg} ${meta.text} flex items-center justify-center mb-2.5 group-hover:scale-110 transition-all duration-300 shadow-2xs`}>
        <IconComponent size={26} strokeWidth={2.2} />
      </div>
      <span className="text-xs sm:text-sm font-bold text-[#002f34] group-hover:text-teal-800 transition-colors line-clamp-1">
        {category.name}
      </span>
    </Link>
  );
}
