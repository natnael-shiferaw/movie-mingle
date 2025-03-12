// Interface representing basic movie details
export interface Movie {
  id: string
  title: string
  overview: string
  poster_path: string | null // Path to movie's poster image
  backdrop_path: string | null // Path to movie's backdrop image
  release_date: string
  vote_average: number
}

// Extended interface for detailed movie information
export interface MovieDetails extends Movie {
  runtime: number
  status: string
  budget: number
  revenue: number
  original_language: string
  genres: {
    id: number
    name: string
  }[] // List of movie genres
  production_companies?: {
    id: number
    name: string
  }[]
  credits?: {
    cast: {
      id: number
      name: string
      character: string
      profile_path: string | null
    }[]
  }
}

