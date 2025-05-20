import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getPopularMovies } from '../services/api';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';

const PopularMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  
  const observer = useRef(null);
  const loadMoreRef = useRef(null);

  const fetchMovies = useCallback(async (currentPage, isNextPage = false) => {
    try {
      isNextPage ? setIsLoadingMore(true) : setIsLoading(true);
      setError(null);
      
      const data = await getPopularMovies({ page: currentPage });
      
      if (isNextPage) {
        setMovies((prev) => [...prev, ...data.results]);
      } else {
        setMovies(data.results);
      }
      
      setTotalPages(data.total_pages);
    } catch (err) {
      setError('Failed to fetch movies. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies(1);
  }, [fetchMovies]);

  useEffect(() => {
    const handleObserver = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && page < totalPages && !isLoadingMore && !isLoading) {
        setPage((prev) => {
          const nextPage = prev + 1;
          fetchMovies(nextPage, true);
          return nextPage;
        });
      }
    };

    observer.current = new IntersectionObserver(handleObserver, { threshold: 1.0 });
    
    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }
    
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [fetchMovies, isLoading, isLoadingMore, page, totalPages]);

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Popular Movies
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        ) : (
          <>
            <MovieGrid movies={movies} />
            
            <div ref={loadMoreRef} className="py-8 flex justify-center">
              {isLoadingMore && <LoadingSpinner />}
              {page >= totalPages && !isLoadingMore && (
                <p className="text-gray-500 dark:text-gray-400">No more results</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PopularMoviesPage;