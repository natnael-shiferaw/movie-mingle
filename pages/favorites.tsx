"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { fetchMoviesByIds } from "@/lib/api"
import type { Movie } from "@/types/movie"
import { useLocalStorage } from "@/hooks/use-local-storage"
import MovieGrid from "@/components/movie-grid"
import LoadingState from "@/components/loading-state"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FavoritesPage() {
  // State to store favorite movies, loading state, and error messages
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Retrieve favorite movie IDs from local storage
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorites", [])

  useEffect(() => {
    const fetchFavorites = async () => {
      // If no favorites are saved, clear the list and stop loading
      if (favorites.length === 0) {
        setFavoriteMovies([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Fetch details of all favorite movies
        const movies = await fetchMoviesByIds(favorites)
        setFavoriteMovies(movies)
      } catch (err) {
        console.error("Error fetching favorite movies:", err)
        setError("Failed to fetch your favorite movies. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [favorites])

  // Function to add or remove movies from favorites
  const toggleFavorite = (movieId: string) => {
    setFavorites((prev) => {
      if (prev.includes(movieId)) {
        return prev.filter((id) => id !== movieId) // Remove from favorites
      } else {
        return [...prev, movieId] // Add to favorites
      }
    })
  }

  if (loading) {
    return <LoadingState />
  }

  return (
    <>
      <Head>
        <title>My Favorites - MovieMate</title>
        <meta name="description" content="Your saved favorite movies" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Favorites</h1>

        {/* Display error message if fetching fails */}
        {error && <div className="p-4 mb-8 bg-red-500/10 text-red-500 rounded-lg">{error}</div>}

        {favoriteMovies.length > 0 ? (
          // Display the list of favorite movies
          <MovieGrid movies={favoriteMovies} favorites={favorites} onToggleFavorite={toggleFavorite} />
        ) : (
          // Show a message when no favorites are saved
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">No favorites yet</h2>
            <p className="text-muted-foreground mb-8">Start adding movies to your favorites to see them here.</p>
            <Link href="/" passHref>
              <Button>Browse Movies</Button>
            </Link>
          </div>
        )}
      </main>
    </>
  )
}

