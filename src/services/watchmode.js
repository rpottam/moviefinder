const WATCHMODE_API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY;
const BASE_URL = 'https://api.watchmode.com/v1';

export const watchmodeApi = {
  async getTitleDetails(tmdbId) {
    // Watchmode supports querying by TMDB ID directly using "movie-" prefix
    const titleId = `movie-${tmdbId}`;
    const params = new URLSearchParams({
      apiKey: WATCHMODE_API_KEY,
      append_to_response: 'sources',
    });

    try {
      const response = await fetch(`${BASE_URL}/title/${titleId}/details/?${params.toString()}`);
      if (!response.ok) {
        console.warn('Watchmode API failed to fetch details for', titleId);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Watchmode API error:', error);
      return null;
    }
  },

  async getStreamingSources(tmdbId) {
    // Get streaming sources for a specific title in the US
    const titleId = `movie-${tmdbId}`;
    const params = new URLSearchParams({
      apiKey: WATCHMODE_API_KEY,
      regions: 'US',
    });

    try {
      const response = await fetch(`${BASE_URL}/title/${titleId}/sources/?${params.toString()}`);
      if (!response.ok) {
         console.warn('Watchmode API failed to fetch sources for', titleId);
         return [];
      }
      const data = await response.json();
      // Ensure data is array or handle error
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Watchmode API error for sources:', error);
      return [];
    }
  }
};
