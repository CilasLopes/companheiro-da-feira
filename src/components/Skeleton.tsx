import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
  const baseClasses = "animate-pulse bg-surface-container-highest/50";
  const variantClasses = {
    rect: "rounded-2xl",
    circle: "rounded-full",
    text: "rounded h-4 w-3/4"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
};

export const BannerSkeleton = () => (
  <div className="w-full aspect-[21/9] md:aspect-[21/7] rounded-[40px] animate-pulse bg-surface-container-highest/50" />
);

export const ProductSkeleton = () => (
  <div className="bg-white rounded-[32px] p-4 space-y-3 animate-pulse bg-surface-container-highest/20">
    <div className="aspect-square rounded-2xl bg-surface-container-highest/50" />
    <div className="h-4 w-3/4 bg-surface-container-highest/50 rounded" />
    <div className="h-3 w-1/2 bg-surface-container-highest/50 rounded" />
  </div>
);
