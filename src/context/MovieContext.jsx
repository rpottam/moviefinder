import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { tmdbApi } from '../services/tmdb';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthContext';


const MovieContext = createContext();

export const useMovies = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const { user } = useAuth();

  
  // Filters
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minYear, setMinYear] = useState('');
  const [contentType, setContentType] = useState('trending'); // trending, new, classics, top_rated, bookmarks



  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounced Search Query Tracking (Moved up to fix initialization order)
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [debouncedYear, setDebouncedYear] = useState(minYear);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedYear(minYear);
    }, 400);
    return () => clearTimeout(timer);
  }, [minYear]);


  useEffect(() => {
    // Fetch genres on mount
    tmdbApi.getGenres()
      .then(data => setGenres(data.genres))
      .catch(err => console.error("Error fetching genres:", err));
  }, []);

  // Sync Bookmarks from Firestore
  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      return;
    }

    const docRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setBookmarks(doc.data().bookmarks || []);
      } else {
        setBookmarks([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const toggleBookmark = async (movie) => {
    if (!user) {
      alert("Please login to bookmark movies");
      return;
    }

    const isBookmarked = bookmarks.some(b => b.id === movie.id);
    const previousBookmarks = [...bookmarks];

    // Optimistic Update
    if (isBookmarked) {
      setBookmarks(prev => prev.filter(b => b.id !== movie.id));
    } else {
      setBookmarks(prev => [...prev, movie]);
    }

    try {
      const docRef = doc(db, 'users', user.uid);
      if (isBookmarked) {
        await updateDoc(docRef, {
          bookmarks: arrayRemove(movie)
        });
      } else {
        const userDoc = await getDoc(docRef);
        if (!userDoc.exists()) {
          await setDoc(docRef, { bookmarks: [movie] });
        } else {
          await updateDoc(docRef, {
            bookmarks: arrayUnion(movie)
          });
        }
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      // Rollback on failure
      setBookmarks(previousBookmarks);
      alert("Failed to update bookmark. Please try again.");
    }

  };

  const fetchMovies = useCallback(async (resetPage = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const currentPage = resetPage ? 1 : page;
      if (resetPage) setPage(1);

      let data;
      if (debouncedSearch.trim()) {
        data = await tmdbApi.searchMovies(debouncedSearch, currentPage);
      } else {

        const genreStr = selectedGenres.join(',');
        
        // Base options for discovery
        const baseOptions = {
          with_genres: genreStr,
          with_original_language: selectedLanguage,
          page: currentPage,
          sort_by: 'popularity.desc',
          include_adult: 'false',
          ...(debouncedYear && { primary_release_year: debouncedYear })
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
          case 'bookmarks':
            // Bookmarks are local to state, no TMDb call needed
            // But we simulate the data structure
            data = {
              results: bookmarks,
              total_pages: 1
            };
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
  }, [debouncedSearch, selectedLanguage, selectedGenres, page, contentType, bookmarks, debouncedYear]);



  useEffect(() => {
    fetchMovies(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedLanguage, selectedGenres, debouncedYear, contentType]);






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
    setMinYear('');
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
      minYear,
      setMinYear,
      contentType,
      setContentType,
      clearFilters,

      bookmarks,
      toggleBookmark,
      loadMore,
      hasMore: page < totalPages


    }}>

      {children}
    </MovieContext.Provider>
  );
};
