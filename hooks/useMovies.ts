"use client";

import { useState, useEffect, useCallback } from "react";
import { Movie, MovieResponse } from "../types/movie";
import { MovieService } from "../services/movie.service";
import { useDebounce } from "./useDebounce";

export const useDiscoverPopularMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchDiscoverPopularMovies = async (
    pageNumber: number,
    isLoadMore = false
  ) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response: MovieResponse = await MovieService.discoverPopularMovies(
        pageNumber
      );

      if (pageNumber === 1) {
        const uniqueMovies = response.results.filter(
          (movie, index, self) =>
            index === self.findIndex((m) => m.id === movie.id)
        );
        setMovies(uniqueMovies);
        console.log(
          `Página 1: ${response.results.length} filmes recebidos, ${uniqueMovies.length} filmes únicos`
        );
      } else {
        setMovies((prev) => {
          const existingIds = new Set(prev.map((movie) => movie.id));
          const newMovies = response.results.filter(
            (movie) => !existingIds.has(movie.id)
          );

          return [...prev, ...newMovies];
        });
      }

      setHasMore(pageNumber < response.total_pages);
      setPage(pageNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      fetchDiscoverPopularMovies(page + 1, true);
    }
  }, [loading, loadingMore, hasMore, page]);

  const refresh = () => {
    setPage(1);
    fetchDiscoverPopularMovies(1);
  };

  // Scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  useEffect(() => {
    fetchDiscoverPopularMovies(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    movies,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};

export const useMovieSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const searchMovies = async (
    query: string,
    pageNumber: number = 1,
    isLoadMore = false
  ) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasMore(false);
      return;
    }

    try {
      if (!isLoadMore) {
        setLoading(true);
      }
      setError(null);

      const response: MovieResponse = await MovieService.searchMovies(
        query,
        pageNumber
      );

      if (pageNumber === 1) {
        setSearchResults(response.results);
      } else {
        setSearchResults((prev) => {
          const existingIds = new Set(prev.map((movie) => movie.id));
          const newMovies = response.results.filter(
            (movie) => !existingIds.has(movie.id)
          );
          return [...prev, ...newMovies];
        });
      }

      setHasMore(pageNumber < response.total_pages);
      setPage(pageNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro na busca");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
      setPage(1);
      searchMovies(debouncedSearchQuery, 1);
    } else {
      setSearchResults([]);
      setError(null);
      setHasMore(false);
    }
  }, [debouncedSearchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
    setPage(1);
    setHasMore(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading,
    error,
    hasMore,
    clearSearch,
    isSearching: !!(debouncedSearchQuery && debouncedSearchQuery.trim()),
  };
};
