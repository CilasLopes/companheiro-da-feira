import React, { useState, useEffect } from 'react';
import { getGoogleDriveDirectLink } from '../utils/imageHelper';
import { Skeleton } from './Skeleton';
import { Camera } from 'lucide-react';

interface RemoteImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback?: React.ReactNode;
}

export const RemoteImage: React.FC<RemoteImageProps> = ({ src, className, alt, fallback, ...props }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [processedSrc, setProcessedSrc] = useState('');

  useEffect(() => {
    if (src) {
      setProcessedSrc(getGoogleDriveDirectLink(src));
      setLoading(true);
      setError(false);
    } else {
      setLoading(false);
      setError(true);
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      {error ? (
        fallback || (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container gap-2 text-on-surface-variant/20">
            <Camera size={24} />
          </div>
        )
      ) : processedSrc ? (
        <img
          src={processedSrc}
          alt={alt}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          className={`w-full h-full object-cover ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
          {...props}
        />
      ) : null}
    </div>
  );
};
