import React, { useState, useEffect } from 'react';
import { getGoogleDriveDirectLink } from '../utils/imageHelper';
import { Skeleton } from './Skeleton';
import { Camera } from 'lucide-react';

interface RemoteImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback?: React.ReactNode;
}

export const RemoteImage: React.FC<RemoteImageProps> = ({ src, className, alt, fallback, ...props }) => {
  const [error, setError] = useState(false);
  const [processedSrc, setProcessedSrc] = useState('');

  useEffect(() => {
    if (src) {
      setProcessedSrc(getGoogleDriveDirectLink(src));
      setError(false);
    } else {
      setError(true);
    }
  }, [src]);

  if (error || !processedSrc) {
    return (
      <div className={`relative flex flex-col items-center justify-center bg-surface-container gap-2 text-on-surface-variant/20 ${className}`}>
        <Camera size={24} />
      </div>
    );
  }

  return (
    <img
      src={processedSrc}
      alt={alt}
      onError={() => setError(true)}
      className={`object-cover ${className}`}
      {...props}
    />
  );
};
