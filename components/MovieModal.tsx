"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MovieDetails } from "../types/movie";
import { MovieService } from "../services/movie.service";
import { LoadingSpinner } from "./LoadingSpinner";

export interface MovieModalProps {
  movieId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({
  movieId,
  isOpen,
  onClose,
}) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const details = await MovieService.getMovieDetails(movieId);
        setMovie(details);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar detalhes"
        );
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && movieId) {
      fetchMovieDetails();
    }
  }, [isOpen, movieId]);

  const retryFetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const details = await MovieService.getMovieDetails(movieId);
      setMovie(details);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar detalhes"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full transition-all"
        >
          ✕
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          {loading && (
            <div className="p-8">
              <LoadingSpinner size="lg" text="Carregando detalhes..." />
            </div>
          )}

          {error && (
            <div className="p-8 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={retryFetch}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {movie && (
            <>
              {/* Backdrop Image */}
              {movie.backdrop_path && (
                <div className="relative h-64 md:h-80">
                  <Image
                    src={MovieService.getImageUrl(movie.backdrop_path, "w1280")}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                      {movie.title}
                    </h1>
                    {movie.tagline && (
                      <p className="text-lg italic opacity-90">
                        {movie.tagline}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Poster */}
                  <div className="md:col-span-1">
                    <div className="relative aspect-[2/3] w-full max-w-sm mx-auto">
                      <Image
                        src={MovieService.getImageUrl(movie.poster_path)}
                        alt={movie.title}
                        fill
                        className="object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Sinopse
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {movie.overview}
                      </p>
                    </div>

                    {/* Movie Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Avaliação
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          ⭐ {movie.vote_average.toFixed(1)}/10 (
                          {movie.vote_count.toLocaleString("pt-BR")} votos)
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Lançamento
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {formatDate(movie.release_date)}
                        </p>
                      </div>

                      {movie.runtime > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Duração
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {formatRuntime(movie.runtime)}
                          </p>
                        </div>
                      )}

                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Status
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {movie.status}
                        </p>
                      </div>

                      {movie.budget > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Orçamento
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {formatCurrency(movie.budget)}
                          </p>
                        </div>
                      )}

                      {movie.revenue > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Receita
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {formatCurrency(movie.revenue)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Genres */}
                    {movie.genres && movie.genres.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Gêneros
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {movie.genres.map((genre) => (
                            <span
                              key={genre.id}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Production Companies */}
                    {movie.production_companies &&
                      movie.production_companies.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Produtoras
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {movie.production_companies.map((company) => (
                              <span
                                key={company.id}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                              >
                                {company.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
