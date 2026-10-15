import Image from 'next/image';
import { User } from 'lucide-react';
import { cn } from './PriceTag';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Avatar({ src, alt = 'Avatar', size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={cn('relative rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shrink-0', sizes[size], className)}>
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        <User className="text-gray-400 w-1/2 h-1/2" />
      )}
    </div>
  );
}
