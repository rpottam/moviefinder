const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const tmdbApi = {
  async getGenres() {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`);
    if (!response.ok) throw new Error('Failed to fetch genres');
    return response.json();
  },

  async getTrending(type = 'movie', timeWindow = 'day', page = 1) {
    const response = await fetch(`${BASE_URL}/trending/${type}/${timeWindow}?api_key=${TMDB_API_KEY}&page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch trending');
    return response.json();
  },

  async getTopRated({ page = 1, ...otherParams } = {}) {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'en-US',
      page: page.toString(),
      ...otherParams
    });
    const response = await fetch(`${BASE_URL}/movie/top_rated?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch top rated');
    return response.json();
  },

  async getNewReleases({ page = 1, ...otherParams } = {}) {
    // We can use discover with a date range for recent releases
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];

    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'en-US',
      sort_by: 'primary_release_date.desc',
      'primary_release_date.gte': startDate,
      'primary_release_date.lte': today,
      page: page.toString(),
      ...otherParams
    });
    const response = await fetch(`${BASE_URL}/discover/movie?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch new releases');
    return response.json();
  },


  async discoverMovies(options = {}) {
    const { page = 1, ...rest } = options;
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'en-US',
      page: page.toString(),
      ...rest
    });

    const response = await fetch(`${BASE_URL}/discover/movie?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to discover movies');
    return response.json();
  },

  async searchMovies(query, page = 1) {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'en-US',
      query,
      page: page.toString(),
      include_adult: 'false',
    });

    const response = await fetch(`${BASE_URL}/search/movie?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to search movies');
    return response.json();
  },


  async getMovieDetails(id) {
    // Also appending videos and credits
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,similar`);
    if (!response.ok) throw new Error('Failed to fetch movie details');
    return response.json();
  },
  
  getImageUrl(path, size = 'w500') {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
};
