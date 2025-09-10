"use client";

import { useState } from "react";
import {
  useDiscoverPopularMovies,
  useMovieSearch,
} from "../../hooks/useMovies";
import { MovieSection } from "../../components/MovieSection";
import { LoadingSpinner, ErrorMessage } from "../../components/LoadingSpinner";
import { MovieModal } from "../../components/MovieModal";
import { SearchBar } from "../../components/SearchBar";
import { Movie } from "../../types/movie";

export default function Home() {
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    movies: popularMovies,
    loading,
    loadingMore,
    error,
    hasMore,
    refresh,
  } = useDiscoverPopularMovies();

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading: searchLoading,
    error: searchError,
    clearSearch,
    isSearching,
  } = useMovieSearch();

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovieId(movie.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovieId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner size="lg" text="Carregando filmes..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message={error} onRetry={refresh} />
        </div>
      </div>
    );
  }

  const PageHeaderComponent = () => {
    return (
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          TMDB Explorer
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Descubra os melhores filmes do mundo !
        </p>
      </header>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <PageHeaderComponent />

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={clearSearch}
          loading={searchLoading}
          placeholder="Buscar filmes..."
        />

        <main>
          {isSearching ? (
            <>
              {searchError && (
                <div className="mb-8">
                  <ErrorMessage
                    message={searchError}
                    onRetry={() => setSearchQuery(searchQuery)}
                  />
                </div>
              )}

              {searchResults.length > 0 ? (
                <MovieSection
                  title={`Resultados da busca`}
                  movies={searchResults}
                  onMovieClick={handleMovieClick}
                />
              ) : (
                !searchLoading &&
                searchQuery.trim() && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      Nenhum filme encontrado para &ldquo;{searchQuery}&rdquo;
                    </p>
                  </div>
                )
              )}
            </>
          ) : (
            <>
              <MovieSection
                title="Filmes Populares"
                movies={popularMovies}
                onMovieClick={handleMovieClick}
              />

              {loadingMore && (
                <div className="text-center mt-8">
                  <LoadingSpinner size="md" text="Carregando mais filmes..." />
                </div>
              )}

              {!hasMore && popularMovies.length > 0 && (
                <div className="text-center mt-8 py-8">
                  <div className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      Não existe mais filmes disponíveis!
                    </span>
                  </div>
                </div>
              )}

              {hasMore && !loadingMore && popularMovies.length > 0 && (
                <div className="text-center mt-8 py-4">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Role para baixo para carregar mais filmes automaticamente
                  </p>
                </div>
              )}
            </>
          )}
        </main>

        {isModalOpen && selectedMovieId && (
          <MovieModal
            movieId={selectedMovieId}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}
