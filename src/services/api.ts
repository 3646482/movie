import { Movie, MovieListParams, MovieSearchResponse } from '../types';

const API_KEY = '6978b1a7072c818776663280831ff30d';
const BASE_URL = 'https://api.themoviedb.org/3';

// Common fetch function with error handling
const fetchFromAPI = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
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

// Get popular movies
export const getPopularMovies = async (params: MovieListParams = {}): Promise<MovieSearchResponse> => {
  return fetchFromAPI<MovieSearchResponse>('/movie/popular', {
    page: params.page?.toString() || '1'
  });
};

// Search movies by query
export const searchMovies = async (params: MovieListParams): Promise<MovieSearchResponse> => {
  if (!params.query) {
    throw new Error('Query is required for search');
  }
  
  return fetchFromAPI<MovieSearchResponse>('/search/movie', {
    query: params.query,
    page: params.page?.toString() || '1'
  });
};

// Get movie details by ID
export const getMovieDetails = async (id: string): Promise<Movie> => {
  return fetchFromAPI<Movie>(`/movie/${id}`, {
    append_to_response: 'credits,videos'
  });
};

// Get image URL
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image+Available';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Format date to readable format
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Format runtime to hours and minutes
export const formatRuntime = (minutes: number | undefined): string => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};