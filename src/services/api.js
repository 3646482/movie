const API_KEY = '6978b1a7072c818776663280831ff30d';
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchFromAPI = async (endpoint, params = {}) => {
  const queryParams = new URLSearchParams({
    ...params,
    api_key: API_KEY
  });
  
  const url = `${BASE_URL}${endpoint}?${queryParams}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ status_message: 'Unknown error occurred' }));
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(errorData.status_message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch data from the API');
  }
};

export const getPopularMovies = async (params = {}) => {
  return fetchFromAPI('/movie/popular', {
    page: params.page?.toString() || '1'
  });
};

export const searchMovies = async (params) => {
  if (!params.query) {
    throw new Error('Query is required for search');
  }
  
  return fetchFromAPI('/search/movie', {
    query: params.query,
    page: params.page?.toString() || '1'
  });
};

export const getMovieDetails = async (id) => {
  return fetchFromAPI(`/movie/${id}`, {
    append_to_response: 'credits,videos'
  });
};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image+Available';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};