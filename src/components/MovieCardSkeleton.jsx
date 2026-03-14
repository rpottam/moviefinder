import React from 'react';

const MovieCardSkeleton = () => {
  return (
    <div className="glass-card flex flex-col h-full animate-pulse">
      <div className="relative w-full aspect-[2/3] bg-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
      
      <div className="p-4 flex flex-col flex-grow gap-3">
        <div className="h-6 w-3/4 bg-white/10 rounded-md" />
        
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-white/5 rounded-full" />
          <div className="h-5 w-16 bg-white/5 rounded-full" />
        </div>
        
        <div className="mt-auto flex justify-between">
          <div className="h-4 w-12 bg-white/5 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
