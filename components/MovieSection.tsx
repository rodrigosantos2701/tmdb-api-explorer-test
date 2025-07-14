"use client";

import { Movie } from "../types/movie";
import { MovieCard } from "./MovieCard";

export interface MovieSectionProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
  onMovieClick?: (movie: Movie) => void;
}

export const MovieSection: React.FC<MovieSectionProps> = ({
  title,
  movies,
  loading = false,
  onMovieClick,
}) => {
  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 dark:bg-gray-700 aspect-[2/3] rounded-lg mb-4"></div>
              <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded mb-2"></div>
              <div className="bg-gray-300 dark:bg-gray-700 h-3 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (movies.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {title}
        </h2>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum filme encontrado nesta seção.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
        ))}
      </div>
    </section>
  );
};
