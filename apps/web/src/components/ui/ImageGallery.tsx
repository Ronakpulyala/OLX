'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="bg-gray-200 aspect-video flex items-center justify-center text-gray-500">No images available</div>;
  }

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative group">
      <div className="aspect-video w-full relative bg-black flex items-center justify-center overflow-hidden rounded-lg">
        <Image 
          src={images[currentIndex] || ''} 
          alt={`Gallery image ${currentIndex + 1}`}
          fill
          className="object-contain"
        />
      </div>
      
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft size={24} />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
