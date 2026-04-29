/**
 * Product Gallery Component
 *
 * Displays product images with thumbnail navigation and zoom functionality.
 */

import React, { useState, useRef } from 'react';
import AppImage from '../ui/AppImage';

interface ProductImage {
  url: string;
  alt?: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
  mainImageUrl?: string;
  enableZoom?: boolean;
  className?: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images = [],
  mainImageUrl,
  enableZoom = true,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  
  const mainImageRef = useRef<HTMLImageElement>(null);
  const zoomLensRef = useRef<HTMLDivElement>(null);
  const zoomResultRef = useRef<HTMLDivElement>(null);
  
  // Determine main image URL
  const getMainImageUrl = () => {
    if (mainImageUrl) return mainImageUrl;
    if (images.length > 0) return images[0].url;
    return '';
  };
  
  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    setZoomed(false); // Reset zoom when changing image
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableZoom || !mainImageRef.current) return;
    
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the image
    const y = e.clientY - rect.top;  // y position within the image
    
    // Calculate position as percentage (0-1)
    const xPercent = x / rect.width;
    const yPercent = y / rect.height;
    
    setZoomPosition({ x: xPercent, y: yPercent });
    setZoomed(true);
  };
  
  const handleMouseLeave = () => {
    setZoomed(false);
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!enableZoom || !mainImageRef.current) return;
    e.preventDefault();
    
    const rect = mainImageRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const xPercent = x / rect.width;
    const yPercent = y / rect.height;
    
    setZoomPosition({ x: xPercent, y: yPercent });
    setZoomed(true);
  };
  
  const handleTouchEnd = () => {
    setZoomed(false);
  };
  
  // Calculate zoomed image position
  const getZoomStyle = () => {
    if (!zoomPosition.x && !zoomPosition.y && !zoomed) return {};
    
    // For zoom effect, we adjust the background position
    // In a real implementation, this would show a magnified portion
    return {
      '--zoom-x': `${zoomPosition.x * 100}%`,
      '--zoom-y': `${zoomPosition.y * 100}%`,
    };
  };
  
  return (
    <div className={`relative w-full ${className}`}>
      {/* Main Image Container */}
      <div 
        className="relative w-full h-[400px] md:h-[500px] bg-gray-50 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AppImage
          src={getMainImageUrl()}
          alt={`Product image ${currentIndex + 1}`}
          className="object-contain w-full h-full transition-opacity duration-300"
          // We'll use the image ref for zoom calculations
          ref={mainImageRef}
        />
        
        {/* Zoom Lens - visible when zoomed */}
        {enableZoom && zoomed && (
          <div
            ref={zoomLensRef}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at var(--zoom-x) var(--zoom-y), transparent 30%, rgba(0,0,0,0.1) 100%)`,
              pointerEvents: 'none'
            }}
          />
        )}
        
        {/* Zoom Result - shows magnified portion */}
        {enableZoom && zoomed && (
          <div
            ref={zoomResultRef}
            className="absolute right-[110%] top-0 w-[200px] h-[200px] bg-[url('')] bg-contain bg-no-repeat border-2 border-gold rounded-lg shadow-xl z-20"
            style={{
              backgroundImage: `url(${getMainImageUrl()})`,
              backgroundPosition: `-${zoomPosition.x * 100}% -${zoomPosition.y * 100}%`,
              backgroundSize: `${200 * 2}px ${200 * 2}px` // 2x zoom
            }}
          />
        )}
      </div>
      
      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-16 h-16 border-2 ${
                currentIndex === index ? 'border-gold' : 'border-ink-20'
              } rounded-lg overflow-hidden hover:border-gold transition-colors`}
            >
              <AppImage
                src={image.url}
                alt={image.alt || `Thumbnail ${index + 1}`}
                className="object-contain w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Image Counter */}
      {images.length > 1 && (
        <div className="mt-2 text-center text-xs text-ink-40">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;