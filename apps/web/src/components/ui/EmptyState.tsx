import * as Icons from 'lucide-react';
import Button from './Button';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
}

export default function EmptyState({ 
  icon = 'Inbox', 
  title, 
  description, 
  actionLabel, 
  actionHref,
  actionOnClick
}: EmptyStateProps) {
  const IconComponent = (Icons as any)[icon] || Icons.Inbox;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
        <IconComponent size={40} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 max-w-sm mb-6">{description}</p>}
      
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="outline">{actionLabel}</Button>
        </Link>
      )}
      {actionLabel && actionOnClick && (
        <Button variant="outline" onClick={actionOnClick}>{actionLabel}</Button>
      )}
    </div>
  );
}
