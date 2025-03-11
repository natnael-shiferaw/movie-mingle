"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { searchMovies } from "@/lib/api"
import type { Movie } from "@/types/movie"
import { useLocalStorage } from "@/hooks/use-local-storage"
import MovieGrid from "@/components/movie-grid"
import LoadingState from "@/components/loading-state"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SearchPage() {
  const router = useRouter()
  // Handle the case where router.query might be undefined during initial render
  const q = router.query?.q
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorites", [])

  // checks if q exists and is a string
  useEffect(() => {
    if (!q || typeof q !== "string") return

    const fetchResults = async () => {
      try {
        setLoading(true)
        const results = await searchMovies(q)
        setSearchResults(results)
      } catch (err) {
        console.error("Error searching movies:", err)
        setError("Failed to search movies. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [q])

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
        <title>Search Results {q ? `for "${q}"` : ""} - MovieMate</title>
        <meta name="description" content={q ? `Search results for ${q}` : "Movie search results"} />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground mb-8">
          {searchResults.length} results {q ? `for "${q}"` : ""}
        </p>

        {error && <div className="p-4 mb-8 bg-red-500/10 text-red-500 rounded-lg">{error}</div>}

        {searchResults.length > 0 ? (
          <MovieGrid movies={searchResults} favorites={favorites} onToggleFavorite={toggleFavorite} />
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">No results found</h2>
            <p className="text-muted-foreground mb-8">We couldn't find any movies matching your search.</p>
            <Link href="/" passHref>
              <Button>Back to Home</Button>
            </Link>
          </div>
        )}
      </main>
    </>
  )
}
