import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/page";
import { SearchBarProps } from "../components/SearchBar";
import { MovieSectionProps } from "../components/MovieSection";
import { Movie } from "../types/movie";
import { MovieModalProps } from "../components/MovieModal";

import { useDiscoverPopularMovies, useMovieSearch } from "../hooks/useMovies";

// Mock dos hooks personalizados
jest.mock("@/hooks/useMovies");
const mockUseDiscoverPopularMovies =
  useDiscoverPopularMovies as jest.MockedFunction<
    typeof useDiscoverPopularMovies
  >;
const mockUseMovieSearch = useMovieSearch as jest.MockedFunction<
  typeof useMovieSearch
>;

// Mock dos componentes filhos
jest.mock("@/components/MovieSection", () => ({
  MovieSection: ({ title, movies, onMovieClick }: MovieSectionProps) => (
    <div data-testid="movie-section">
      <h2>{title}</h2>
      <div data-testid="movies-count">{movies.length} filmes</div>
      {movies.map((movie: Movie) => (
        <div
          key={movie.id}
          data-testid={`movie-${movie.id}`}
          onClick={() => onMovieClick?.(movie)}
        >
          {movie.title}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/components/SearchBar", () => ({
  SearchBar: ({
    value,
    onChange,
    onClear,
    loading,
    placeholder,
  }: SearchBarProps) => (
    <div data-testid="search-bar">
      <input
        data-testid="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {loading && <span data-testid="search-loading">Loading...</span>}
      {value && (
        <button data-testid="clear-button" onClick={onClear}>
          Clear
        </button>
      )}
    </div>
  ),
}));

jest.mock("@/components/MovieModal", () => ({
  MovieModal: ({ movieId, isOpen, onClose }: MovieModalProps) =>
    isOpen ? (
      <div data-testid="movie-modal">
        <span>Modal for movie {movieId}</span>
        <button data-testid="close-modal" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

describe("Home Page", () => {
  const mockMovies = [
    {
      id: 1,
      title: "Avatar",
      overview: "Um filme épico sobre alienígenas azuis...",
      vote_average: 8.5,
      vote_count: 25000,
      release_date: "2009-12-18",
      poster_path: "/avatar.jpg",
      backdrop_path: "/backdrop.jpg",
      genre_ids: [28, 12],
      adult: false,
      original_language: "en",
      original_title: "Avatar",
      popularity: 150.5,
      video: false,
    },
    {
      id: 2,
      title: "Interstellar",
      overview: "Uma jornada através do espaço...",
      vote_average: 9.0,
      vote_count: 30000,
      release_date: "2014-11-07",
      poster_path: "/interstellar.jpg",
      backdrop_path: "/interstellar-backdrop.jpg",
      genre_ids: [878, 18],
      adult: false,
      original_language: "en",
      original_title: "Interstellar",
      popularity: 120.8,
      video: false,
    },
  ];

  const mockSearchResults = [
    {
      id: 3,
      title: "Batman",
      overview: "O cavaleiro das trevas...",
      vote_average: 8.2,
      vote_count: 20000,
      release_date: "2022-03-04",
      poster_path: "/batman.jpg",
      backdrop_path: "/batman-backdrop.jpg",
      genre_ids: [28, 80],
      adult: false,
      original_language: "en",
      original_title: "The Batman",
      popularity: 200.3,
      video: false,
    },
  ];

  const defaultPopularMoviesState = {
    movies: mockMovies,
    loading: false,
    loadingMore: false,
    error: null,
    hasMore: true,
    loadMore: jest.fn(),
    refresh: jest.fn(),
  };

  const defaultSearchState = {
    searchQuery: "",
    setSearchQuery: jest.fn(),
    searchResults: [],
    loading: false,
    error: null,
    hasMore: false,
    clearSearch: jest.fn(),
    isSearching: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDiscoverPopularMovies.mockReturnValue(defaultPopularMoviesState);
    mockUseMovieSearch.mockReturnValue(defaultSearchState);
  });

  describe("Renderização Inicial", () => {
    it("deve renderizar todos os elementos principais da página", () => {
      render(<Home />);

      // Header
      expect(screen.getByText("TMDB Explorer")).toBeInTheDocument();
      expect(
        screen.getByText("Descubra os melhores filmes do mundo")
      ).toBeInTheDocument();

      // Search Bar
      expect(screen.getByTestId("search-bar")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Buscar filmes...")
      ).toBeInTheDocument();

      // Movie Section
      expect(screen.getByTestId("movie-section")).toBeInTheDocument();
      expect(screen.getByText("Filmes Populares")).toBeInTheDocument();
      expect(screen.getByText("2 filmes")).toBeInTheDocument();

      // Movies
      expect(screen.getByText("Avatar")).toBeInTheDocument();
      expect(screen.getByText("Interstellar")).toBeInTheDocument();
    });

    it("deve chamar os hooks personalizados", () => {
      render(<Home />);

      expect(mockUseDiscoverPopularMovies).toHaveBeenCalledTimes(1);
      expect(mockUseMovieSearch).toHaveBeenCalledTimes(1);
    });
  });

  describe("Estados de Scroll Infinito", () => {
    it("deve mostrar mensagem de fim quando não há mais filmes", () => {
      mockUseDiscoverPopularMovies.mockReturnValue({
        ...defaultPopularMoviesState,
        hasMore: false,
      });

      render(<Home />);

      expect(
        screen.getByText("Não existe mais filmes disponíveis!")
      ).toBeInTheDocument();
    });

    it("deve mostrar hint de scroll quando há mais filmes", () => {
      mockUseDiscoverPopularMovies.mockReturnValue({
        ...defaultPopularMoviesState,
        hasMore: true,
        loadingMore: false,
      });

      render(<Home />);

      expect(
        screen.getByText(
          "Role para baixo para carregar mais filmes automaticamente"
        )
      ).toBeInTheDocument();
    });
  });

  describe("Integração de Componentes", () => {
    it("deve passar props corretas para SearchBar", () => {
      const mockSetSearchQuery = jest.fn();
      const mockClearSearch = jest.fn();

      mockUseMovieSearch.mockReturnValue({
        ...defaultSearchState,
        searchQuery: "test query",
        setSearchQuery: mockSetSearchQuery,
        clearSearch: mockClearSearch,
        loading: true,
      });

      render(<Home />);

      expect(screen.getByDisplayValue("test query")).toBeInTheDocument();
      expect(screen.getByTestId("search-loading")).toBeInTheDocument();
    });

    it("deve passar props corretas para MovieSection", () => {
      render(<Home />);

      expect(screen.getByText("Filmes Populares")).toBeInTheDocument();
      expect(screen.getByText("2 filmes")).toBeInTheDocument();
    });
  });

  describe("Fluxos Completos", () => {
    it("deve simular fluxo completo de busca", async () => {
      const mockSetSearchQuery = jest.fn();

      // Estado inicial
      const { rerender } = render(<Home />);
      expect(screen.getByText("Filmes Populares")).toBeInTheDocument();

      // Simular digitação
      mockUseMovieSearch.mockReturnValue({
        ...defaultSearchState,
        searchQuery: "batman",
        setSearchQuery: mockSetSearchQuery,
        searchResults: mockSearchResults,
        isSearching: true,
      });

      rerender(<Home />);

      // Verificar resultados de busca
      expect(screen.getByText("Resultados da busca")).toBeInTheDocument();
      expect(screen.getByText("Batman")).toBeInTheDocument();
      expect(screen.queryByText("Filmes Populares")).not.toBeInTheDocument();
    });
  });
});
