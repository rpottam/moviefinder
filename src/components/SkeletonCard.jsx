import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="glass-card flex flex-col h-full animate-pulse border-white/5">
      <div className="relative w-full aspect-[2/3] bg-white/[0.03] overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
      
      <div className="p-4 flex flex-col flex-grow gap-4">
        <div className="h-5 w-4/5 bg-white/10 rounded-lg" />
        
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-white/5 rounded-full" />
          <div className="h-4 w-16 bg-white/5 rounded-full" />
        </div>
        
        <div className="mt-auto flex justify-between items-center">
          <div className="h-3 w-10 bg-white/5 rounded" />
          <div className="h-4 w-4 bg-white/5 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
