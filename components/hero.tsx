"use client"
import Link from "next/link"
import Image from "next/image"
import { Heart, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Movie } from "@/types/movie"

interface HeroProps {
  movie: Movie
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
}

export default function Hero({ movie, isFavorite, onToggleFavorite }: HeroProps) {
  return (
    <div className="relative w-full h-[70vh] md:h-[80vh]">
      {/* Backdrop Image */}
      <div className="absolute inset-0">
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
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
          <p className="text-lg text-muted-foreground mb-6 line-clamp-3">{movie.overview}</p>

          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href={`/movie/${movie.id}`}>
                <Play className="mr-2 h-5 w-5" />
                Watch Now
              </Link>
            </Button>
            <Button variant={isFavorite ? "secondary" : "outline"} size="lg" onClick={() => onToggleFavorite(movie.id)}>
              <Heart className={`mr-2 h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "Saved" : "Add to Favorites"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

