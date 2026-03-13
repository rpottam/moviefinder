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
    <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6 no-scrollbar">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = contentType === filter.id;
        
        return (
          <button
            key={filter.id}
            onClick={() => setContentType(filter.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 whitespace-nowrap ${
              isActive
                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105'
                : 'bg-white/5 border-white/10 text-textSecondary hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
            <span className="font-medium text-sm">{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ContentFilters;
