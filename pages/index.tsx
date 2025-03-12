"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Head from "next/head"
import MovieGrid from "@/components/movie-grid"
import Hero from "@/components/hero"
import { fetchTrendingMovies, fetchRecommendedMovies } from "@/lib/api"
import type { Movie } from "@/types/movie"
import { useLocalStorage } from "@/hooks/use-local-storage"
import LoadingState from "@/components/loading-state"

export default function Home() {
  // State to store trending and recommended movies
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([])

  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  // Local storage for favorite movies
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorites", [])
  const favoritesRef = useRef(favorites)

  // Keep `favoritesRef` updated with the latest favorites
  useEffect(() => {
    favoritesRef.current = favorites
  }, [favorites])

   // Fetch trending and recommended movies
  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true)
      const trending = await fetchTrendingMovies()
      setTrendingMovies(trending)

      // Fetch recommended movies based on the first favorite movie (if any)
      const recommended = await fetchRecommendedMovies(favoritesRef.current.length > 0 ? favoritesRef.current[0] : "")
      setRecommendedMovies(recommended)
    } catch (err) {
      console.error("Error fetching movies:", err)
      setError("Failed to fetch movies. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMovies()
  }, [])

  // Toggle favorite movies in local storage
  const toggleFavorite = useCallback(
    (movieId: string) => {
      setFavorites((prev) => {
        if (prev.includes(movieId)) {
          return prev.filter((id) => id !== movieId)
        } else {
          return [...prev, movieId]
        }
      })
    },
    [setFavorites],
  )
  // Show loading state while fetching movies
  if (loading) {
    return <LoadingState />
  }
  // Show error message if fetching fails
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-500">{error}</h2>
        <button onClick={fetchMovies} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>MovieMate - Find Your Next Favorite Movie</title>
        <meta name="description" content="Discover trending movies and get personalized recommendations" />
      </Head>

      <main className="min-h-screen">
        {/* Hero section featuring the first trending movie */}
        {trendingMovies.length > 0 && (
          <Hero
            movie={trendingMovies[0]}
            isFavorite={favorites.includes(trendingMovies[0].id)}
            onToggleFavorite={toggleFavorite}
          />
        )}

        <div className="container mx-auto px-4 py-12">
          {/* Trending Movies Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Trending Movies</h2>
            <MovieGrid movies={trendingMovies} favorites={favorites} onToggleFavorite={toggleFavorite} />
          </section>

          {/* Recommended Movies Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>
            {recommendedMovies.length > 0 ? (
              <MovieGrid movies={recommendedMovies} favorites={favorites} onToggleFavorite={toggleFavorite} />
            ) : (
              <p className="text-muted-foreground">
                Save some movies as favorites to get personalized recommendations!
              </p>
            )}
          </section>
        </div>
      </main>
    </>
  )
}

