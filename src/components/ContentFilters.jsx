import React from 'react';
import { TrendingUp, Sparkles, History, Star, Bookmark } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';


const ContentFilters = () => {
  const { contentType, setContentType } = useMovies();
  const { user } = useAuth();

  const filters = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'new', label: 'New', icon: Sparkles },
    { id: 'classics', label: 'Classics', icon: History },
    { id: 'top_rated', label: 'Top Rated', icon: Star },
    ...(user ? [{ id: 'bookmarks', label: 'Bookmarks', icon: Bookmark }] : []),
  ];


  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-6 mb-8 no-scrollbar">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = contentType === filter.id;
        
        return (
          <button
            key={filter.id}
            onClick={() => setContentType(filter.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-500 whitespace-nowrap group ${
              isActive
                ? 'bg-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-105'
                : 'bg-[#16161a] text-textSecondary hover:bg-[#1c1c22] hover:text-white border border-white/5'
            }`}
          >
            <Icon size={16} strokeWidth={isActive ? 3 : 2} className={isActive ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            <span className={`text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>{filter.label}</span>
          </button>
        );
      })}
    </div>

  );
};

export default ContentFilters;
