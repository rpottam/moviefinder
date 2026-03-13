import React from 'react';
import { useMovies } from '../context/MovieContext';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';
import ContentFilters from './ContentFilters';


const MovieList = ({ onMovieSelect }) => {
  const { movies, genres, isLoading, error, loadMore, hasMore } = useMovies();

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="glass-card p-6 text-center text-red-400 max-w-md w-full border-red-500/30">
          <svg className="w-12 h-12 mx-auto mb-4 text-red-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold mb-2">Oops! Something went wrong</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Generate 12 skeleton cards for loading layout
  const Skeletons = Array.from({ length: 12 }).map((_, idx) => (
    <SkeletonCard key={`skeleton-${idx}`} />
  ));

  return (
    <div className="flex-1 py-6 px-4 md:px-8">
      <ContentFilters />
      {movies.length === 0 && !isLoading ? (

        <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center">
          <svg className="w-20 h-20 text-white/10 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <h2 className="text-2xl font-semibold text-textPrimary mb-2">No Movies Found</h2>
          <p className="text-textSecondary max-w-md">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {movies.map((movie, idx) => (
              <MovieCard 
                key={`${movie.id}-${idx}`} 
                movie={movie} 
                genres={genres} 
                onClick={onMovieSelect}
              />
            ))}
            {isLoading && Skeletons}
          </div>
          
          {hasMore && !isLoading && movies.length > 0 && (
            <div className="mt-12 flex justify-center">
              <button 
                onClick={loadMore}
                className="glass-button w-full max-w-xs py-3"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MovieList;
