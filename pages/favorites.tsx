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
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorites", [])

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setFavoriteMovies([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
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

  const toggleFavorite = (movieId: string) => {
    setFavorites((prev) => {
      if (prev.includes(movieId)) {
        return prev.filter((id) => id !== movieId)
      } else {
        return [...prev, movieId]
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

        {error && <div className="p-4 mb-8 bg-red-500/10 text-red-500 rounded-lg">{error}</div>}

        {favoriteMovies.length > 0 ? (
          <MovieGrid movies={favoriteMovies} favorites={favorites} onToggleFavorite={toggleFavorite} />
        ) : (
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

