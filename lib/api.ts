import type { Movie, MovieDetails } from "@/types/movie";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

if (!API_KEY) {
  throw new Error("NEXT_PUBLIC_TMDB_API_KEY is not defined in the environment variables");
}

// Helper function to fetch data from TMDB API
async function fetchFromAPI<T>(endpoint: string, queryParams: Record<string, string> = {}): Promise<T | null> {
  if (!API_KEY) {
    throw new Error("NEXT_PUBLIC_TMDB_API_KEY is not defined in the environment variables");
  }

  const queryString = new URLSearchParams({
    api_key: API_KEY as string, // Ensure API_KEY is a string
    language: "en-US",
    ...queryParams,
  }).toString();

  const url = `${BASE_URL}${endpoint}?${queryString}`;

  try {
    console.log(`Fetching: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Fetch failed: ${response.status} - ${response.statusText} - ${errorText}`);
      throw new Error(`Error fetching data: ${response.status} - ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}



// Fetch trending movies
export async function fetchTrendingMovies(): Promise<Movie[]> {
  console.log("Fetching trending movies...");
  const data = await fetchFromAPI<{ results: Movie[] }>("/trending/movie/week");

  if (!data || !data.results) {
    console.warn("No trending movies found");
    return []; // Return an empty array to prevent errors
  }

  console.log("Fetched trending movies:", data.results);
  return data.results;
}

// Fetch recommended movies based on a movie ID
export async function fetchRecommendedMovies(movieId: string): Promise<Movie[]> {
  console.log(`Fetching recommended movies for movie ID: ${movieId}`);
  const data = await fetchFromAPI<{ results: Movie[] }>(`/movie/${movieId}/recommendations`);

  if (!data || !data.results) {
    console.warn(`No recommended movies found for movie ID: ${movieId}`);
    return [];
  }

  console.log("Fetched recommended movies:", data.results);
  return data.results;
}

// Fetch popular movies
export async function fetchPopularMovies(): Promise<Movie[]> {
  console.log("Fetching popular movies...");
  const data = await fetchFromAPI<{ results: Movie[] }>("/movie/popular");

  if (!data || !data.results) {
    console.warn("No popular movies found");
    return [];
  }

  console.log("Fetched popular movies:", data.results);
  return data.results;
}

// Fetch movie details by ID
export async function fetchMovieDetails(id: string): Promise<MovieDetails> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=credits`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch movie details");
  }

  return res.json();
}


// Fetch similar movies
export async function fetchSimilarMovies(movieId: string): Promise<Movie[]> {
  console.log(`Fetching similar movies for movie ID: ${movieId}`);
  const data = await fetchFromAPI<{ results: Movie[] }>(`/movie/${movieId}/similar`);

  if (!data || !data.results) {
    console.warn(`No similar movies found for movie ID: ${movieId}`);
    return [];
  }

  console.log("Fetched similar movies:", data.results);
  return data.results;
}

// Search movies by query
export async function searchMovies(query: string): Promise<Movie[]> {
  console.log(`Searching movies for query: ${query}`);
  const data = await fetchFromAPI<{ results: Movie[] }>("/search/movie", { query: encodeURIComponent(query) });

  if (!data || !data.results) {
    console.warn(`No search results found for query: ${query}`);
    return [];
  }

  return data.results;
}



// Fetch multiple movies by IDs (for favorites)
export async function fetchMoviesByIds(movieIds: string[]): Promise<Movie[]> {
  console.log("Fetching movies by multiple IDs:", movieIds);
  
  const promises = movieIds.map(async (id) => {
    try {
      const movie = await fetchMovieDetails(id);
      if (!movie || !movie.id) throw new Error(`Invalid movie data for ID: ${id}`);
      return movie;
    } catch (err) {
      console.warn(`Skipping invalid movie ID: ${id}`, err);
      return null; // Skip failed requests
    }
  });

  const movies = (await Promise.all(promises)).filter(Boolean) as Movie[];
  console.log("Fetched valid movies:", movies);
  return movies;
}
