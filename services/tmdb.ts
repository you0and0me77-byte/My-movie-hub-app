
import { TMDB_API_KEY, TMDB_BASE_URL } from '../constants';
import { Movie } from '../types';

export const getTrendingMovies = async (): Promise<Movie[]> => {
  const response = await fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`);
  const data = await response.json();
  return data.results;
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
  const data = await response.json();
  return data.results;
};

export const getExternalIds = async (id: number): Promise<string | undefined> => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}/external_ids?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    return data.imdb_id;
  } catch (err) {
    console.error("Failed to fetch external IDs:", err);
    return undefined;
  }
};
