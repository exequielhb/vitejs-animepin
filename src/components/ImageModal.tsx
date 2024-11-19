import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Image } from '../types';

interface ImageModalProps {
  image: Image;
  onClose: () => void;
  images: Image[];
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, onClose, images }) => {
  const currentIndex = images.findIndex(img => img.id === image.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasPrevious) {
      const previousImage = images[currentIndex - 1];
      onClose();
      setTimeout(() => {
        const event = new CustomEvent('imageClick', { detail: previousImage });
        window.dispatchEvent(event);
      }, 0);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasNext) {
      const nextImage = images[currentIndex + 1];
      onClose();
      setTimeout(() => {
        const event = new CustomEvent('imageClick', { detail: nextImage });
        window.dispatchEvent(event);
      }, 0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div className="relative max-w-7xl max-h-[90vh] mx-4">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white hover:text-purple-400"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative">
          {hasPrevious && (
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full z-10 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <img
            src={image.url}
            alt={image.title}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {hasNext && (
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full z-10 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
        <h3 className="mt-4 text-white text-center font-medium">{image.title}</h3>
      </div>
    </div>
  );
};