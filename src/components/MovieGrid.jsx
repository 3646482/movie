import React from 'react';
import MovieCard from './MovieCard';
import { ChevronRight } from 'lucide-react';

const MovieGrid = ({ 
  title, 
  movies, 
  isLoading = false, 
  error = null,
  viewAllLink
}) => {
  const renderSkeletons = () => {
    return Array(8).fill(0).map((_, index) => (
      <div key={`skeleton-${index}`} className="bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow animate-pulse">
        <div className="aspect-[2/3] bg-gray-300 dark:bg-gray-600"></div>
        <div className="p-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    ));
  };

  return (
    <section className="py-6">
      {title && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          {viewAllLink && (
            <a 
              href={viewAllLink}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          )}
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {isLoading 
          ? renderSkeletons() 
          : movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))
        }
      </div>
      
      {!isLoading && movies.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No movies found</p>
        </div>
      )}
    </section>
  );
};

export default MovieGrid;