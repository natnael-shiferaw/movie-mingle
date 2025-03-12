"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Image from "next/image"
import { Heart } from "lucide-react"
import { fetchMovieDetails, fetchSimilarMovies } from "@/lib/api"
import type { Movie, MovieDetails } from "@/types/movie"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Button } from "@/components/ui/button"
import MovieGrid from "@/components/movie-grid"
import LoadingState from "@/components/loading-state"

export default function MovieDetailsPage() {
  const router = useRouter()
  const { id } = router.query
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorites", [])

  // Fetches movie details and similar movies when the component mounts
  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const movieData = await fetchMovieDetails(id as string)
        setMovie(movieData)

        const similar = await fetchSimilarMovies(id as string)
        setSimilarMovies(similar)
      } catch (err) {
        console.error("Error fetching movie details:", err)
        setError("Failed to fetch movie details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Toggles movie as a favorite
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

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-500">{error || "Movie not found"}</h2>
        <Button onClick={() => router.push("/")} className="mt-4">
          Back to Home
        </Button>
      </div>
    )
  }

  const isFavorite = favorites.includes(movie.id)

  return (
    <>
      <Head>
        <title>{movie.title} - MovieMate</title>
        <meta name="description" content={movie.overview.substring(0, 160)} />
      </Head>

      <main>
        <div className="relative h-[70vh] w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
          <Image
            src={
              movie.backdrop_path
                ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                : "/placeholder.svg?height=1080&width=1920"
            }
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 z-20 container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row gap-8 items-end">
              <div className="relative h-[225px] w-[150px] shadow-lg rounded-lg overflow-hidden shrink-0 hidden md:block">
                <Image
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/placeholder.svg?height=450&width=300"
                  }
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{movie.title}</h1>
                <div className="flex items-center gap-4 text-white/80 mb-4">
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                  <span>•</span>
                  <span>
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </span>
                  <span>•</span>
                  <span>{movie.vote_average.toFixed(1)} ★</span>
                </div>
                <div className="flex gap-4 mb-6">
                  <Button
                    onClick={() =>
                      window.open(
                        `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " trailer")}`,
                        "_blank",
                      )
                    }
                  >
                    Watch Trailer
                  </Button>
                  <Button variant={isFavorite ? "secondary" : "outline"} onClick={() => toggleFavorite(movie.id)}>
                    <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                    {isFavorite ? "Saved" : "Add to Favorites"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-primary/10 text-primary-foreground rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-muted-foreground mb-8">{movie.overview}</p>

              <h2 className="text-2xl font-bold mb-4">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                {movie.credits?.cast?.slice(0, 8).map((person) => (
                  <div key={person.id} className="text-center">
                    <div className="relative h-40 w-full rounded-lg overflow-hidden mb-2">
                      <Image
                        src={
                          person.profile_path
                            ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                            : "/placeholder.svg?height=185&width=185"
                        }
                        alt={person.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-sm">{person.name}</h3>
                    <p className="text-xs text-muted-foreground">{person.character}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Movie Info</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p>{movie.status}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Original Language</h3>
                  <p>{movie.original_language?.toUpperCase()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Budget</h3>
                  <p>${movie.budget?.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Revenue</h3>
                  <p>${movie.revenue?.toLocaleString()}</p>
                </div>
                {(movie.production_companies ?? []).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Production</h3>
                    <p>{movie.production_companies?.map((c) => c.name).join(", ")}</p>
                  </div>
                )}

              </div>
            </div>
          </div>

          {similarMovies.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
              <MovieGrid movies={similarMovies} favorites={favorites} onToggleFavorite={toggleFavorite} />
            </section>
          )}
        </div>
      </main>
    </>
  )
}

