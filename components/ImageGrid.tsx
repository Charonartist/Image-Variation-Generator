
import React from 'react';
import { type GeneratedImage } from '../types';
import ImageCard from './ImageCard';

interface ImageGridProps {
  images: GeneratedImage[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {images.map((image, index) => (
        <ImageCard key={image.id} image={image} index={index} />
      ))}
    </div>
  );
};

export default ImageGrid;
