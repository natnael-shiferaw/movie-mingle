"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Movie } from "@/types/movie"

interface MovieGridProps {
  movies: Movie[]
  favorites: string[]
  onToggleFavorite: (id: string) => void
}

export default function MovieGrid({ movies, favorites, onToggleFavorite }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={favorites.includes(movie.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}

interface MovieCardProps {
  movie: Movie
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
}

function MovieCard({ movie, isFavorite, onToggleFavorite }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative group rounded-lg overflow-hidden bg-muted/40 transition-all duration-200 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/movie/${movie.id}`} className="block">
        <div className="relative aspect-[2/3] w-full">
          <Image
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/placeholder.svg?height=450&width=300"
            }
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-2 right-2 z-10 bg-background/50 backdrop-blur-sm hover:bg-background/70 ${isFavorite ? "text-red-500" : "text-muted-foreground"} ${isHovered || isFavorite ? "opacity-100" : "opacity-0"} transition-opacity duration-200`}
        onClick={(e) => {
          e.preventDefault()
          onToggleFavorite(movie.id)
        }}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
      </Button>

      <div className="p-3">
        <Link href={`/movie/${movie.id}`} className="block">
          <h3 className="font-medium line-clamp-1 hover:text-primary transition-colors">{movie.title}</h3>
        </Link>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : "Unknown"}
          </span>
          <span className="text-xs font-medium">{movie.vote_average ? movie.vote_average.toFixed(1) : "?"} ★</span>
        </div>
      </div>
    </div>
  )
}

