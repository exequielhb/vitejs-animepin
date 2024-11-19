import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { categories } from '../lib/supabase';

interface CategoriesProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export const Categories: React.FC<CategoriesProps> = ({ 
  selectedCategory, 
  onCategorySelect 
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollAmount = 200;

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('categories-container');
    if (container) {
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-gray-900/60 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
        <div className="relative flex items-center">
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 z-10 p-1 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700 md:hidden"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            id="categories-container"
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-6 md:px-0"
            style={{
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <button
              onClick={() => onCategorySelect(null)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 
                ${!selectedCategory 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategorySelect(category)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 
                  ${selectedCategory === category 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                {category}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 z-10 p-1 bg-gray-800 rounded-full text-gray-300 hover:bg-gray-700 md:hidden"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};