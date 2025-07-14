"use client";

import Image from "next/image";
import { Movie } from "../types/movie";
import { MovieService } from "../services/movie.service";

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(movie);
    }
  };

  const formatRating = (rating: number | null | undefined): string => {
    if (!rating || isNaN(rating)) return "N/A";
    return rating.toFixed(1);
  };

  const formatYear = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";
    const year = new Date(dateString).getFullYear();
    return !isNaN(year) ? year.toString() : "N/A";
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl"
      onClick={handleClick}
    >
      <div className="relative aspect-[2/3] w-full">
        <Image
          src={MovieService.getImageUrl(movie.poster_path)}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-semibold">
          ⭐ {formatRating(movie.vote_average)}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white line-clamp-2">
          {movie.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          {formatYear(movie.release_date)}
        </p>

        <p className="text-sm text-gray-700 dark:text-gray-400 line-clamp-3">
          {movie.overview}
        </p>
      </div>
    </div>
  );
};
