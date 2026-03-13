import React from 'react';
import { tmdbApi } from '../services/tmdb';
import { Bookmark } from 'lucide-react';
import { useMovies } from '../context/MovieContext';


const MovieCard = ({ movie, genres, onClick }) => {
  const { bookmarks, toggleBookmark } = useMovies();
  const isBookmarked = bookmarks?.some(b => b.id === movie.id);
  
  const posterUrl = tmdbApi.getImageUrl(movie.poster_path);

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';
  const year = movie.release_date ? movie.release_date.substring(0, 4) : '';
  
  // Get first two genre names
  const movieGenres = movie.genre_ids 
    ? movie.genre_ids
        .map(id => genres.find(g => g.id === id)?.name)
        .filter(Boolean)
        .slice(0, 2)
    : [];

  return (
    <div 
      className="glass-card flex flex-col h-full cursor-pointer group"
      onClick={() => onClick(movie)}
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-black/20">
        {posterUrl ? (
          <img 
            src={posterUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-textSecondary text-sm">
            No Poster
          </div>
        )}

        {/* Bookmark Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(movie);
          }}
          className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-20 ${
            isBookmarked 
              ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/40' 
              : 'bg-black/60 text-white/70 hover:bg-black/80 hover:text-white'
          }`}
        >
          <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} strokeWidth={2.5} />
        </button>

        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white font-bold px-2 py-1 rounded-md border border-white/20 shadow-lg flex items-center gap-1 text-sm">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {rating}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow relative z-10 bg-gradient-to-t from-surface to-transparent">
        <h3 className="font-bold text-lg text-textPrimary leading-tight mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {movieGenres.map((genre, idx) => (
            <span key={idx} className="glass-badge line-clamp-1 px-2 py-0.5 text-[10px]">
              {genre}
            </span>
          ))}
        </div>
        
        <div className="mt-auto flex justify-between items-center text-sm text-textSecondary">
          <span>{year}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
