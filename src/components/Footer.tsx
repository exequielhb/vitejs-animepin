import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const openModal = (type: string) => {
    const event = new CustomEvent('openFooterModal', { detail: type });
    window.dispatchEvent(event);
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <img 
              src="https://i.pinimg.com/originals/f0/8e/3b/f08e3b0348b60c3bdc601635452aec5b.gif" 
              alt="AnimePin Logo" 
              className="w-6 h-6 rounded-full"
            />
            <span className="text-xl font-bold text-purple-500">AnimePin</span>
          </div>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500" /> for anime lovers
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <button onClick={() => openModal('about')} className="hover:text-purple-500 transition-colors">About</button>
            <button onClick={() => openModal('terms')} className="hover:text-purple-500 transition-colors">Terms</button>
            <button onClick={() => openModal('privacy')} className="hover:text-purple-500 transition-colors">Privacy</button>
            <button onClick={() => openModal('contact')} className="hover:text-purple-500 transition-colors">Contact</button>
          </div>
        </div>
      </div>
    </footer>
  );
};