import React from 'react';
import { X } from 'lucide-react';

interface FooterModalProps {
  type: string;
  onClose: () => void;
}

export const FooterModal: React.FC<FooterModalProps> = ({ type, onClose }) => {
  const content = {
    about: {
      title: 'About AnimePin',
      content: (
        <div className="space-y-4">
          <p>
            AnimePin is a community-driven platform for anime and art
            enthusiasts to share and discover amazing artwork. Our mission is to
            create a space where artists and fans can connect through their love
            of anime-style art.
          </p>
          <p>
            Whether you're an artist looking to showcase your work or a fan
            searching for inspiration, AnimePin provides a beautiful,
            user-friendly platform to explore and share artwork across various
            categories.
          </p>
        </div>
      ),
    },
    terms: {
      title: 'Terms of Service',
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold">1. Acceptance of Terms</h3>
          <p>
            By accessing and using AnimePin, you agree to be bound by these
            Terms of Service and all applicable laws and regulations.
          </p>

          <h3 className="font-semibold">2. User Content</h3>
          <p>
            Users are responsible for the content they upload and must ensure
            they have the right to share such content. Any violation of
            copyright or inappropriate content will result in immediate removal.
          </p>

          <h3 className="font-semibold">3. Account Responsibilities</h3>
          <p>
            Users are responsible for maintaining the security of their accounts
            and all activities that occur under their accounts.
          </p>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold">Data Collection</h3>
          <p>
            We collect minimal personal information necessary to provide our
            services. This includes email addresses for account creation and
            basic usage analytics to improve our platform.
          </p>

          <h3 className="font-semibold">Data Usage</h3>
          <p>
            Your data is used solely for providing and improving AnimePin
            services. We never sell your personal information to third parties.
          </p>

          <h3 className="font-semibold">Data Protection</h3>
          <p>
            We implement industry-standard security measures to protect your
            personal information and ensure the safety of your data.
          </p>
        </div>
      ),
    },
    contact: {
      title: 'Contact Us',
      content: (
        <div className="space-y-4">
          <p>
            We'd love to hear from you! Whether you have questions, suggestions,
            or need support, feel free to reach out to us.
          </p>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Email</h3>
            <a
              href="mailto:support@animepin.art"
              className="text-purple-400 hover:text-purple-300"
            >
              juegosfbarg@gmail.com
            </a>
          </div>

          <p className="text-sm text-gray-400">
            We typically respond within 24-48 hours during business days.
          </p>
        </div>
      ),
    },
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-900 rounded-xl max-w-2xl w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">
          {content[type as keyof typeof content].title}
        </h2>

        <div className="text-gray-300">
          {content[type as keyof typeof content].content}
        </div>
      </div>
    </div>
  );
};
