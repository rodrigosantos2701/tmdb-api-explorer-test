import api from "./tmdb-api";
import { MovieResponse, MovieDetails } from "../types/movie";

export class MovieService {
  static async discoverPopularMovies(page: number = 1): Promise<MovieResponse> {
    try {
      const params = new URLSearchParams({
        include_adult: "false",
        include_video: "false",
        language: "en-US",
        page: page.toString(),
        sort_by: "popularity.desc",
      });

      const response = await api.get<MovieResponse>(
        `/discover/movie?${params}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
      throw new Error("Falha ao carregar filmes");
    }
  }

  static getImageUrl(path: string | null, size: string = "w500"): string {
    if (path) return `https://image.tmdb.org/t/p/${size}${path}`;
    else return "/placeholder-movie.svg";
  }

  static async getMovieDetails(id: number): Promise<MovieDetails> {
    try {
      const response = await api.get<MovieDetails>(`/movie/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar detalhes do filme:", error);
      throw new Error("Falha ao carregar detalhes do filme");
    }
  }

  static async searchMovies(
    query: string,
    page: number = 1
  ): Promise<MovieResponse> {
    try {
      const params = new URLSearchParams({
        query: query,
        include_adult: "false",
        language: "en-US",
        page: page.toString(),
      });

      const response = await api.get<MovieResponse>(`/search/movie?${params}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
      throw new Error("Falha ao buscar filmes");
    }
  }
}
