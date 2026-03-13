import React, { useState, useEffect } from 'react';
import { tmdbApi } from '../services/tmdb';
import { watchmodeApi } from '../services/watchmode';

const MovieDetailsModal = ({ movie, onClose }) => {
  const [details, setDetails] = useState(null);
  const [streamingOptions, setStreamingOptions] = useState(null);
  const [watchmodeDetails, setWatchmodeDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch TMDb full details
        const tmdbData = await tmdbApi.getMovieDetails(movie.id);
        setDetails(tmdbData);

        // Fetch Watchmode OTT data using TMDb ID
        const watchmodeData = await watchmodeApi.getTitleDetails(movie.id);
        if (watchmodeData) {
           setWatchmodeDetails(watchmodeData);
        }

        const sources = await watchmodeApi.getStreamingSources(movie.id);
        if (sources) {
           // Deduplicate streaming options by name
           const uniqueSources = Array.from(new Map(sources.map(s => [s.name, s])).values());
           setStreamingOptions(uniqueSources);
        }
      } catch (error) {
        console.error("Error fetching detailed information", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllDetails();
    
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [movie.id]);

  if (!movie) return null;

  const backdropUrl = details?.backdrop_path || movie.backdrop_path 
    ? tmdbApi.getImageUrl(details?.backdrop_path || movie.backdrop_path, 'w1280')
    : null;

  const posterUrl = tmdbApi.getImageUrl(movie.poster_path);
  const year = movie.release_date?.substring(0, 4);

  // Ratings
  const tmdbRating = details?.vote_average ? `${(details.vote_average * 10).toFixed(0)}%` : null;
  const imdbRating = watchmodeDetails?.user_rating ? `${watchmodeDetails.user_rating}/10` : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
      {/* Overlay Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-full bg-background/95 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row shadow-primary/20 animate-fade-in-up">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Poster / Backdrop section (Left Side on Desktop, Top on Mobile) */}
        <div className="md:w-[40%] relative min-h-[300px] md:min-h-[600px] bg-black">
          {backdropUrl && (
            <div className="absolute inset-0 md:hidden opacity-50">
              <img src={backdropUrl} alt="Backdrop" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
          )}
          
          {posterUrl ? (
             <img 
               src={posterUrl} 
               alt={movie.title} 
               className="relative z-10 w-[60%] sm:w-1/2 md:w-full md:h-full mx-auto mt-12 md:mt-0 object-cover shadow-2xl rounded-lg md:rounded-none"
             />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-white/50 bg-white/5">No Poster</div>
          )}
        </div>

        {/* Content Section (Right Side) */}
        <div className="w-full md:w-[60%] flex flex-col h-full overflow-y-auto relative z-20">
          
          {isLoading ? (
            <div className="p-8 space-y-4">
               <div className="h-10 w-3/4 skeleton-loader" />
               <div className="flex gap-2"><div className="h-6 w-20 skeleton-loader" /><div className="h-6 w-20 skeleton-loader" /></div>
               <div className="h-32 w-full skeleton-loader mt-6" />
               <div className="h-6 w-40 skeleton-loader mt-8" />
               <div className="flex gap-4 mt-4"><div className="h-12 w-32 skeleton-loader rounded-lg" /><div className="h-12 w-32 skeleton-loader rounded-lg" /></div>
            </div>
          ) : (
            <div className="p-6 md:p-8 flex flex-col h-full">
              {/* Header Info */}
              <div className="mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                  {movie.title} <span className="font-light text-white/50">({year})</span>
                </h2>
                
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium mb-4">
                   {details?.runtime > 0 && (
                     <span className="text-primary bg-primary/10 px-2 py-1 rounded-md">
                       {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
                     </span>
                   )}
                   {details?.genres?.map(g => (
                     <span key={g.id} className="text-textSecondary/80 border border-white/10 px-2 py-1 rounded-full text-xs">
                       {g.name}
                     </span>
                   ))}
                </div>

                {/* Ratings */}
                <div className="flex gap-6 items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-white">{tmdbRating || 'NR'}</span>
                    <span className="text-xs text-textSecondary uppercase tracking-wider">TMDb</span>
                  </div>
                  {imdbRating && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-yellow-500">{imdbRating}</span>
                      <span className="text-xs text-textSecondary uppercase tracking-wider bg-yellow-500/10 px-1.5 py-0.5 rounded text-yellow-600 font-bold border border-yellow-500/20">IMDb</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tagline & Synopsis */}
              {details?.tagline && (
                <p className="italic text-textSecondary mb-4 pb-4 border-b border-white/5">
                  "{details.tagline}"
                </p>
              )}
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-2">Overview</h3>
                <p className="text-textSecondary leading-relaxed text-sm md:text-base">
                  {details?.overview || movie.overview || "No overview available."}
                </p>
              </div>

              {/* OTT Streaming Sources */}
              <div className="mt-auto">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                   <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   Where to Watch <span className="text-xs text-textSecondary font-normal bg-white/10 px-2 py-1 rounded">(USA)</span>
                </h3>
                
                {!streamingOptions ? (
                  <p className="text-textSecondary text-sm italic">Loading streaming options...</p>
                ) : streamingOptions.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {streamingOptions.map((source, idx) => (
                      <a 
                        key={idx}
                        href={source.web_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-button-secondary flex items-center justify-center gap-2 py-2.5 px-3 group"
                      >
                        <span className="text-sm font-semibold text-white/80 group-hover:text-white line-clamp-1">{source.name}</span>
                        <svg className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                    <p className="text-textSecondary text-sm">No streaming options found in the US currently.</p>
                  </div>
                )}
              </div>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
