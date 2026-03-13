import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { tmdbApi } from '../services/tmdb';

const MovieContext = createContext();

export const useMovies = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [contentType, setContentType] = useState('trending'); // trending, new, classics, top_rated

  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Fetch genres on mount
    tmdbApi.getGenres()
      .then(data => setGenres(data.genres))
      .catch(err => console.error("Error fetching genres:", err));
  }, []);

  const fetchMovies = useCallback(async (resetPage = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const currentPage = resetPage ? 1 : page;
      if (resetPage) setPage(1);

      let data;
      if (searchQuery.trim()) {
        data = await tmdbApi.searchMovies(searchQuery, currentPage);
      } else {
        const genreStr = selectedGenres.join(',');
        
        // Base options for discovery
        const baseOptions = {
          with_genres: genreStr,
          with_original_language: selectedLanguage,
          page: currentPage,
          sort_by: 'popularity.desc',
          include_adult: 'false'
        };

        // If we have filters (genres/language), trending often needs to fallback 
        // to discovery because TMDb trending endpoint doesn't support those filters.
        const hasFilters = selectedGenres.length > 0 || selectedLanguage !== '';

        switch (contentType) {
          case 'top_rated':
            // Using discover instead of /movie/top_rated for better filter compatibility
            data = await tmdbApi.discoverMovies({
              ...baseOptions,
              sort_by: 'vote_average.desc',
              'vote_count.gte': 500 // Threshold for quality
            });
            break;
          case 'new':
            const today = new Date().toISOString().split('T')[0];
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 60); // 2 months for better volume
            const startDate = thirtyDaysAgo.toISOString().split('T')[0];
            
            data = await tmdbApi.discoverMovies({
              ...baseOptions,
              'primary_release_date.gte': startDate,
              'primary_release_date.lte': today,
              sort_by: 'primary_release_date.desc'
            });
            break;
          case 'classics':
            data = await tmdbApi.discoverMovies({
              ...baseOptions,
              'primary_release_date.lte': '1995-01-01',
              'vote_count.gte': 1000,
              sort_by: 'vote_average.desc'
            });
            break;
          case 'trending':
          default:
            if (hasFilters) {
              // Fallback to popularity discovery if genres/langs are selected
              data = await tmdbApi.discoverMovies(baseOptions);
            } else {
              data = await tmdbApi.getTrending('movie', 'day', currentPage);
            }
            break;
        }
      }



      if (resetPage) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedLanguage, selectedGenres, page]);

  useEffect(() => {
    fetchMovies(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedLanguage, selectedGenres, contentType]);


  const loadMore = () => {
    if (page < totalPages && !isLoading) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchMovies(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const toggleGenre = (genreId) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };


  const clearFilters = () => {
    setSelectedLanguage('');
    setSelectedGenres([]);
    setSearchQuery('');
    setContentType('trending');
  };


  return (
    <MovieContext.Provider value={{
      movies,
      genres,
      isLoading,
      error,
      searchQuery,
      setSearchQuery,
      selectedLanguage,
      setSelectedLanguage,
      selectedGenres,
      toggleGenre,
      contentType,
      setContentType,
      clearFilters,
      loadMore,
      hasMore: page < totalPages

    }}>

      {children}
    </MovieContext.Provider>
  );
};
