import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { Categories } from './components/Categories';
import { ImageGrid } from './components/ImageGrid';
import { ImageUpload } from './components/ImageUpload';
import { ImageModal } from './components/ImageModal';
import { AuthModal } from './components/AuthModal';
import { Pagination } from './components/Pagination';
import { Footer } from './components/Footer';
import { FooterModal } from './components/FooterModal';
import { ScrollToTop } from './components/ScrollToTop';
import { Image } from './types';
import { getImages, uploadImage } from './lib/supabase';
import { useAuth } from './hooks/useAuth';

const IMAGES_PER_PAGE = 20;

function App() {
  const { user } = useAuth();
  const [images, setImages] = useState<Image[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showUpload, setShowUpload] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [footerModalType, setFooterModalType] = useState<string | null>(null);

  // Filter out invalid images first
  const validImages = images.filter(image => image && image.url && image.url.trim() !== '');
  const totalPages = Math.ceil(validImages.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const currentImages = validImages.slice(startIndex, startIndex + IMAGES_PER_PAGE);

  useEffect(() => {
    loadImages();
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const handleImageClick = (event: CustomEvent<Image>) => {
      setSelectedImage(event.detail);
    };

    const handleFooterModal = (event: CustomEvent<string>) => {
      setFooterModalType(event.detail);
    };

    window.addEventListener('imageClick', handleImageClick as EventListener);
    window.addEventListener('openFooterModal', handleFooterModal as EventListener);

    return () => {
      window.removeEventListener('imageClick', handleImageClick as EventListener);
      window.removeEventListener('openFooterModal', handleFooterModal as EventListener);
    };
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await getImages(searchQuery, selectedCategory || undefined);
      setImages(data);
      // Reset to first page when loading new images
      setCurrentPage(1);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to load images');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageDelete = (imageId: string) => {
    setImages(images.filter(img => img.id !== imageId));
  };

  const handleUpload = async (newImages: Image[], category: string) => {
    if (!user) {
      toast.error('Please sign in to upload images');
      return;
    }

    try {
      for (const image of newImages) {
        if (image.file) {
          await uploadImage(image.file, image.title, category);
        }
      }
      await loadImages();
      setShowUpload(false);
      toast.success('Images uploaded successfully!');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to upload images');
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar 
        onSearch={handleSearch}
        onUploadClick={() => setShowUpload(!showUpload)}
        onAuthClick={() => setShowAuthModal(true)}
      />
      <Categories
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        {showUpload && user && (
          <div className="mb-8">
            <ImageUpload onUpload={handleUpload} />
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading images...</p>
          </div>
        ) : (
          <ImageGrid 
            images={currentImages} 
            onImageClick={(image) => setSelectedImage(image)}
            onImageDelete={handleImageDelete}
          />
        )}
        
        {validImages.length > IMAGES_PER_PAGE && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </main>

      <Footer />
      <ScrollToTop />

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          images={validImages}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {footerModalType && (
        <FooterModal
          type={footerModalType}
          onClose={() => setFooterModalType(null)}
        />
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;