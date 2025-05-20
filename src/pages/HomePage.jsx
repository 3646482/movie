import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPopularMovies } from '../services/api';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowRight } from 'lucide-react';

const HomePage = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getPopularMovies();
        setPopularMovies(data.results);
      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10"></div>
        <img
          src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Cinema background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="container mx-auto px-4 h-full flex items-center relative z-20">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Discover Amazing Movies
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200">
              Find the latest and greatest films, get information about your favorites, 
              and keep track of what to watch next
            </p>
            <Link 
              to="/movies/popular" 
              className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Explore Movies <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg my-6">
            {error}
          </div>
        ) : (
          <>
            <MovieGrid 
              title="Popular Movies" 
              movies={popularMovies.slice(0, 10)} 
              viewAllLink="/movies/popular"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;