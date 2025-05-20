import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { getImageUrl, formatDate } from '../services/api';

const MovieCard = ({ movie }) => {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={`${movie.title} poster`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/500x750?text=No+Image+Available';
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-sm line-clamp-3">{movie.overview}</p>
        </div>
        
        <div className="absolute top-2 right-2 bg-yellow-500 text-gray-900 rounded-full px-2 py-1 flex items-center text-sm font-bold">
          <Star className="w-4 h-4 mr-1 inline fill-current" />
          {movie.vote_average.toFixed(1)}
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col justify-between">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 mb-1">
          {movie.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {movie.release_date ? formatDate(movie.release_date) : 'Release date unknown'}
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;