import React, { useState, useEffect } from 'react';
import { tmdbApi } from '../services/tmdb';
import { watchmodeApi } from '../services/watchmode';

const MovieDetailsModal = ({ movie, onClose }) => {
  const [details, setDetails] = useState(null);
  const [streamingOptions, setStreamingOptions] = useState(null);
  const [watchmodeDetails, setWatchmodeDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);


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
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-[#09090b] rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col md:flex-row animate-[fadeInUp_0.6s_ease-out]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-black/80 hover:scale-110 transition-all duration-300"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Poster / Backdrop section (Left Side on Desktop, Top on Mobile) */}
        <div className="md:w-[45%] relative bg-black shrink-0">
          {backdropUrl && (
            <div className="absolute inset-0 opacity-40">
              <img src={backdropUrl} alt="Backdrop" className="w-full h-full object-cover blur-[2px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/20 to-transparent" />
            </div>
          )}
          
          {posterUrl ? (
             <div className="relative z-10 w-full h-full flex items-center justify-center p-8 md:p-12">
               <img 
                 src={posterUrl} 
                 alt={movie.title} 
                 className="w-full max-w-[340px] object-cover shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] rounded-2xl transform hover:scale-[1.02] transition-transform duration-700"
               />
             </div>
          ) : (
             <div className="w-full h-full flex items-center justify-center text-white/50 bg-white/5">No Poster</div>
          )}
        </div>

        {/* Content Section (Right Side) */}
        <div className="w-full md:w-[55%] flex flex-col overflow-y-auto no-scrollbar relative z-20 bg-gradient-to-br from-[#0f1115] to-[#09090b] border-l border-white/5">
          
          {isLoading ? (
            <div className="p-12 space-y-8">
               <div className="space-y-3">
                 <div className="h-12 w-3/4 bg-white/10 rounded-xl animate-pulse" />
                 <div className="h-6 w-1/4 bg-white/5 rounded-lg animate-pulse" />
               </div>
               <div className="flex gap-3"><div className="h-8 w-24 bg-white/5 rounded-full animate-pulse" /><div className="h-8 w-24 bg-white/5 rounded-full animate-pulse" /></div>
               <div className="space-y-3 mt-12">
                 <div className="h-4 w-full bg-white/[0.03] rounded-md animate-pulse" />
                 <div className="h-4 w-full bg-white/[0.03] rounded-md animate-pulse" />
                 <div className="h-4 w-2/3 bg-white/[0.03] rounded-md animate-pulse" />
               </div>
            </div>
          ) : (
            <div className="p-8 md:p-12 flex flex-col h-full">
              {/* Header Info */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                   <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase font-black tracking-[0.2em]">Featured Release</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-[1.1] tracking-tight font-heading">
                  {movie.title}
                </h2>
                
                <div className="flex flex-wrap items-center gap-4 text-sm font-bold mb-8">
                   <span className="text-textSecondary/60 bg-white/5 px-2 py-1 rounded border border-white/5">
                     {year}
                   </span>
                   {details?.runtime > 0 && (
                     <span className="text-textSecondary/60 bg-white/5 px-2 py-1 rounded border border-white/5">
                       {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
                     </span>
                   )}
                   <div className="flex gap-2">
                    {details?.genres?.slice(0, 3).map(g => (
                      <span key={g.id} className="text-primary/70 font-black text-[10px] uppercase tracking-widest border-b border-primary/20 pb-0.5">
                        {g.name}
                      </span>
                    ))}
                   </div>
                </div>

                {/* Ratings */}
                <div className="grid grid-cols-2 gap-4 max-w-sm mb-8">
                  <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                    <div className="text-xs text-textSecondary uppercase tracking-widest mb-1 font-bold opacity-50">TMDb Score</div>
                    <div className="text-2xl font-black text-white">{tmdbRating || 'NR'}</div>
                  </div>
                  {imdbRating && (
                    <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                      <div className="text-xs text-textSecondary uppercase tracking-widest mb-1 font-bold opacity-50">IMDb Rating</div>
                      <div className="text-2xl font-black text-yellow-500">{imdbRating}</div>
                    </div>
                  )}
                </div>

                {/* Trailer Button */}
                {details?.videos?.results?.some(v => v.type === 'Trailer' && v.site === 'YouTube') && (
                  <button 
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-primary hover:text-white transition-all duration-300 shadow-xl shadow-white/5"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Watch Trailer
                  </button>
                )}
              </div>

              {/* Trailer Player Overlay */}
              {showTrailer && details?.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube') && (
                <div className="fixed inset-0 z-[110] bg-black flex items-center justify-center p-4">
                  <button 
                    onClick={() => setShowTrailer(false)}
                    className="absolute top-6 right-6 z-[120] w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.3)] border border-white/10">
                    <iframe 
                      src={`https://www.youtube.com/embed/${details.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube').key}?autoplay=1`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Tagline & Synopsis */}
              {details?.tagline && (
                <p className="italic text-textSecondary mb-4 pb-4 border-b border-white/5 font-medium">
                  "{details.tagline}"
                </p>
              )}
              
              <div className="mb-10">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-textSecondary opacity-50 mb-3">Overview</h3>
                <p className="text-textSecondary leading-[1.8] text-sm md:text-base font-medium">
                  {details?.overview || movie.overview || "No overview available."}
                </p>
              </div>


              {/* OTT Streaming Sources */}
              <div className="mt-auto pt-8 border-t border-white/5">
                <h3 className="text-xs font-black text-textSecondary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                   Available to Stream
                   <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded tracking-normal font-bold lowercase">us region</span>
                </h3>
                
                {!streamingOptions ? (
                  <div className="flex gap-4">
                    <div className="h-12 w-32 bg-white/5 rounded-xl animate-pulse" />
                    <div className="h-12 w-32 bg-white/5 rounded-xl animate-pulse" />
                  </div>
                ) : streamingOptions.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {streamingOptions.map((source, idx) => (
                      <a 
                        key={idx}
                        href={source.web_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/5 border border-white/10 flex items-center justify-between py-3 px-4 rounded-xl group hover:bg-primary transition-all duration-300 hover:border-primary hover:-translate-y-1"
                      >
                        <span className="text-sm font-bold text-white group-hover:text-white line-clamp-1">{source.name}</span>
                        <svg className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-2xl p-6 text-center">
                    <p className="text-textSecondary text-sm font-medium">No direct streaming matches found for your region.</p>
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
