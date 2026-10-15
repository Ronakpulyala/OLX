import { formatPrice } from '@/lib/utils';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PriceTagProps {
  price: number;
  className?: string;
  negotiable?: boolean;
}

export default function PriceTag({ price, className, negotiable }: PriceTagProps) {
  return (
    <div className={cn("flex items-end gap-2", className)}>
      <span className="font-bold text-3xl text-gray-900">{formatPrice(price)}</span>
      {negotiable && <span className="text-sm text-gray-500 mb-1">Negotiable</span>}
    </div>
  );
}
