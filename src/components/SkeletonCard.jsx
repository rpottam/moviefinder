import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="glass-card flex flex-col h-full animate-pulse">
      {/* Target for Poster */}
      <div className="w-full aspect-[2/3] bg-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent skeleton-loader"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 flex flex-col gap-3 flex-grow">
        <div className="h-6 w-3/4 skeleton-loader rounded-md"></div>
        <div className="flex gap-2 mb-2">
          <div className="h-4 w-12 skeleton-loader rounded-full"></div>
          <div className="h-4 w-12 skeleton-loader rounded-full"></div>
        </div>
        <div className="mt-auto flex justify-between items-center">
            <div className="h-5 w-1/3 skeleton-loader rounded flex items-center gap-1"></div>
            <div className="h-4 w-1/4 skeleton-loader rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
