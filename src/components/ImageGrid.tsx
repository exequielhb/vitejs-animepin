import React from 'react';
import Masonry from 'react-masonry-css';
import { Share2, Trash2 } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useInView } from 'react-intersection-observer';
import { Image } from '../types';
import { useAuth } from '../hooks/useAuth';
import { deleteImage } from '../lib/supabase';
import toast from 'react-hot-toast';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface ImageGridProps {
  images: Image[];
  onImageClick: (image: Image) => void;
  onImageDelete?: (imageId: string) => void;
}

const breakpointColumns = {
  default: 5,
  1536: 4,
  1280: 3,
  1024: 3,
  768: 2,
  640: 1,
};

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  onImageClick,
  onImageDelete,
}) => {
  const shareOnTwitter = (image: Image) => {
    const text = `Check out this awesome anime artwork: ${image.title}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(image.url)}`;
    window.open(url, '_blank');
  };

  const shareOnInstagram = (image: Image) => {
    navigator.clipboard.writeText(image.url);
    toast.success('Image URL copied! You can now share it on Instagram.');
  };

  // Filter out images with invalid or empty URLs
  const validImages = images.filter(image => image && image.url && image.url.trim() !== '');

  if (validImages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">
          No images found. Try a different search or category!
        </p>
      </div>
    );
  }

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-4 w-auto"
      columnClassName="pl-4 bg-transparent"
    >
      {validImages.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onImageClick={onImageClick}
          onShareTwitter={shareOnTwitter}
          onShareInstagram={shareOnInstagram}
          onDelete={onImageDelete}
        />
      ))}
    </Masonry>
  );
};

interface ImageCardProps {
  image: Image;
  onImageClick: (image: Image) => void;
  onShareTwitter: (image: Image) => void;
  onShareInstagram: (image: Image) => void;
  onDelete?: (imageId: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onImageClick,
  onShareTwitter,
  onShareInstagram,
  onDelete,
}) => {
  const { user } = useAuth();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteImage(image.id);
      toast.success('Image deleted successfully');
      onDelete?.(image.id);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to delete image');
      }
    }
  };

  const canDelete = user && image.userId === user.id;

  return (
    <div ref={ref} className="mb-4 mt-7 break-inside-avoid">
      <div className="relative group rounded-xl overflow-hidden bg-gray-800 hover:shadow-xl transition-all duration-300">
        {inView && (
          <LazyLoadImage
            src={image.url}
            alt={image.title}
            effect="blur"
            className="w-full object-cover hover:opacity-75 transition-opacity duration-300 cursor-pointer"
            onClick={() => onImageClick(image)}
            wrapperClassName="w-full"
            threshold={100}
            placeholderSrc={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E`}
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col gap-2">
            <h3 className="text-white text-sm font-medium truncate">
              {image.title}
            </h3>
            {image.category && (
              <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full w-fit">
                {image.category}
              </span>
            )}
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShareTwitter(image);
                }}
                className="p-1.5 rounded-full bg-blue-400 hover:bg-blue-500 transition-colors"
              >
                <Share2 className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShareInstagram(image);
                }}
                className="p-1.5 rounded-full bg-pink-500 hover:bg-pink-600 transition-colors"
              >
                <Share2 className="w-4 h-4 text-white" />
              </button>
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                  title="Delete image"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};