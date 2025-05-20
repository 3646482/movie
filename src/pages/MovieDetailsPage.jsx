import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, getImageUrl, formatDate, formatRuntime } from '../services/api';
import { ArrowLeft, Star, Play, Calendar, Clock, DollarSign, TrendingUp } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError('Failed to fetch movie details. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const trailerVideo = movie?.videos?.results.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      {isLoading ? (
        <div className="flex justify-center items-center h-[70vh]">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-12">
          <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
          <Link 
            to="/" 
            className="inline-flex items-center mt-4 text-indigo-600 dark:text-indigo-400"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </div>
      ) : movie ? (
        <>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
            {movie.backdrop_path ? (
              <img
                src={getImageUrl(movie.backdrop_path, 'original')}
                alt={`${movie.title} backdrop`}
                className="w-full h-[50vh] md:h-[70vh] object-cover"
              />
            ) : (
              <div className="w-full h-[50vh] md:h-[70vh] bg-gray-800"></div>
            )}
            
            <div className="container mx-auto px-4 relative z-10 -mt-72 md:-mt-80 pb-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0 w-64 mx-auto md:mx-0">
                  <img
                    src={getImageUrl(movie.poster_path, 'w500')}
                    alt={`${movie.title} poster`}
                    className="w-full h-auto rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/500x750?text=No+Image+Available';
                    }}
                  />
                </div>
                
                <div className="text-white space-y-4 md:pt-24">
                  <Link 
                    to="/" 
                    className="inline-flex items-center text-gray-300 hover:text-white mb-2"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                  </Link>
                  
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{movie.title}</h1>
                  
                  {movie.tagline && (
                    <p className="text-gray-300 italic">{movie.tagline}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="bg-yellow-500 text-gray-900 rounded-full px-3 py-1 font-bold flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      {movie.vote_average.toFixed(1)}
                    </span>
                    
                    {movie.release_date && (
                      <span className="bg-gray-800 text-gray-100 rounded-full px-3 py-1 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(movie.release_date)}
                      </span>
                    )}
                    
                    {movie.runtime && (
                      <span className="bg-gray-800 text-gray-100 rounded-full px-3 py-1 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatRuntime(movie.runtime)}
                      </span>
                    )}
                    
                    {movie.status && (
                      <span className="bg-gray-800 text-gray-100 rounded-full px-3 py-1">
                        {movie.status}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {movie.genres?.map((genre) => (
                      <span 
                        key={genre.id} 
                        className="bg-indigo-600 text-white rounded-full px-3 py-1 text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                  
                  {trailerVideo && (
                    <a
                      href={`https://www.youtube.com/watch?v=${trailerVideo.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors mt-4"
                    >
                      <Play className="mr-2 h-5 w-5" fill="currentColor" /> Watch Trailer
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {movie.overview || 'No overview available.'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Details</h3>
                  <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <DollarSign className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400 mt-0.5" />
                      <span>
                        <strong>Budget:</strong> {formatCurrency(movie.budget)}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <TrendingUp className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400 mt-0.5" />
                      <span>
                        <strong>Revenue:</strong> {formatCurrency(movie.revenue)}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Calendar className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400 mt-0.5" />
                      <span>
                        <strong>Release Date:</strong> {formatDate(movie.release_date)}
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Cast</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {movie.credits?.cast.slice(0, 6).map((actor) => (
                      <div key={actor.id} className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600 flex-shrink-0">
                          {actor.profile_path ? (
                            <img
                              src={getImageUrl(actor.profile_path, 'w185')}
                              alt={actor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="flex-grow overflow-hidden">
                          <p className="text-gray-900 dark:text-white font-medium text-sm truncate">
                            {actor.name}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-xs truncate">
                            {actor.character}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg">
            Movie not found
          </div>
          <Link 
            to="/" 
            className="inline-flex items-center mt-4 text-indigo-600 dark:text-indigo-400"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;