import React from 'react';

interface AppImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty' | undefined;
  blurDataURL?: string;
  fill?: boolean;
  sizes?: string;
  onClick?: () => void;
  fallbackSrc?: string;
  // WebP support
  webp?: boolean;
  [key: string]: any;
}

const AppImage: React.FC<AppImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder,
  blurDataURL,
  fill = false,
  sizes,
  onClick,
  fallbackSrc = '/assets/images/no_image.png',
  webp = true,
  ...props
}) => {
  const [imageSrc, setImageSrc] = React.useState(src);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  // Check if browser supports WebP
  const supportsWebp = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      // was able or not to get WebP representation
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false; // very old browser like IE 8, canvas not supported
  }, []);

  // Determine final image source with WebP fallback
  const getImageSource = React.useMemo(() => {
    // If WebP is not supported or disabled, return original src
    if (!webp || !supportsWebp) return src;
    
    // If src already ends with .webp, return as is
    if (src.toLowerCase().endsWith('.webp')) return src;
    
    // Try to convert to WebP by replacing extension
    const webpSrc = src.replace(/\.(jpe?g|png|gif|avif)$/i, '.webp');
    return webpSrc;
  }, [src, webp, supportsWebp]);

  const isExternal = imageSrc.startsWith('http://') || imageSrc.startsWith('https://');
  const isLocal = imageSrc.startsWith('/') || imageSrc.startsWith('./') || imageSrc.startsWith('data:');

  const handleError = () => {
    if (!hasError && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(true);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const commonClassName = `${className} ${isLoading ? 'bg-gray-200' : ''} ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`;

  if (isExternal && !isLocal) {
    const imgStyle: React.CSSProperties = {};

    if (width) imgStyle.width = width;
    if (height) imgStyle.height = height;

    if (fill) {
      return (
        <div className={`relative ${className}`} style={{ width: width || '100%', height: height || '100%' }}>
          <img
            src={getImageSource}
            alt={alt}
            className={`${commonClassName} absolute inset-0 w-full h-full object-cover`}
            onError={handleError}
            onLoad={handleLoad}
            onClick={onClick}
            style={imgStyle}
            loading="lazy"
            {...props}
          />
        </div>
      );
    }

    return (
      <img
        src={getImageSource}
        alt={alt}
        className={commonClassName}
        onError={handleError}
        onLoad={handleLoad}
        onClick={onClick}
        style={imgStyle}
        loading="lazy"
        {...props}
      />
    );
  }

  const imageProps = {
    src: getImageSource,
    alt,
    className: commonClassName,
    priority,
    placeholder,
    blurDataURL,
    unoptimized: true,
    onError: handleError,
    onLoad: handleLoad,
    onClick,
    ...props,
  };

  if (fill) {
    return (
      <div className={`relative ${className}`}>
        {/* Using div instead of Image for non-Next.js environment */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getImageSource})`, backgroundSize: 'cover' }}
          onClick={onClick}
        />
      </div>
    );
  }

  return (
    <img
      {...imageProps}
      width={width || 400}
      height={height || 300}
      loading="lazy"
    />
  );
};

export default AppImage;