
import React from 'react';
import { type GeneratedImage } from '../types';
import DownloadIcon from './icons/DownloadIcon';

interface ImageCardProps {
  image: GeneratedImage;
  index: number;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, index }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `variation-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg shadow-lg bg-gray-800 border border-gray-700 transform transition-transform duration-300 hover:scale-105 hover:shadow-indigo-500/30">
      <img
        src={image.src}
        alt={image.prompt}
        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col items-center justify-end p-2 sm:p-4 text-center">
        <p className="text-white text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform translate-y-4 group-hover:translate-y-0">
          {image.prompt}
        </p>
        <button
          onClick={handleDownload}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-indigo-600 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100"
          aria-label="Download image"
        >
          <DownloadIcon />
        </button>
      </div>
    </div>
  );
};

export default ImageCard;
