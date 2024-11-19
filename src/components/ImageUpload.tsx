import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { Image } from '../types';
import { categories } from '../lib/supabase';

interface ImageUploadProps {
  onUpload: (images: Image[], category: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    try {
      setIsUploading(true);
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length === 0) {
        throw new Error('No valid image files selected');
      }

      const newImages: Image[] = imageFiles.map(file => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: selectedCategory,
        file
      }));

      await onUpload(newImages, selectedCategory);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('File handling error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg border-gray-700 focus:ring-2 focus:ring-purple-500"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div
        className={`p-8 border-2 border-dashed rounded-xl transition-colors duration-300 ${
          isDragging
            ? 'border-purple-500 bg-purple-500/10'
            : 'border-gray-600 hover:border-purple-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <Upload className={`w-12 h-12 ${isUploading ? 'text-purple-500 animate-bounce' : 'text-gray-400'}`} />
          <div className="text-center">
            <p className="text-lg font-medium text-gray-200">
              {isUploading ? 'Uploading...' : 'Drag and drop your images here'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {isUploading ? 'Please wait...' : 'or click to select files'}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            disabled={isUploading}
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`px-4 py-2 bg-purple-600 text-white rounded-lg transition-colors duration-300 ${
              isUploading 
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-purple-700 cursor-pointer'
            }`}
          >
            Select Files
          </label>
        </div>
      </div>
    </div>
  );
};