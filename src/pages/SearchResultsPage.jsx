import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchMovies } from '../services/api';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  
  const observer = useRef(null);
  const loadMoreRef = useRef(null);

  const fetchMovies = useCallback(async (currentPage, isNextPage = false) => {
    if (!query) return;
    
    try {
      isNextPage ? setIsLoadingMore(true) : setIsLoading(true);
      setError(null);
      
      const data = await searchMovies({ query, page: currentPage });
      
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
  }, [query]);

  useEffect(() => {
    setPage(1);
    setMovies([]);
    fetchMovies(1);
  }, [query, fetchMovies]);

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
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            {query ? `Search results for "${query}"` : 'Search Results'}
          </h1>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        ) : movies.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No results found for "{query}"
            </p>
            <p className="mt-2 text-gray-500 dark:text-gray-500">
              Try a different search term or browse popular movies
            </p>
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

export default SearchResultsPage;