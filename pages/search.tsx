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
  // Get search query parameter from URL
  const q = router.query?.q

  // State variables for search results, loading state, and error messages
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Retrieve favorite movie IDs from local storage
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorites", [])

  // Fetch search results when the query changes
  useEffect(() => {
    if (!q || typeof q !== "string") return

    const fetchResults = async () => {
      try {
        setLoading(true)
        // Fetch movies that match the search query
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
        <title>Search Results {q ? `for "${q}"` : ""} - MovieMate</title>
        <meta name="description" content={q ? `Search results for ${q}` : "Movie search results"} />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground mb-8">
          {searchResults.length} results {q ? `for "${q}"` : ""}
        </p>

        {/* Display error message if fetching fails */}
        {error && <div className="p-4 mb-8 bg-red-500/10 text-red-500 rounded-lg">{error}</div>}

        {searchResults.length > 0 ? (
          // Display the list of search results
          <MovieGrid movies={searchResults} favorites={favorites} onToggleFavorite={toggleFavorite} />
        ) : (
          // Show a message if no results are found
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
