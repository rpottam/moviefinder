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
      className="glass-card flex flex-col h-full cursor-pointer group active:scale-[0.98] transition-all duration-500 ease-out"
      onClick={() => onClick(movie)}
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-black/20">
        {posterUrl ? (
          <img 
            src={posterUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-textSecondary text-xs font-medium bg-white/5">
            NO POSTER
          </div>
        )}

        {/* Bookmark Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(movie);
          }}
          className={`absolute top-3 left-3 p-2.5 rounded-full backdrop-blur-xl transition-all duration-300 z-20 ${
            isBookmarked 
              ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/40' 
              : 'bg-black/40 text-white/50 hover:bg-black/60 hover:text-white border border-white/10'
          }`}
        >
          <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} strokeWidth={2.5} />
        </button>

        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white font-bold px-2 py-1 rounded-lg border border-white/10 shadow-xl flex items-center gap-1 text-[10px] tracking-wider">
          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {rating}
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <div className="p-4 flex flex-col flex-grow bg-[#0f1115]/80 backdrop-blur-sm border-t border-white/5">
        <h3 className="font-bold text-base text-white leading-snug mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {movie.title}
        </h3>
        
        <div className="flex flex-wrap gap-1.5 mb-3">
          {movieGenres.map((genre, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-[9px] uppercase tracking-wider text-textSecondary font-bold">
              {genre}
            </span>
          ))}
        </div>
        
        <div className="mt-auto flex justify-between items-center">
          <span className="text-[11px] font-bold text-textSecondary tracking-widest">{year}</span>
          <div className="h-1 w-1 rounded-full bg-primary/40 group-hover:scale-[3] transition-transform duration-500" />
        </div>
      </div>
    </div>

  );
};

export default MovieCard;
